const db = require("../models");
const Webpage = db.webpages;

// Create and Save a new Webpage
exports.create = (req, res) => {
  // Validate request
  if (!req.body.label) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  console.log(req.body)

  // identifier: String,
  // label: String,
  // url: String,
  // regexp: String,
  // tags: [String],
  // active: Boolean

  // Create a Webpage
  const webpage = new Webpage({
    label: req.body.label,
    url: req.body.url,
    regexp: req.body.regexp,
    tags: req.body.tags,
    active: req.body.active
  });

  // // Save Webpage in the database
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
  const id = req.params.id;

  Webpage.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Webpage with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving Webpage with id=" + id });
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
  Webpage.deleteMany({})
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

// Find all published Webpages
exports.findAllPublished = (req, res) => {
  Webpage.find({ published: true })
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
