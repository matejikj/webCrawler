const Bree = require('bree')

const path = require('path');

const appDir = path.resolve(__dirname);
let breeJobs = []
// const params = [['s', '10s'],['h', '20s'], ['d', '30s']];
// const params = [['s', '2000s']];

// params.forEach((param) => {
//   breeJobs.push({
//     name: `scraper-${param[0]}`,
//     path: path.join(appDir + '/jobs', 'scraping.js'), // Using this path, be sure to set root to false *
//     interval: param[1],
//     worker: {
//       workerData: {
//         url: "",
//         regexp: ""
//       }
//     },
//   });
// });

exports.bree = new Bree({
    root: false, // * here
    jobs: [],
    errorHandler: (error, workerMetaData) => {
      console.log(error);
    },
  });