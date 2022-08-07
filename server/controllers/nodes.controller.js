const db = require("../models");
const Webpage = db.webpages;
const { createGraph } = require("../utils");

// Retrieve all Nodes from the database.
exports.findByUrls = (req, res) => {
  Webpage.find({ url: { $in: req.body } })
    .then(data => {
      let graph = createGraph(data)
      res.send(graph);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Webpages."
      });
    });
};
