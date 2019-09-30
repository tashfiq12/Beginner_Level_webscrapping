const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const writeStream = fs.createWriteStream('Notices_MIST.csv');
writeStream.write(`Date,Notice \n`);
writeStream.write(`\n\n`);

request('https://mist.ac.bd', (error, response, html) => {
  if (!error && response.statusCode == 200) {
    const $ = cheerio.load(html);
    var noticearraylist = [];
    let noticeMap = new Map();

    $('article.event').each((i, el) => {
      const notticetitle = $(el)
        .find('h3.event-title')
        .text()
        .trim();
      const noticeday = $(el)
        .find('a.date')
        .text();
      var noticeobject = new Object();
      noticeobject.notticetitle = notticetitle;
      noticeobject.noticedate = noticeday;
      if (noticeMap.get(notticetitle) !== 1) {
        noticearraylist.push(noticeobject);
        noticeMap.set(notticetitle, 1);
      }
    });

    for (let notice of noticearraylist) {
      writeStream.write(`${notice.noticedate},${notice.notticetitle} \n`);
    }
  }
});
