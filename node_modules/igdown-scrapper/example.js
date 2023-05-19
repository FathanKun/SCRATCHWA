const igdown = require('./index.js');

igdown('https://www.instagram.com/reel/CpG_5lqDJsh/')
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });