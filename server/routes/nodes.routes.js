module.exports = app => {
  const nodes = require("../controllers/nodes.controller");
  
    var router = require("express").Router();
  
    // Retrieve all nodes
    // router.get("/", nodes.findAll);
    // Retrieve a single Tutorial with id
    router.post("/", nodes.findByUrls);

    app.use("/nodes", router);
  };
