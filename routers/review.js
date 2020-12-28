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

router.post(
  "/review",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      let flashcards = await Flashcard.find({ author: req.user._id });
      let query = req.body;
      let resCards = filter(flashcards, query);
      res.status(200).send(resCards);
    } catch (error) {
      console.log(error.toString());
      res.status(500).send(error);
    }
  }
);

const filter = (flashcards, query) => {
  let categoriesSet, tagsSet;
  if (query.categories) {
    categoriesSet = new Set();
    for (let category of query.categories) categoriesSet.add(category);
  }
  if (query.tags) {
    tagsSet = new Set();
    for (let tag of query.tags) tagsSet.add(tag);
  }

  let eligibleFlashcards = flashcards.filter((flashcard) => {
    if (categoriesSet && !categoriesSet.has(flashcard.category)) return false;
    if (tagsSet) {
      let flag = false;
      for (let tag of flashcard.tags) {
        if (tagsSet.has(tag)) {
          flag = true;
          break;
        }
      }
      if (!flag) return false;
    }
    if (
      flashcard.reviewRecord &&
      flashcard.reviewRecord[0] &&
      moment(flashcard.reviewRecord[0]).format("YYYYMMDD") ===
        moment().format("YYYYMMDD")
    ) {
      return false;
    }
    return true;
  });

  let score = eligibleFlashcards.map((flashcard) => {
    let thisScore = Math.random();
    if (query.priority === true) {
      thisScore = 0;
      if (flashcard.reviewRecord && flashcard.reviewRecord[0]) {
        thisScore = moment(flashcard.reviewRecord[0]).valueOf();
      }
    }
    return [thisScore, flashcard];
  });

  score.sort((a, b) => {
    return a[0] - b[0];
  });

  let res = [];
  let limit = query.amount ? query.amount : Number.MAX_VALUE;
  for (let i = 0; i < Math.min(limit, score.length); i++) {
    res.push(score[i][1]._id);
  }
  return res;
};

module.exports = router;
