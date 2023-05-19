# Instagram Video, Photo Downloader Scrapper
Scrap data from a Instagram Video, Photo downloader and get direct info & url links from your Instagram

## Install
```
npm install igdown-scrapper
```

## Changelog
- #### v1.1.0
  - Change api.

## Usage
```
const igdown = require('igdown-scrapper');

const link = "https://www.instagram.com/reel/CpG_5lqDJsh/";

igdown(link)
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.error(err);
  });
```

## Issues & Contact
- Create issue session in [Github Repo](https://github.com/Aromakelapa/igdown/issues)

- You can reach me on [Telegram](https://t.me/Aromakelapa)

### Thanks for using my module, Hope you forgive me if it shows an error, because I'm newbie at this :>
