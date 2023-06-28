const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const staffSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  dob: {
    type: String,
  },
  password: {
    type: String,
  },
  address: {
    type: String,
  },
  contact: {
    type: String,
  },
  adharNo: {
    type: String,
  },
  kids: [
    {
      type: ObjectId,
      ref: "Baby",
    },
  ],
  token: {
    type: String,
  },
  image: {
    type: String,
  },
});

module.exports = mongoose.model("Staff", staffSchema);
