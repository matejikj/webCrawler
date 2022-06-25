const db = require("../models");
const Webpage = db.webpages;

// Retrieve all Nodes from the database.
exports.findAll = (req, res) => {
  Webpage.find({ url: { $in: req.body } })
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
              isCrawled: true,
              crawledBy: new Set([webpage.url]),
              regexps: [{url: webpage.url, regexp: webpage.regexp}]
            })
          } else {
            const finded = graph.nodes.find(x => x.id === node.url)
            finded.label = node.url
            finded.color = 'orange'
            finded.crawledBy.add(webpage.url)
            finded.links = node.links
            finded.isCrawled = true
            const findedRegexp = finded.regexps.find(x => x.url === webpage.url)
            if (findedRegexp === undefined) {
              finded.regexps.push({url: webpage.url, regexp: webpage.regexp})
            }
          }
          node.links.forEach(link => {
            if (visitedNodes.indexOf(link) === -1) {
              visitedNodes.push(link)
              graph.nodes.push({
                id: link,
                label: link,
                color: 'grey',
                links: [],
                isCrawled: false,
                crawledBy: new Set([webpage.url]),
                regexps: [{url: webpage.url, regexp: webpage.regexp}]
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
      graph.nodes.forEach(x => {
        x.crawledBy = [...x.crawledBy]
      })
      res.send(graph);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Webpages."
      });
    });
};
