const express = require("express");
const Log = require("../../models/logs");

const router = express.Router();

router.get("/", (req, res) => {
  const log = new Log({
    date: new Date().toLocaleString(),
    results: "1000 km",
  });
  log
    .save()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      return console.log(err);
    });

  // return res.status(200).json({});
});

router.get("/all-logs", (req, res) => {
  Log.find()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      return console.log(err);
    });
});

module.exports = router;
