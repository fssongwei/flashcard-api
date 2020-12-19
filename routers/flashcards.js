const router = require("express").Router();
const Flashcard = require("../models/Flashcard");
const passport = require("passport");

router.get(
  "/flashcards",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      let flashcards = await Flashcard.find({ author: req.user._id });
      res.status(200).send(flashcards);
    } catch (error) {
      res.status(500).send(error);
    }
  }
);

router.post(
  "/flashcards/add",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      let flashcard = req.body;
      flashcard.author = req.user._id;
      flashcard.category = encodeURIComponent(flashcard.category);
      let createdFlashcard = await Flashcard.create(flashcard);
      res.status(200).send(createdFlashcard);
    } catch (error) {
      res.status(500).send(error);
    }
  }
);

router.put(
  "/flashcards/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      let flashcard = req.body;
      flashcard.author = req.user._id;
      flashcard.category = encodeURIComponent(flashcard.category);
      let updatedFlashcard = await Flashcard.findByIdAndUpdate(
        req.params.id,
        flashcard
      );
      res.status(200).send(updatedFlashcard);
    } catch (error) {
      res.status(500).send(error);
    }
  }
);

router.delete(
  "/flashcards/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      let flashcardToBeDeleted = await Flashcard.findById(req.params.id);
      if (flashcardToBeDeleted.author !== req.user._id)
        res.status(401).send("Unauthorized!");
      else {
        await Flashcard.findByIdAndDelete(req.params.id);
        res.status(200).send("success");
      }
    } catch (error) {
      res.status(500).send(error);
    }
  }
);

router.get(
  "/flashcards/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      let flashcard = await Flashcard.findById(req.params.id);
      if (flashcard.author !== req.user._id)
        res.status(401).send("Unauthorized!");
      else res.status(200).send(flashcard);
    } catch (error) {
      res.status(500).send(error);
    }
  }
);

module.exports = router;
