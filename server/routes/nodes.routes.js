module.exports = app => {
    const nodes = require("../controllers/nodes.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Tutorial
    router.post("/", nodes.create);
  
    // Retrieve all nodes
    router.get("/", nodes.findAll);
  
    // Retrieve all published nodes
    router.get("/published", nodes.findAllPublished);
  
    // Retrieve a single Tutorial with id
    router.get("/:id", nodes.findOne);
  
    // Update a Tutorial with id
    router.put("/:id", nodes.update);
  
    // Delete a Tutorial with id
    router.delete("/:id", nodes.delete);
  
    // Create a new Tutorial
    router.delete("/", nodes.deleteAll);
  
    app.use("/api/nodes", router);
  };
  