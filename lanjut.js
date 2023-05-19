import { KeyvFile } from 'keyv-file';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import { BingAIClient } from '@waylaidwanderer/chatgpt-api';
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
const igdown = require('igdown-scrapper');

const link = "https://www.instagram.com/reel/CpG_5lqDJsh/";

igdown(link)
  .then((res) => {
    console.log();
  })
  .catch((err) => {
    console.error(err);
  });