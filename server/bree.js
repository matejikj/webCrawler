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

function generateUUID() { // Public Domain/MIT
  var d = new Date().getTime();//Timestamp
  var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16;//random number between 0 and 16
      if(d > 0){//Use timestamp until depleted
          r = (d + r)%16 | 0;
          d = Math.floor(d/16);
      } else {//Use microseconds since page-load if supported
          r = (d2 + r)%16 | 0;
          d2 = Math.floor(d2/16);
      }
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

function getPeriodicity(periodicity) {
  switch (periodicity) {
    case 'hour':
      return "3600s"
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

function oneTimeJob(item) {
  console.log(item)
  const uid = generateUUID()
  bree.add({
    name: uid,
    path: path.join(appDir + '/jobs', 'scraping.js'), // Using this path, be sure to set root to false *
    timeout: "1s",
    worker: {
      workerData: {
        url: item.url,
        regexp: item.regexp
      }
    },
  });
  console.log("DONE")
  bree.start(uid)
}

function removeBreeJob(url) {
  bree.stop(getScraperName(url))
  try {
    bree.remove(getScraperName(url)).catch(e => {
      console.log(e)
    })
  } catch (error) {
    console.log(error)
  }
}

module.exports = { removeBreeJob, addBreeJob, oneTimeJob }