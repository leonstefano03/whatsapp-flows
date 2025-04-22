import fs from 'fs';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import querystring from 'querystring';

dotenv.config();

const phoneNumberId = process.env.PHONE_NUMBER_ID;
const accessToken = process.env.USER_TOKEN;

console.log('📂 Leyendo clave pública...');
let publicKey = '';
try {
  publicKey = fs.readFileSync('./public_key.pem', 'utf8');
  console.log('✅ Clave pública leída correctamente');
} catch (err) {
  console.error('❌ Error leyendo la clave pública:', err.message);
  process.exit(1);
}

const url = `https://graph.facebook.com/v22.0/${phoneNumberId}/whatsapp_business_encryption`;

const body = querystring.stringify({
  business_public_key: publicKey
});

console.log('🚀 Enviando clave pública...');

fetch(url, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  body
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
    console.error('❌ Error en el fetch:', err.message);
  });
