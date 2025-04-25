1. You need to have a access to a facebook account and log in to Whatsapp Manager: https://business.facebook.com/business/loginpage,
From there you need to create a business (also called a commercial portfolio).

2. Once you have created yout commercial protfolio, facebook might ask you to link an Add Account, if you dont have one, you may need to create it under the same commercial portfolio (I’m still checking this — it might not be required.)

3. After that, go to Settings -> Accounts -> Apps, and create a new app for the portfolio, you'll be redirected to the: https://developers.facebook.com/apps/creation this link takes you to the 'Whatsapp Business' where you manage the app you created.

4. Once the app is created, you'll be redirect to the panel of apps, from there,  add the WhatsApp product to your app and go to WhatsApp → API configuration in the left menu.

- Generate an access token and save it.
- Take the Phone Number ID and WhatsApp Business Account ID and save it.
- Add a phone number to use for testing (you’ll receive messages there).

5. Once the API is set up, go to the Quick Start section and click on "Manage Flows" to start creating or managing your WhatsApp Flows.

6. Check your email and verify your meta account.

7. Then, go back to https://business.facebook.com, where you created your commercial portfolio.

- Click on More Tools → WhatsApp Manager.
- In the Phone Numbers section, you’ll see the test numbers you’ve set up to try out your flows.
- In the Flows section, you can view and manage the flows you create and test them there.

8. To continue with the configuration:

- In the left menu, go to Business Settings of your commercial portfolio.
- Navigate to Users → System Users, and create a new system user with Admin access.
- Before generating the token, assign assets to this system user:
  - Assign the previously created App and WhatsApp Account.

- Then, generate a System User Token, selecting:
  - The App you created.
  - An appropriate expiration time.
  - The following permissions:
    - business_management
    - whatsapp_business_messaging
    - whatsapp_business_management
    - whatsapp_business_manage_events

- Save the generated token.

9. At this point, the initial configuration is complete.
However, to test and manage your WhatsApp Flows, you'll need to set up a server hosted on a public URL.
This server will host the flows you want to test, and WhatsApp will communicate with it to send and receive data.
To get started quickly, you can use one of the available templates from this GitHub repository: https://github.com/WhatsApp/WhatsApp-Flows-Tools/tree/main

10. Once the server is up and running, you’ll need to configure the public and private keys. These are generated using the provided keyGenerator.js script, which takes a PASSPHRASE argument used to encrypt the keys. "node src/keyGenerator.js yourPassphraseHere"
The script will output both keys:
- The private key (encrypted using the passphrase), which should be securely stored.
- The public key, which must be uploaded to Meta.

11. Before using the public key, it must be activated by uploading it to Meta's API. This is done by making a POST request to the following endpoint:
- "https://graph.facebook.com/v22.0/<YOUR_PHONE_NUMBER_ID>/whatsapp_business_encryption"
  - Use the access token you generated earlier, and send the raw public key exactly as it was generated — including all the line breaks and formatting. Do not modify or minify the key.

Here's an example using curl:
- "curl --location 'https://graph.facebook.com/v22.0/<YOUR_PHONE_NUMBER_ID>/whatsapp_business_encryption' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--header 'Authorization: Bearer YOUR_ACCESS_TOKEN' \
--data-urlencode 'business_public_key=-----BEGIN PUBLIC KEY-----
...YOUR PUBLIC KEY HERE...
-----END PUBLIC KEY-----'"

After this step, your public key will be registered and ready to be used for verifying signatures and encrypting/decrypting messages within your flow server.

12. Once your server is running, if you want to interact with a flow, go back to the page: https://business.facebook.com/latest/whatsapp_manager/flows. There, you can create a new flow or edit an existing one. To test the flow with your running server, both must be in sync (same structure and logic).

13. When creating the flow, you'll be asked to set an endpoint.
- Enter the URL of your running server's endpoint.
- Connect the flow to the app you created earlier.
- Test the connection to ensure everything is working correctly.
Once the endpoint is verified and connected, you're ready to start testing your WhatsApp Flow.

⚠️ When testing the flow, you will be asked to provide a Flow Token.
This token is chosen by you and must match the token your server is expecting.
Make sure to set the same Flow Token in both the flow configuration and your server’s environment/configuration.

