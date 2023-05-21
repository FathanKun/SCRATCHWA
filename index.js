import { createRequire } from "module"
import { KeyvFile } from 'keyv-file';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import { BingAIClient } from '@waylaidwanderer/chatgpt-api';
import * as fs from "fs";
const require = createRequire(import.meta.url)
// Menampahkan Dependencies
const igdown = require('igdown-scrapper');
const ttdl =  require("tiktok-video-downloader");
const {
  default: makeWASocket,
  DisconnectReason,
  useSingleFileAuthState
} = require("@adiwajshing/baileys");
const { Boom } = require("@hapi/boom");
const { state, saveState } = useSingleFileAuthState("./login.json");
const Keyv = require('keyv')


//Bagian Koding ChatGPT
const keyv = new Keyv({
  store: new KeyvFile()
});
// More options with default value:
const key = new Keyv({
  store: new KeyvFile({
    filename: `./db.json`, // the file path to store the data
    expiredCheckDelay: 5 * 1000, // ms, check and remove expired data in each ms
    writeDelay: 100, // ms, batch write to disk in a specific duration, enhance write performance.
    encode: JSON.stringify, // serialize function
    decode: JSON.parse // deserialize function
  })
})


async function chat(kontol) {
  const options = {
    userToken: '1bFYqJ713VYykO1SAg4BW8Nfhi0K2lVy-vl3Qvx3IY56vAohJgFC04f3O5vWD1dzq11NnEWrehCv3Cr7555aVOdGpZtI2iZ5Sq1Gj2q7SiouvIoj2PYo3ccJ_raUPOqXndI72hZS-DbevOkYLOB3SKGfS6hGgYr5U7ydGAoBsshGDPkS4BB6ukyhfcqLhYWE5FJPodG8Z7AhTFSKykjqCsA',
  };
  const sydneyAIClient = new BingAIClient({
    ...options
  });
  let jailbreakResponse = await sydneyAIClient.sendMessage(kontol, {
    jailbreakConversationId: true,
  });
  let res = jailbreakResponse.response
  await key.set("cid", jailbreakResponse.jailbreakConversationId)
  await key.set("mid", jailbreakResponse.messageId)
  return res.replace(/Sydney/, 'Fana')
}


async function lanjut(kontol) {
  const options = {
    userToken: '1bFYqJ713VYykO1SAg4BW8Nfhi0K2lVy-vl3Qvx3IY56vAohJgFC04f3O5vWD1dzq11NnEWrehCv3Cr7555aVOdGpZtI2iZ5Sq1Gj2q7SiouvIoj2PYo3ccJ_raUPOqXndI72hZS-DbevOkYLOB3SKGfS6hGgYr5U7ydGAoBsshGDPkS4BB6ukyhfcqLhYWE5FJPodG8Z7AhTFSKykjqCsA',
  };
  const sydneyAIClient = new BingAIClient({
    ...options
  });
  let jailbreakResponse = await sydneyAIClient.sendMessage(kontol, {
    jailbreakConversationId: await key.get("cid"),
    parentMessageId: await key.get("mid"),
  });
  let res = jailbreakResponse.response
  await key.set("cid", jailbreakResponse.jailbreakConversationId)
  await key.set("mid", jailbreakResponse.messageId)
  return res.replace(/Sydney/, 'Fana')
}

//Fungsi OpenAI ChatGPT untuk Mendapatkan Respon
const express = require("express")

const server = express()

server.all("/", (req, res) => {
  res.send("Bot is running!")
})

server.listen(3000, () => {
  console.log("Server is ready.")
})

