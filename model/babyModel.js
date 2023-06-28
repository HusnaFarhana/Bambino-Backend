const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const babySchema = new mongoose.Schema({
  name: {
    type: String,
  },
  dob: {
    type: String,
  },
  gender: {
    type: String,
  },
  medications: {
    type: String,
  },
  relation: {
    type: String,
  },
  parent: {
    type: ObjectId,
    ref: "User",
  },
  staff: {
    type: ObjectId,
    ref: "Staff",
  },
  active: {
    type: Boolean,
    default:true
  },
  subscription: {
    id: {
      type: ObjectId,
      ref: "Subscription"
    },
    date: Date,
    expDate:Date
  },
  image: {
    type:String
  }
});

module.exports = mongoose.model("Baby", babySchema);
