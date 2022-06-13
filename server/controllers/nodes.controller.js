const db = require("../models");
const Webpage = db.webpages;

// Create and Save a new Node
exports.create = (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  console.log(req.body)

  // Create a Node
  const node = new Node({
    title: req.body.title,
    url: req.body.url,
    crawlTime: req.body.crawlTime,
    links: req.body.links,
    owner: req.body.owner
  });

  // // Save Node in the database
  node
    .save()
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
