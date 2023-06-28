const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const routineSchema = new mongoose.Schema({});

module.exports = mongoose.model("Routine", routineSchema);
