import fs from 'fs';
import fetch from 'node-fetch';

const phoneNumberId = process.env.PHONE_NUMBER_ID; // ⚠️ REEMPLAZÁ ESTO
const accessToken = process.env.ACCESS_TOKEN; // ⚠️ REEMPLAZÁ ESTO

console.log('📂 Leyendo clave pública...');
let publicKey = '';
try {
  publicKey = fs.readFileSync('./public_key.pem', 'utf8');
  console.log('✅ Clave pública leída correctamente');
} catch (err) {
  console.error('❌ Error leyendo la clave pública:', err.message);
  process.exit(1);
}

const url = `https://graph.facebook.com/v19.0/${phoneNumberId}/whatsapp_business_flows_public_key`;

const payload = {
  key: publicKey
};

console.log('🚀 Enviando petición a Facebook...');

fetch(url, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(payload)
})
  .then(async res => {
    const json = await res.json();
    if (!res.ok) {
      console.error('❌ Error en la respuesta:', json);
    } else {
      console.log('✅ Clave pública subida correctamente:', json);
    }
  })
  .catch(err => {
    console.error('❌ Error haciendo fetch:', err.message);
  });
