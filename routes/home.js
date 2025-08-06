var express = require("express");
var router = express.Router();
const fs = require("fs");
const path = require("path");

/* GET home page. */
router.get("/", function (req, res, next) {
  let data = fs.readFileSync(
    path.resolve(__dirname, "../data/introductionArray.json"),
    "utf8"
  );
  res.render("home", { array: JSON.parse(data) });
});

var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();


// Post request
router.post("/", jsonParser, function (req, res, next) {
  let rawdata = fs.readFileSync(
    path.resolve(__dirname, "../data/introductionArray.json")
  );
  let array = JSON.parse(rawdata);
  const newArray = array.concat([req.body.newText]);
  fs.writeFileSync(
    path.resolve(__dirname, "../data/introductionArray.json"),
    JSON.stringify(newArray, null, 2) 
  );
  res.end();
});




module.exports = router;
