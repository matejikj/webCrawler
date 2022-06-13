module.exports = app => {
  const executions = require("../controllers/executions.controller");
  
    var router = require("express").Router();
  
    // Create a new Tutorial
    router.post("/", executions.create);
  
    // Retrieve all nodes
    router.get("/", executions.findAll);
  
    app.use("/executions", router);
  };
  