const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema({
  content: String,
});

module.exports = mongoose.model("Record", recordSchema);
