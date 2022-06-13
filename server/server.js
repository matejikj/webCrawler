const express = require("express");
// const bodyParser = require("body-parser"); /* deprecated */
const cors = require("cors");

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