⚠️ Important Note:
If, at any point, you're unable to test your flows (for example, the test number doesn't send messages to your phone), it might be because your business (commercial portfolio) is not verified.
To fully use WhatsApp Flows and receive messages on your test number, business verification is required.


# API GRAPH EXPLORER:
# http://developers.facebook.com/tools/explorer?method=GET&path=me%3Ffields%3Did%2Cfirst_name&version=v22.0

# WHATSAPP MANAGER:
# https://business.facebook.com/latest/whatsapp_manager/overview/?business_id=976361621280514&tab=home&nav_ref=whatsapp_manager&asset_id=1036809814985891

# WHATSAPP BUSINESS: aqui es donde creamos las apps de negocio, podemos config la api y obtener el access token de la api y se encuentra en:
# https://developers.facebook.com/apps/1607821816586023/whatsapp-business/wa-dev-console/?business_id=976361621280514

# DEPURADOR DE ACCESS TOKENS: para conocer mas sobre los tokens esta en
# https://developers.facebook.com/tools/debug/accesstoken



# DOCUMENTATION:

# API GRAPH:
# https://developers.facebook.com/docs/graph-api/get-started

# POSTMAN COLLECTION FLOWS: dentro de lo que es postman tenemos una collection que es para conocer mas la api y se encuentra en :
# https://www.postman.com/meta/whatsapp-business-platform/overview

# ACCESS TOKENS DE META: para conocer mas sobre los tokens esta en
# https://developers.facebook.com/docs/facebook-login/guides/access-tokens

# Flows Encryption
# https://developers.facebook.com/docs/whatsapp/cloud-api/reference/whatsapp-business-encryption#set-business-public-key

# api cloud
# https://developers.facebook.com/docs/whatsapp/cloud-api/get-started

# whatsapp Flows
# https://developers.facebook.com/docs/whatsapp/flows/gettingstarted

# API de administración de WhatsApp Business
# https://developers.facebook.com/docs/whatsapp/business-management-api


Documentacion que traia el reporistorio:

# WhatsApp Flow Endpoint Server
This endpoint example is designed to be used with the [appointment booking Flow template](https://developers.facebook.com/docs/whatsapp/flows/examples/templates#book-an-appointment)

## Flow Endpoint Docs

Refer to the [docs here for implementing your Flow Endpoint](https://developers.facebook.com/docs/whatsapp/flows/guides/implementingyourflowendpoint)

## ⚠️ WARNING ⚠️

- This project is meant to be an example for prototyping only. It's not production ready.
- When you remix (fork) this project on Glitch, your code is public by default, unless you choose to make it private (requires paid subscription to Glitch). Do not use this for any proprietary/private code.
- Env variables are stored & managed by Glitch. Never use the private keys for your production accounts here. Create a temporary private key for testing on Glitch only and replace it with your production key in your own infrastructure.
- Running this endpoint example on Glitch is completely optional and is not required to use WhatsApp Flows. You can run this code in any other environment you prefer.

## Glitch Setup

1. Create an account on Glitch to have access to all features mentioned here.
2. Remix this project on Glitch.
3. Create a private & public key pair for testing, if you haven't already, using the included script `src/keyGenerator.js`. Run the below command in the terminal to generate a key pair, then follow [these steps to upload the key pair](https://developers.facebook.com/docs/whatsapp/flows/guides/implementingyourflowendpoint#upload_public_key) to your business phone number.
```
node src/keyGenerator.js {passphrase}
```
4. Click on the file ".env" on the left sidebar, **then click on `✏️ Plain text` on top. Do not edit it directly from UI as it will break your key formatting.**
5. Edit it with your private key and passphrase. Make sure a multiline key has the same line breaks like below. Env variables are only visible to the owner of the Glitch project. **Use a separate private key for testing only, and not your production key.**
```
PASSPHRASE="my-secret"

PRIVATE_KEY="-----[REPLACE THIS] BEGIN RSA PRIVATE KEY-----
MIIE...
...
...xyz
-----[REPLACE THIS] END RSA PRIVATE KEY-----"
```

6. Use the new Glitch URL as your endpoint URL, eg: `https://project-name.glitch.me`. You can find this URL by clicking on `Share` on top right, then copy the `Live Site` URL.
7. Edit `src/flow.js` with your logic to navigate between the Flow screens.
8. Click on the `Logs` tab at the bottom to view server logs. The logs section also has a button to attach a debugger via Chrome devtools.



