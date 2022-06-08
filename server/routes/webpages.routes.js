module.exports = app => {
  const webpages = require("../controllers/webpages.controller");
  
    var router = require("express").Router();
  
    // Create a new Tutorial
    router.post("/", webpages.create);
  
    // Retrieve all webpages
    router.get("/", webpages.findAll);
    
    // Retrieve a single Tutorial with id
    router.get("/:id", webpages.findOne);
  
    // Update a Tutorial with id
    router.put("/:id", webpages.update);
  
    // Delete a Tutorial with id
    router.delete("/:id", webpages.delete);
    
    app.use("/webpages", router);
  };
  