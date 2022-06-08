const Bree = require('bree')

const path = require('path');

const appDir = path.resolve(__dirname);
let breeJobs = []
// const params = [['s', '10s'],['h', '20s'], ['d', '30s']];
const params = [['s', '20s']];

params.forEach((param) => {
  breeJobs.push({
    name: `scraper-${param[0]}`,
    path: path.join(appDir + '/jobs', 'scraping.js'), // Using this path, be sure to set root to false *
    interval: param[1],
    worker: {
      workerData: {
        url: "https://jmatejik.eu",
        regexp: "a[href^='/']"
      }
    },
  });
});

exports.bree = new Bree({
    root: false, // * here
    jobs: breeJobs,
    errorHandler: (error, workerMetaData) => {
      console.log(error);
    },
  });