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
  res.redirect("/home");
});



// Post delete request
router.delete("/", jsonParser, function (req, res, next) {
  const rawdata = fs.readFileSync(
    path.resolve(__dirname, "../data/introductionArray.json")
  );
  const array = JSON.parse(rawdata);
  const updatedArray = array.filter(item => item !== req.body.deleteText);

  if (updatedArray.length !== array.length) {
    fs.writeFileSync(
      path.resolve(__dirname, "../data/introductionArray.json"),
      JSON.stringify(updatedArray, null, 2)
    );
    res.status(200).json({ message: "Deleted successfully." });
  } else {
    console.log("Value not found!");
    res.status(404).json({ message: "Value not found." });
  }
});


module.exports = router;
