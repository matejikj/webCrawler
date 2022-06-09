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

// Create and Save a new Webpage
exports.create = (req, res) => {
  Webpage.find({ url: req.body.url })
    .then(findRes => {
      if (findRes.length === 0) {
        const webpage = new Webpage({
          url: req.body.url,
          regexp: req.body.regexp,
          active: req.body.active,
          label: req.body.label,
          periodicity: req.body.periodicity,
          tags: req.body.tags
        });
      
        let newScraperName = "scraper-" + webpage.url
        
        bree.add({
          name: newScraperName,
          path: path.join('/home/matejikj/git/webCrawler/server' + '/jobs', 'scraping.js'), // Using this path, be sure to set root to false *
          timeout: "1s",
          interval: getPeriodicity(req.body.periodicity),
          worker: {
            workerData: {
              url: webpage.url,
              regexp: webpage.regexp
            }
          },
        });
        bree.start(newScraperName)
        webpage
          .save()
          .then(data => {
            res.send(data);
          })
          .catch(err => {
            res.status(500).send({
              message:
                err.message || "Some error occurred while creating the Webpage."
            });
          });
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

// Find a single Webpage with an id
exports.findOne = (req, res) => {
  Webpage.find({ url: req })
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

// Update a Webpage by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;
  console.log(id)
  Webpage.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Webpage with id=${id}. Maybe Webpage was not found!`
        });
      } else res.send({ message: "Webpage was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Webpage with id=" + id
      });
    });
};

// Delete a Webpage with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  console.log(id)
  Webpage.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Webpage with id=${id}. Maybe Webpage was not found!`
        });
      } else {
        res.send({
          message: "Webpage was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Webpage with id=" + id
      });
    });
};

// Delete all Webpages from the database.
exports.deleteAll = (req, res) => {
  Webpage.delete({_id: req})
    .then(data => {
      res.send({
        message: `${data.deletedCount} Webpages were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Webpages."
      });
    });
};