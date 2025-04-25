/**
 * WhatsApp Flows Server - Multi Flow Routing
 * Based on Meta example, adapted to support multiple flows by route
 */

import express from "express";
import crypto from "crypto";
import { decryptRequest, encryptResponse, FlowEndpointException } from "./encryption.js";

// Importar todos los flows disponibles
import * as appointment from "./screens/flowAppointment.js";
import * as flow from "./screens/flow.js";

const app = express();
const flows = {
  appointment,
  flow,
};

app.use(
  express.json({
    verify: (req, res, buf, encoding) => {
      req.rawBody = buf?.toString(encoding || "utf8");
    },
  })
);

const { FLOW_TOKEN, APP_SECRET, PRIVATE_KEY, PASSPHRASE = "", PORT = "3000" } = process.env;

// Registrar una ruta POST para cada flow
Object.entries(flows).forEach(([route, flowModule]) => {
  app.post(`/${route}`, async (req, res) => {
    console.log(`📩 Request received on /${route}`);

    if (!PRIVATE_KEY) {
      console.error("❌ PRIVATE_KEY is missing in environment variables");
      return res.status(500).send("Server configuration error.");
    }

    if (!isRequestSignatureValid(req)) {
      return res.status(432).send(); // Signature invalid
    }

    let decryptedRequest;
    try {
      decryptedRequest = decryptRequest(req.body, PRIVATE_KEY, PASSPHRASE);
    } catch (err) {
      console.error("❌ Decryption error:", err);
      if (err instanceof FlowEndpointException) {
        return res.status(err.statusCode).send();
      }
      return res.status(500).send();
    }

    const { aesKeyBuffer, initialVectorBuffer, decryptedBody } = decryptedRequest;
    console.log("💬 Decrypted body:", decryptedBody);

    try {
      const screenResponse = await flowModule.getNextScreen(decryptedBody);
      console.log("👉 Encrypted response ready to send.");
      res.send(encryptResponse(screenResponse, aesKeyBuffer, initialVectorBuffer));
    } catch (err) {
      console.error("❌ Flow handler error:", err);
      return res.status(500).send();
    }
  });
});

// Ruta GET para saludos simples
app.get("/", (req, res) => {
  res.send(`<pre>✅ WhatsApp Flows server is running.
POST to /appointment or /compras to begin.
</pre>`);
});

app.listen(PORT, () => {
  console.log(`🚀 Server is listening on port ${PORT}`);
});

// Validar firma HMAC SHA-256
function isRequestSignatureValid(req) {
  if (!APP_SECRET) {
    console.warn("⚠️ APP_SECRET not configured. Skipping signature validation.");
    return true;
  }

  const signatureHeader = req.get("x-hub-signature-256");
  if (!signatureHeader) return false;

  const signatureBuffer = Buffer.from(signatureHeader.replace("sha256=", ""), "utf-8");

  const hmac = crypto.createHmac("sha256", APP_SECRET);
  const digest = hmac.update(req.rawBody).digest("hex");
  const digestBuffer = Buffer.from(digest, "utf-8");

  const isValid = crypto.timingSafeEqual(digestBuffer, signatureBuffer);
  if (!isValid) {
    console.error("❌ Invalid request signature.");
  }

  return isValid;
}
