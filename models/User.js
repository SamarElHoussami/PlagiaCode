const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  courses: {
    type: [Schema.Types.ObjectId],
    ref: 'Course',
    default: null
  },
  ta: {
    type: [Schema.Types.ObjectId],
    ref: 'Course',
    default: null
  },
  assignments: {
    type: [Schema.Types.ObjectId],
    ref: 'Assignment',
    default: null
  },
  date: {
    type: Date,
    default: Date.now
  }
});
module.exports = User = mongoose.model("users", UserSchema);