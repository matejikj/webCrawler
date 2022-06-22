const { addBreeJob, removeBreeJob } = require("../bree");
const db = require("../models");
const Webpage = db.webpages;
const path = require('path');
const appDir = path.resolve(__dirname);
var mongoose = require('mongoose');

// Create and Save a new Webpage
exports.create = (req, res) => {
  console.log(Webpage)
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
        webpage
          .save()
          .then(data => {
            addBreeJob(data)
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

  let id = req.params.id
  console.log(id)
  console.log(req.body.url)
  Webpage.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Webpage with id=${id}. Maybe Webpage was not found!`
        });
      } else {
        removeBreeJob(id)
        addBreeJob(req.body)
        res.send({ message: "Webpage was updated successfully." });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Webpage with id=" + id
      });
    });
};

// Delete a Webpage with the specified id in the request
exports.delete = (req, res) => {
  console.log("req.params.url")
  const id = req.params.id;

  console.log(id)
  Webpage.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Webpage with id=${id}. Maybe Webpage was not found!`
        });
      } else {
        console.log("SMAZANO")
        removeBreeJob(req.params.id)
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
