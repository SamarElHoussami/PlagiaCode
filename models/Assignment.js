const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const AssignmentSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  studentId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  studentName: {
    type: String,
    required: true
  },
  posting: {
    type: Schema.Types.ObjectId,
    ref: 'Posting'
  },
  filePath: {
     type: String,
     required: true
  },
  grade: {
    type: Number,
    min: -1,
    max: 100,
    default: -1 
  },
  date: {
    type: Date,
    index : true,
    default: Date.now
  }
});
module.exports = Assignment = mongoose.model("assignments", AssignmentSchema);