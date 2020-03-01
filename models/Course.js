const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const CourseSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true
  },
  teacher: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignments: {
    type: [Schema.Types.ObjectId],
    ref: 'Posting',
    default: null
  },
  tas: {
    type: [Schema.Types.ObjectId],
    ref: 'User',
    default: null
  },
  students: {
    type: [Schema.Types.ObjectId],
    ref: 'User',
    default: null
  },
  date: {
    type: Date,
    default: Date.now
  }
});
module.exports = Course = mongoose.model("courses", CourseSchema);