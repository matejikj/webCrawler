const express = require("express");
// const bodyParser = require("body-parser"); /* deprecated */
const cors = require("cors");

var graphql = require ('graphql').graphql  
var graphQLHTTP = require('express-graphql')  
var Schema = require('./schema')

const app = express();

var corsOptions = {
  origin: "http://localhost:8080"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());  /* bodyParser.json() is deprecated */

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));   /* bodyParser.urlencoded() is deprecated */

const db = require("./models");
const { bree } = require("./bree");

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

var root = {
  hello: () => {
    return 'Hello world!';
  },
};

app.use('/graphql', graphQLHTTP({ schema: Schema, rootValue: root, graphiql: true }))

var query = 'query { todos { id, title, completed } }'  
graphql(Schema, query).then( function(result) {  
  console.log(JSON.stringify(result,null," "));
});

require("./routes/nodes.routes")(app);
require("./routes/queries.routes")(app);
require("./routes/webpages.routes")(app);
require("./routes/executions.routes")(app);

bree.start()

const PORT = process.env.PORT || 8083;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
