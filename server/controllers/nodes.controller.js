const db = require("../models");
const Webpage = db.webpages;

// Create and Save a new Node
exports.create = (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  console.log(req.body)

  // Create a Node
  const node = new Node({
    title: req.body.title,
    url: req.body.url,
    crawlTime: req.body.crawlTime,
    links: req.body.links,
    owner: req.body.owner
  });

  // // Save Node in the database
  node
    .save()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Node."
      });
    });
};

// Retrieve all Nodes from the database.
exports.findAll = (req, res) => {
  Webpage.find()
    .then(data => {
      let graph = {
        nodes: [],
        links: []
      }
      const visitedNodes = []
      data.forEach(webpage => {
        const label = webpage.label
        webpage.nodes.forEach(node => {
          if (visitedNodes.indexOf(node.url) === -1) {
            visitedNodes.push(node.url)
            graph.nodes.push({
              id: node.url,
              label: node.url,
              color: 'green',
              links: node.links,
              isCrawled: true
            })
          } else {
            const finded = graph.nodes.find(x => x.id === node.url)
            finded.label = node.url
            finded.color = 'orange'
            finded.crawledBy.push(data.url)
            finded.links = node.links
            finded.isCrawled = true
          }
          console.log("graph")
          node.links.forEach(link => {
            if (visitedNodes.indexOf(link) === -1) {
              visitedNodes.push(link)
              graph.nodes.push({
                id: link,
                label: link,
                color: 'grey',
                links: [],
                crawledBy: [data.url]
              })
            }
            const left = graph.nodes.find(x => x.id === node.url)
            const right = graph.nodes.find(x => x.id === link)
            graph.links.push({
              source: graph.nodes.indexOf(left),
              target: graph.nodes.indexOf(right)
            })
          })
        })
      })
      console.log(graph)
      res.send(graph);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Webpages."
      });
    });
};
