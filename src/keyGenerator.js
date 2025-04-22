import crypto from "crypto";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const passphrase = process.env.PASSPHRASE;
if (!passphrase) {
  throw new Error(
    "⚠️  Passphrase vacía. Usá: node src/keyGenerator.js {passphrase}"
  );
}

try {
  const keyPair = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: "spki",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs1",
      format: "pem",
      cipher: "des-ede3-cbc",
      passphrase,
    },
  });

  // Escribir la clave pública en archivo
  fs.writeFileSync("public_key.pem", keyPair.publicKey, "utf8");

  // Mostrar por consola lo que se copia al .env
  console.log(`
************* COPIAR EN .env *************
PASSPHRASE="${passphrase}"

PRIVATE_KEY="${keyPair.privateKey}"
************* COPIAR EN .env *************

📁 La clave pública está guardada en public_key.pem
`);

} catch (err) {
  console.error("❌ Error generando las claves:", err);
}

