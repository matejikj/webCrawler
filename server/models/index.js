const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.nodes = require("./node.model.js")(mongoose);
db.queries = require("./query.model.js")(mongoose);
db.webpages = require("./webpage.model.js")(mongoose);

module.exports = db;