// Fungsi Utama Sharon WA Bot
async function connectToWhatsApp() {

  //Buat sebuah koneksi baru ke WhatsApp
  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
    defaultQuertTimeoutMs: undefined
  });

  //Fungsi untuk Mantau Koneksi Update
  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === "close") {
      const shouldReconnect = (lastDisconnect.error = Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log("Koneksi terputus karena ", lastDisconnect.error, ", hubugkan kembali!", shouldReconnect);
      if (shouldReconnect) {
        connectToWhatsApp();
      }
    }
    else if (connection === "open") {
      console.log("Koneksi tersambung!")
    }
  });
  sock.ev.on("creds.update", saveState);

  //Fungsi Untuk Mantau Pesan Masuk
  sock.ev.on("messages.upsert", async ({ messages, type }) => {
    console.log("Tipe Pesan: ", type);
    console.log(messages);
    if (type === "notify" && !messages[0].key.fromMe) {
      try {

        //Dapatkan nomer pengirim dan isi pesan
        await sock.readMessages([messages[0].key])
        const senderNumber = messages[0].key.remoteJid;
        let incomingMessages = messages[0].message.conversation;
        if (incomingMessages === "") {
          incomingMessages = messages[0].message.extendedTextMessage.text;
        }
        incomingMessages = incomingMessages;

        //Dapatkan Info Pesan dari Grup atau Bukan 
        //Dan Pesan Menyebut bot atau Tidak
        const isMessageFromGroup = senderNumber.includes("@g.us");
        const isMessageMentionBot = incomingMessages.includes("@6287844113305");

        //Tampilkan nomer pengirim dan isi pesan
        console.log("Nomer Pengirim:", senderNumber);
        console.log("Isi Pesan:", incomingMessages);

        //Tampilkan Status Pesan dari Grup atau Bukan
        //Tampilkan Status Pesan Mengebut Bot atau Tidak
        console.log("Apakah Pesan dari Grup? ", isMessageFromGroup);
        console.log("Apakah Pesan Menyebut Bot? ", isMessageMentionBot);

        //Kalo misalkan nanya langsung ke Bot / JAPRI
        if (!isMessageFromGroup) {

          //Jika ada yang mengirim pesan mengandung kata 'siapa'
          if (incomingMessages.startsWith('.')) {
            const result = await chat(incomingMessages);
            console.log(result);
            await sock.sendMessage(
              senderNumber,
              { text: `${result.replace(/\[[^)]*\]/g, "")}` },
              { quoted: messages[0] },
              2000
            )
          }
          if (incomingMessages.includes('instagram')) {
            let msg = incomingMessages.substring(0, incomingMessages.indexOf('?'))
            let link = await igdown(incomingMessages)
            try {
              await sock.sendMessage(
              senderNumber,
              {
                video: {url:link.url[0].url},
                gifPlayback:false
              },{ quoted: messages[0] })
            } catch (err){
               for (link of link) {
              await sock.sendMessage(
              senderNumber,
              {
                video: {url:link.url[0].url},
                gifPlayback:false
              },{ quoted: messages[0] })
              }
            }
  
          }if (incomingMessages.includes('tiktok')) {
            let link = await ttdl.getInfo(incomingMessages)
              await sock.sendMessage(
              senderNumber,
              {
                video: {url:link.video.url.no_wm},
                gifPlayback:false
              },{ quoted: messages[0] })
            } else {
            const result = await lanjut(incomingMessages);
            console.log(result);
            await sock.sendMessage(
              senderNumber,
              { text: `${result.replace(/\[[^)]*\]/g, "")}` },
              { quoted: messages[0] },
              2000
            );

          }
        }
        
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////
        
        //Kalo misalkan nanya via Group
        if (isMessageFromGroup && isMessageMentionBot) {
            incomingMessages = incomingMessages.replace(/@\w+\s?/g,"").trim()
          //Jika ada yang mengirim pesan mengandung kata 'siapa'
          if (incomingMessages.startsWith('.')) {
            const result = await chat(incomingMessages);
            console.log(result);
            await sock.sendMessage(
              senderNumber,
              { text: `${result.replace(/\[[^)]*\]/g, "")}` },
              { quoted: messages[0] },
              2000
            );

          }if (incomingMessages.includes('instagram')) {
            let msg = incomingMessages.substring(0, incomingMessages.indexOf('?'))
            let link = await igdown(incomingMessages)
            try {
              await sock.sendMessage(
              senderNumber,
              {
                video: {url:link.url[0].url},
                gifPlayback:false
              },{ quoted: messages[0] })
            } catch (err){
               for (link of link) {
              await sock.sendMessage(
              senderNumber,
              {
                video: {url:link.url[0].url},
                gifPlayback:false
              },{ quoted: messages[0] })
              }
            }
  
          }if (incomingMessages.includes('tiktok')) {
            let link = await ttdl.getInfo(incomingMessages)
              await sock.sendMessage(
              senderNumber,
              {
                video: {url:link.video.url.no_wm},
                gifPlayback:false
              },{ quoted: messages[0] })
            } else {
            const result = await lanjut(incomingMessages);
            console.log(result);
            await sock.sendMessage(
              senderNumber,
              { text: `${result.replace(/\[[^)]*\]/g, "")}` },
              { quoted: messages[0] },
              2000
            );

          }
        }



      } catch (error) {
        console.log(error);
      }
    }
  });

}

connectToWhatsApp().catch((err) => {
  console.log("Ada Error: " + err);
});
