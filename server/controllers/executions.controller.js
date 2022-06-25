const { oneTimeJob } = require("../bree");
const db = require("../models");
const Webpage = db.webpages;
const path = require('path');
const appDir = path.resolve(__dirname);
var mongoose = require('mongoose');

// Create and Save a new Webpage
exports.create = (req, res) => {
  oneTimeJob(req.body)
  res.status(200).send({
            message:
              "Url is existing"
          });
  // Webpage.find({ url: req.body.url })
  //   .then(findRes => {
  //     if (findRes.length === 0) {
  //       console.log("SPOUSTIM")
  //     } else {
  //       res.status(200).send({
  //         message:
  //           "Url is existing"
  //       });
  //     }
  //   })
  //   .catch(err => {
  //     res.status(500).send({
  //       message:
  //         err.message || "Some error occurred while retrieving Webpages"
  //     });
  //   });
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
