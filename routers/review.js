const router = require("express").Router();
const Flashcard = require("../models/Flashcard");
const passport = require("passport");
const moment = require("moment");

router.get(
  "/review/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      let flashcard = await Flashcard.findById(req.params.id);
      if (flashcard.author !== req.user._id)
        res.status(401).send("Unauthorized");
      else {
        if (!flashcard.reviewRecord) {
          flashcard.reviewRecord = [];
        }

        if (flashcard.reviewRecord.length === 0) {
          flashcard.reviewRecord.push(new Date());
        } else {
          let topRecord = flashcard.reviewRecord[0];
          if (
            moment(topRecord).format("YYYYMMDD") === moment().format("YYYYMMDD")
          ) {
            flashcard.reviewRecord.shift();
          }
          flashcard.reviewRecord.unshift(new Date());
        }
        await flashcard.save();
        res.status(200).send("Success");
      }
    } catch (error) {
      res.status(500).send(error);
    }
  }
);

router.delete(
  "/review/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      let flashcard = await Flashcard.findById(req.params.id);
      if (flashcard.author !== req.user._id)
        res.status(401).send("Unauthorized");
      else {
        if (!flashcard.reviewRecord) {
          flashcard.reviewRecord = [];
        }

        if (flashcard.reviewRecord.length > 0) {
          let topRecord = flashcard.reviewRecord[0];
          if (
            moment(topRecord).format("YYYYMMDD") === moment().format("YYYYMMDD")
          ) {
            flashcard.reviewRecord.shift();
          }
        }
        await flashcard.save();
        res.status(200).send("Success");
      }
    } catch (error) {
      res.status(500).send(error);
    }
  }
);

module.exports = router;
