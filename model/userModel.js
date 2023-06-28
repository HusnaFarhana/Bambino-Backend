const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },
  dob: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  adhar: {
    type: String,
    required: true,
  },
  address: [
    {
      name: { type: String },
      house: { type: String },
      post: { type: String },
      city: { type: String },
      district: { type: String },
      state: { type: String },
      pin: { type: Number },
      phone: { type: Number },
    },
  ],
  mykids: [
    {
      type: ObjectId,
      ref: "Baby",
    },
  ],
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  token: {
    type: String,
  },
  verified: {
    type:Boolean,
    default:false
  }
});

module.exports = mongoose.model("User", userSchema);
