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
      console.log(nextPage)
      console.log(pagesVisited[nextPage])
      if ( nextPage !== undefined && pagesVisited[nextPage] === undefined ) {
        console.log("vchod")
        var t0 = performance.now();
        pagesVisited[nextPage] = true;
        numPagesVisited++;
        if (numPagesVisited > 20 ) {
          pagesToVisit = []
          continue
        }
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
        console.log("KONEC")
        relativeLinks.each(function() {
          let attrHref = $(this).attr('href')
          console.log(attrHref)
          if (attrHref.includes('http')) {
            console.log(attrHref)
            pagesToVisit.push(attrHref);
            hrefs.push(attrHref)
            console.log("BEZ")
          }
          else {
            console.log("AAAAAAAAA: ", nextPage + attrHref)
            pagesToVisit.push(nextPage + attrHref);
            hrefs.push(nextPage + attrHref)
            console.log("S")
          }
          console.log("DALSI")
          console.log(pagesToVisit)
        });
        console.log("KONEC")
        var t1 = performance.now();
        const node = {
          title: title,
          url: nextPage,
          crawlTime: t1 - t0,
          links: hrefs,
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