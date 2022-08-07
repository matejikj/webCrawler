function createGraph(data) {
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
          webpageId: webpage.id,
          webpageTags: webpage.tags,
          webpageActive: webpage.active,
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
            webpageId: webpage.id,
            webpageTags: webpage.tags,
            webpageActive: webpage.active,
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
  return graph
}

module.exports = { createGraph }