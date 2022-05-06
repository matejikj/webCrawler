export default interface Query {
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
  }