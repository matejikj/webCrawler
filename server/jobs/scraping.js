const { parentPort, workerData } = require('worker_threads');

const axios = require('axios');
var cheerio = require('cheerio');
var URL = require('url-parse');

async function main() {
  console.log(Date.now())
  if (workerData) {
    pagesVisited = {};
    pagesToVisit = [];
    numPagesVisited = 0
    pagesToVisit.push(workerData.url);

    while (pagesToVisit.length !== 0) {
      var nextPage = pagesToVisit.pop();
      if ( nextPage !== undefined && pagesVisited[nextPage] === undefined ) {
        console.log(nextPage)
        pagesVisited[nextPage] = true;
        numPagesVisited++;
        let res = await axios(nextPage)
        var $ = cheerio.load(res.data);
        var relativeLinks = $(workerData.regexp);
        relativeLinks.each(function() {
          pagesToVisit.push(workerData.url + $(this).attr('href'));
        });
      }
      console.log("DELKAAA ", pagesToVisit.length)
    }
    console.log(Date.now())
    console.log('CRAWLING ONE DONE')
  }
}

main().catch(err => console.log(err));