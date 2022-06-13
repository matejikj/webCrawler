const { parentPort, workerData } = require('worker_threads');

const axios = require('axios');
var cheerio = require('cheerio');
var URL = require('url-parse');
const db = require('../models');
const Webpage = db.webpages;

async function addLinks(links, url) {
  await Webpage.find({ url: url })
    .then(findRes => {
      if (findRes.length === 1) {
        console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAa")
        console.log(findRes)
        // Webpage
        //   .update(
        //     { url: url },
        //     {
        //       $set: {
        //         nodes: links
        //       }
        //     })
        //     .then(data => {
        //       res.send(data);
        //     })
        //   .catch(err => {
        //     res.status(500).send({
        //       message:
        //         err.message || "Some error occurred while creating the Webpage."
        //     });
        //   });
      } else {
        res.status(200).send({
          message:
            "Url is existing"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Webpages"
      });
    });
}

async function main() {
  if (workerData) {
    links = []
    pagesVisited = {};
    pagesToVisit = [];
    numPagesVisited = 0
    pagesToVisit.push(workerData.url);
    var startTime = new Date().toLocaleString();
  
    while (pagesToVisit.length !== 0) {
      var nextPage = pagesToVisit.pop();
      if ( nextPage !== undefined && pagesVisited[nextPage] === undefined ) {
        console.log(nextPage)
        var t0 = performance.now();
        pagesVisited[nextPage] = true;
        numPagesVisited++;
        let res = {}
        try {
          res = await axios(nextPage) 
        } catch (error) {
          continue
        }
        var $ = cheerio.load(res.data);
        var title = $("title").text();
        var relativeLinks = $(workerData.regexp);
        var hrefs = []
        relativeLinks.each(function() {
          if ($(this).attr('href')[0] === '/')
            if (nextPage.search($(this).attr('href')) === -1)
              pagesToVisit.push(nextPage + $(this).attr('href'));
          else
            pagesToVisit.push($(this).attr('href'));
          hrefs.push($(this).attr('href'))
        });
        var t1 = performance.now();
        const node = {
          title: title,
          url: nextPage,
          crawlTime: t1 - t0,
          links: hrefs.join(),
          owner: workerData.url
        }
        links.push(node)
      }
    }
    nodeExist = false
    await Webpage.find({ url: workerData.url })
      .then(findRes => {
        if (findRes.length === 1) {
          nodeExist = true          
        }
      })
      .catch(err => {
        console.log(err)
      });
    console.log('CRAWLING ONE DONE')
  }
  var now = new Date().toLocaleString();
  if (nodeExist) {
    const execution = {
      status: "done",
      start: startTime,
      end: now,
      sitesCrawled: numPagesVisited,
    }
    await Webpage
      .updateOne(
        { "url": workerData.url },
        {
          $push: {
            "executions": execution
          },
          $set: {
            "nodes": links
          }
        })
        .then(data => {
          console.log(data);
        })
      .catch(err => {
        console.log(err)
      });
  }
}

main().then(x => {
  if (parentPort)
    parentPort.postMessage("done")
}).catch(err => console.log(err));