const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const PostingSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: null
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  due_date: {
    type: Date,
    required: true
  },
  submissions: {
    type: [Schema.Types.ObjectId],
    ref: 'Assigment',
    default: null
  }
});
module.exports = Posting = mongoose.model("postings", PostingSchema);