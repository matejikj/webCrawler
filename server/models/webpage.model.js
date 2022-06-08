module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        label: String,
        url: String,
        regexp: String,
        tags: [String],
        active: Boolean,
        periodicity: String
      },
      { timestamps: true }
    );
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const WebPage = mongoose.model("webpage", schema);
    return WebPage;
  };
  