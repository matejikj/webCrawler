module.exports = app => {
    const queries = require("../controllers/query.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Tutorial
    router.post("/", queries.create);
  
    // Retrieve all queries
    router.get("/", queries.findAll);
  
    // Retrieve all published queries
    router.get("/published", queries.findAllPublished);
  
    // Retrieve a single Tutorial with id
    router.get("/:id", queries.findOne);
  
    // Update a Tutorial with id
    router.put("/:id", queries.update);
  
    // Delete a Tutorial with id
    router.delete("/:id", queries.delete);
  
    // Create a new Tutorial
    router.delete("/", queries.deleteAll);
  
    app.use("/api/queries", router);
  };
  