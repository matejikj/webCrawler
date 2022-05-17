module.exports = app => {
  const queries = require("../controllers/queries.controller");
  
    var router = require("express").Router();
  
    // Create a new Tutorial
    router.post("/", queries.create);
  };
  