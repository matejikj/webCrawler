const db = require("../models");
const Node = db.nodes;

// Create and Save a new Node
exports.create = (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  // Create a Node
  const Node = new Node({
    title: req.body.title,
    description: req.body.description,
    published: req.body.published ? req.body.published : false
  });

  // Save Node in the database
  Node
    .save(Node)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Node."
      });
    });
};

// Retrieve all Nodes from the database.
exports.findAll = (req, res) => {
  const title = req.query.title;
  var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};

  Node.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Nodes."
      });
    });
};

// Find a single Node with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Node.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Node with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving Node with id=" + id });
    });
};

// Update a Node by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;

  Node.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Node with id=${id}. Maybe Node was not found!`
        });
      } else res.send({ message: "Node was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Node with id=" + id
      });
    });
};

// Delete a Node with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Node.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Node with id=${id}. Maybe Node was not found!`
        });
      } else {
        res.send({
          message: "Node was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Node with id=" + id
      });
    });
};

// Delete all Nodes from the database.
exports.deleteAll = (req, res) => {
  Node.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} Nodes were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Nodes."
      });
    });
};

// Find all published Nodes
exports.findAllPublished = (req, res) => {
  Node.find({ published: true })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Nodes."
      });
    });
};
