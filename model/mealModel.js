const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const mealSchema = new mongoose.Schema({});

module.exports = mongoose.model("Meal", mealSchema);
