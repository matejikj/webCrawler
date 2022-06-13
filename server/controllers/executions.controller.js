const { bree } = require("../bree");
const db = require("../models");
const Webpage = db.webpages;
const path = require('path');
const appDir = path.resolve(__dirname);
var mongoose = require('mongoose');

function getPeriodicity(periodicity) {
  switch (periodicity) {
    case 'hour':
      return "5s"
    case 'minute':
      return "60s"
    case 'day':
      return "86400s"
  }
}

function getScraperName(url) {
  return "scraper-" + url
}

function addBreeJob(item) {
  console.log(item)
  console.log(item.id)
  bree.add({
    name: getScraperName(item.id),
    path: path.join('/home/matejikj/git/webCrawler/server' + '/jobs', 'scraping.js'), // Using this path, be sure to set root to false *
    timeout: "1s",
    interval: getPeriodicity(item.periodicity),
    worker: {
      workerData: {
        url: item.url,
        regexp: item.regexp
      }
    },
  });
  console.log(item.id)

  bree.start(getScraperName(item.id))
}

function removeBreeJob(url) {
  console.log("MAZU")
  bree.stop(getScraperName(url))
  console.log(bree.workers)
  try {
    bree.remove(getScraperName(url))
  } catch (error) {
    console.log(bree.workers)
    console.log(error) 
  }
}


// Create and Save a new Webpage
exports.create = (req, res) => {
  console.log(Webpage)
  Webpage.find({ url: req.body.url })
    .then(findRes => {
      if (findRes.length === 0) {
        console.log("SPOUSTIM")
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
};

// Retrieve all Webpages from the database.
exports.findAll = (req, res) => {

  Webpage.find()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Webpages."
      });
    });
};
