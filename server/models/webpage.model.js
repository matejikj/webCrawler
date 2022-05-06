module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        identifier: {
            type: String
        },
        label: String,
        url: String,
        regexp: String,
        tags: [{
            type: String
        }],
        active: Boolean
      },
      { timestamps: true }
    );
  
    // identifier: ID!
    // label: String!
    // url: String!
    // regexp: String!
    // tags: [String!]!	
    // active: Boolean!

    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const WebPage = mongoose.model("webpage", schema);
    return WebPage;
  };
  