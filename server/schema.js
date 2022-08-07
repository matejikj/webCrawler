const graphql = require('graphql');
const db = require("./models");
const Webpage = db.webpages;
const { createGraph } = require("./utils")

const {
   GraphQLObjectType, GraphQLString,
   GraphQLID, GraphQLInt,GraphQLSchema,
   GraphQLList,GraphQLNonNull,
   GraphQLBoolean
} = graphql;

const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    websites: { type: GraphQLList(WebpageType) },
    nodes: { type: GraphQLList(NodeType) }
  })
});

const WebpageType = new GraphQLObjectType({
   name: 'Webpage',
   fields: () => ({
    identifier: { type: GraphQLID  },
    label: { type: GraphQLString },
    url: { type: GraphQLString },
    regexp: { type: GraphQLString },
    active: { type: GraphQLBoolean },
    tags: { type: GraphQLList(GraphQLString) }
   })
});

const NodeType = new GraphQLObjectType({
  name: 'Node',
  fields: () => ({
    title: { type: GraphQLString },
    url: { type: GraphQLString },
    crawlTime: { type: GraphQLString },
    owner: { type: WebpageType },
    links: { type: GraphQLList(NodeType) }
  })
});

const MyQueries = new GraphQLObjectType({
  name: 'Queries',
  fields: {
    query: {
      type: QueryType,
      //argument passed by the user while making the query
      args: { webpages: { type: GraphQLList(GraphQLString) } },
      async resolve(parent, args) {
        let arr = {
          websites: [],
          nodes: []
        }

        console.log("fsdfds")

        // data = [
        //   {
        //     _id: "62deadf2764cbdc7c9ba4e6a",
        //     label: 'test',
        //     url: 'https://jmatejik.eu',
        //     regexp: 'a[href]',
        //     tags: [ 'test', ' smycka' ],
        //     active: false,
        //     periodicity: 'minute',
        //     createdAt: "2022-07-25T14:51:30.813Z",
        //     updatedAt: "2022-07-25T21:01:09.298Z",        
        //     nodes: [
        //       {
        //         title: 'Page Title',
        //         url: 'https://jmatejik.eu',
        //         crawlTime: 178.1310900002718,
        //         links: [ 'https://jmatejik.eu/example1.html' ],
        //         owner: 'https://jmatejik.eu'
        //       },
        //       {
        //         title: 'Page Title',
        //         url: 'https://jmatejik.eu/example1.html',
        //         crawlTime: 161.53372399508953,
        //         links: [ 'https://jmatejik.eu/example2.html' ],
        //         owner: 'https://jmatejik.eu'
        //       },
        //       {
        //         title: 'Page Title',
        //         url: 'https://jmatejik.eu/example2.html',
        //         crawlTime: 154.42444299906492,
        //         links: [ 'https://jmatejik.eu' ],
        //         owner: 'https://jmatejik.eu'
        //       }
        //     ]
        //   }
        // ]
        
        await Webpage.find({ url: { $in: args.webpages }})
          .then(data => {
            data.forEach( element => {
              console.log(element)
              let website = {
                identifier: element.id,
                label: element.label,
                url: element.id,
                regexp: element.regexp,
                active: element.active,
                tags: element.tags
              }
              arr.websites.push(website)
            })
            
            let graph = createGraph(data)
            console.log(graph)
            // console.log(graph)
            nodesArray = graph.nodes.map(x => {
              webpage = {
                identifier: x.webpageId,
                label: x.label,
                url: x.id,
                regexp: x.regexps[0].regexp,
                active: x.webpageActive,
                tags: x.webpageTags
              }
              node = {
                title: x.label,
                url: x.url,
                crawlTime: x.label,
                owner: webpage,
                links: []
              }
              return node
            })
    
            graph.links.forEach(link => {
              console.log(graph.nodes[link.source].id)
              let src = nodesArray.find(x => x.title === graph.nodes[link.source].id)
              let trgt = nodesArray.find(x => x.title === graph.nodes[link.target].id)
              src.links.push(trgt)
              // console.log(arr.find(x => x.url === link.target))
            })
    
            arr.nodes = nodesArray
          })
        console.log(arr)
        return arr
      }
    },
    webpage: {
      type: WebpageType,
      //argument passed by the user while making the query
      args: { url: { type: GraphQLString } },
      async resolve(parent, args) {
        let res = {}
        await Webpage.find({ url: args.url})
          .then(data => {
            node = {
              identifier: data[0]._id,
              url: data[0].url,
              regexp: data[0].regexp,
              active: data[0].active,
              label: data[0].label,
              tags: data[0].tags
            }
            res = node
          })
        return res
      }
    },
    webpages:{
      type: new GraphQLList(WebpageType),
      async resolve(parent, args) {
        let arr = []
        await Webpage.find()
          .then(data => {
            arr = data.map(x => {
              node = {
                identifier: x._id,
                url: x.url,
                regexp: x.regexp,
                active: x.active,
                label: x.label,
                tags: x.tags
              }
              return node
            })
            console.log(arr)
          })
        return arr
      }
    },
    node: {
      type: NodeType,
      //argument passed by the user while making the query
      args: { url: { type: GraphQLString } },
      async resolve(parent, args) {
        let res = {}
        await Webpage.find({ url: args.url})
          .then(data => {
            node = {
              identifier: data[0]._id,
              url: data[0].url,
              regexp: data[0].regexp,
              active: data[0].active,
              label: data[0].label,
              tags: data[0].tags
            }
            res = node
          })
        return res
      }
    },
    nodes:{
      type: new GraphQLList(NodeType),
      async resolve(parent, args) {
        let arr = []
        await Webpage.find()
          .then(data => {
            console.log(data)
            let graph = createGraph(data)
            console.log(graph)
            arr = graph.nodes.map(x => {
              webpage = {
                identifier: x.webpageId,
                label: x.label,
                url: x.id,
                regexp: x.regexps[0].regexp,
                active: x.webpageActive,
                tags: x.webpageTags
              }
              node = {
                title: x.label,
                url: x.url,
                crawlTime: x.label,
                owner: webpage
              }
              return node
            })
            console.log(arr)
          })
        return arr
      }
    }
  }
});

const NodeQuery = new GraphQLObjectType({
  name: 'NodeQueryType',
  fields: {
    
  }
});

module.exports = new GraphQLSchema({
  query: MyQueries
});