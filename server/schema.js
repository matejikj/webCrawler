const graphql = require('graphql');
const db = require("./models");
const Webpage = db.webpages;

const {
   GraphQLObjectType, GraphQLString,
   GraphQLID, GraphQLInt,GraphQLSchema,
   GraphQLList,GraphQLNonNull,
   GraphQLBoolean
} = graphql;

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

// const AuthorType = new GraphQLObjectType({
//    name: 'Author',
//    fields: () => ({
//        id: { type: GraphQLID },
//        name: { type: GraphQLString },
//        age: { type: GraphQLInt },
//        book:{
//            type: new GraphQLList(BookType),
//            resolve(parent,args){
//                return Book.find({ authorID: parent.id });
//            }
//        }
//    })
// })

const RootQuery = new GraphQLObjectType({
   name: 'RootQueryType',
   fields: {
       webpage: {
           type: WebpageType,
           //argument passed by the user while making the query
           args: { url: { type: GraphQLString } },
           resolve(parent, args) {
               return Webpage.findOne(args.url);
           }
       },
       webpages:{
           type: new GraphQLList(WebpageType),
           resolve(parent, args) {
               return Webpage.findAll({});
           }
       }
   }
});


// //Very similar to RootQuery helps users to add/update to the database.
// const Mutation = new GraphQLObjectType({
//    name: 'Mutation',
//    fields: {
//        addAuthor: {
//            type: AuthorType,
//            args: {
//                //GraphQLNonNull make these fields required
//                name: { type: new GraphQLNonNull(GraphQLString) },
//                age: { type: new GraphQLNonNull(GraphQLInt) }
//            },
//            resolve(parent, args) {
//                let author = new Author({
//                    name: args.name,
//                    age: args.age
//                });
//                return author.save();
//            }
//        }
//    }
// });



//Creating a new GraphQL Schema, with options query which defines query
//we will allow users to use when they are making requests.
// module.exports = new GraphQLSchema({
//   query: RootQuery,
//   Mutation: Mutation
// });

module.exports = new GraphQLSchema({
  query: RootQuery
});