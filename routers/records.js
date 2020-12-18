const router = require("express").Router();
const Record = require("../models/Record");

router.get("/records", async (req, res) => {
  try {
    let records = await Record.find();
    res.status(200).send(records);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/records", async (req, res) => {
  try {
    let record = req.body;
    await Record.create(record);
    res.status(200).send("success");
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete("/records", async (req, res) => {
  try {
    await Record.deleteMany();
    res.status(200).send("success");
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
