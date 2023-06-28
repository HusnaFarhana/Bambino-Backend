const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const subscriptionSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  ageGroup: {
    type: String,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
  },
  users: [{
    userId: {
      type: ObjectId,
      ref:'User',
    },
    date:Date,
    expires:Date
  }],
  athome:{
    type:String
  }
});

module.exports = mongoose.model("Subscription", subscriptionSchema);
