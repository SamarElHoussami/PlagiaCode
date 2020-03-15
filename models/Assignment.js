const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const AssignmentSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  student: {
    type: [Schema.Types.ObjectId],
    ref: 'User',
    default: null
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  file: {
     data: Buffer, 
     contentType: String
  }
  grade: {
    type: Number,
    min: 0,
    max: 100
  },
  date: {
    type: Date,
    default: Date.now
  }
});
module.exports = Assignment = mongoose.model("assignments", AssignmentSchema);