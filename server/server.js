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

var url_list = ["https://www.facebook.com/impression.php/f2e61d9df/?lid=115",
"https://www.facebook.com/plugins/like.php?app_id=5",
"https://www.facebook.com/tr/a/?id=228037074239568",
"https://www.facebook.com/tr/b/?ev=ViewContent",
"http://www.marvel.com/abc?f=33",
"http://www.marvel.com/games?a=11",
"http://www.marvel.com/games?z=22",
"http://www.marvel.com/videos"];

// Group the URLs, keyed by domain+dir
var hash = url_list.reduce(function (hash, url) {
    // ignore protocol, and extract domain and first dir:
    console.log(hash)
    console.log(url)
    var domAndDir = url.replace(/^.*?:\/\//, '').match(/^.*?\..*?\/[^\/?#]*/)[0];
    hash[domAndDir] = (hash[domAndDir] || []).concat(url);
    return hash;
}, {});

// Regroup URLs by domain only, when they are alone for their domain+dir
Object.keys(hash).forEach(function (domAndDir) {
    if (hash[domAndDir].length == 1) {
        var domain = domAndDir.match(/.*\//)[0];
        hash[domain] = (hash[domain] || []).concat(hash[domAndDir]);
        delete hash[domAndDir];
    }
});
// Convert hash to array
var result = Object.keys(hash).map(function(key) {
    return hash[key];
});

// Output result
console.log(result);

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
// bree.on('worker created', (name) => {
//   console.log('worker created', name);
//   console.log(bree.workers.get(name));
// });

// bree.on('worker deleted', (name) => {
//   console.log('worker deleted', name);
//   console.log(!bree.worker.has(name));
// });
// bree.bree.start()
// console.log(bree.bree.jobs)
// set port, listen for requests
const PORT = process.env.PORT || 8083;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
