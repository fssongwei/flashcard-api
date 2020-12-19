const mongoose = require("mongoose");

const flashcardSchema = new mongoose.Schema({
  author: String,
  title: String,
  category: String,
  tags: Array,
  question: String,
  hint: String,
  answer: String,
});

module.exports = mongoose.model("Flashcard", flashcardSchema);
