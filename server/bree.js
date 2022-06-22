const Bree = require('bree')

const path = require('path');

const appDir = path.resolve(__dirname);

console.log(appDir)
let bree = new Bree({
  root: false, // * here
  jobs: [],
  errorHandler: (error, workerMetaData) => {
    console.log(error);
  },
});

bree.start()
console.log("bree started")

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
  bree.add({
    name: getScraperName(item.id),
    path: path.join(appDir + '/jobs', 'scraping.js'), // Using this path, be sure to set root to false *
    timeout: "1s",
    interval: getPeriodicity(item.periodicity),
    worker: {
      workerData: {
        url: item.url,
        regexp: item.regexp
      }
    },
  });
  bree.start(getScraperName(item.id))
}

function removeBreeJob(url) {
  bree.stop(getScraperName(url))
  try {
    bree.remove(getScraperName(url))
  } catch (error) {
    console.log(error)
  }
}

module.exports = { removeBreeJob, addBreeJob }