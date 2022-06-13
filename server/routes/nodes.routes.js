module.exports = app => {
  const nodes = require("../controllers/nodes.controller");
  
    var router = require("express").Router();
  
    // Create a new Tutorial
    router.post("/", nodes.create);
  
    // Retrieve all nodes
    router.get("/", nodes.findAll);
  
    app.use("/nodes", router);
  };
  