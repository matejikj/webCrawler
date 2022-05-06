module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        websites: [],
        nodes: {}
      },
      { timestamps: true }
    );
  
  //   type Query{
  //     websites: [WebPage!]!
  //     nodes(webPages: [ID!]): [Node!]!
  // }
  
  // type WebPage{
  //     identifier: ID!
  //     label: String!
  //     url: String!
  //     regexp: String!
  //     tags: [String!]!	
  //     active: Boolean!
  // }
  
  
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const WebPage = mongoose.model("query", schema);
    return WebPage;
  };
  