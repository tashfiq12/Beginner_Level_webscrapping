const request = require('request')
const cheerio = require('cheerio')
const fs = require('fs')
const url="https://mist.ac.bd"
const writeStream = fs.createWriteStream('Notices_MIST.csv')
writeStream.write(`Date,Title,Link \n`)
writeStream.write(`\n\n`)

request(url, (error, response, html) => {
  if (!error && response.statusCode == 200) {
    const $ = cheerio.load(html);
    var noticearraylist = []
    let noticeMap = new Map()

    $('div .spost').each((i, el) => {
      const notticetitle = $(el) .find('h4 a').text().trim()
      const noticelink=url+($(el).find('h4 a').attr('href'))
      const noticedate= ($(el).find('.event_date .month').text()) +" "+ ($(el).find('.event_date .date').text())

      console.log(notticetitle+"  "+noticelink+"  "+noticedate)
      var noticeobject = new Object()
      noticeobject.noticedate = noticedate
      noticeobject.notticetitle = notticetitle
      noticeobject.noticelink= noticelink
      if (noticeMap.get(notticetitle) !== 1) {
        noticearraylist.push(noticeobject)
        noticeMap.set(notticetitle, 1)
      }
    });

    for (let notice of noticearraylist) {
      writeStream.write(`${notice.noticedate},${notice.notticetitle},${notice.noticelink} \n`);
    }
  }
});
