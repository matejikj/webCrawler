module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        title: String,
        url: String,
        crawlTime: String,
        links: [],
        owner: {}
      },
      { timestamps: true }
    );

    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const WebPage = mongoose.model("node", schema);
    return WebPage;
  };
  