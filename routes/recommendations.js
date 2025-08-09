var express = require("express");
var router = express.Router();
const fs = require("fs");
const path = require("path");

var ensureLogIn = require("connect-ensure-login").ensureLoggedIn;
var ensureLoggedIn = ensureLogIn();

/* GET home page. */
router.get("/", function (req, res, next) {
  let data = fs.readFileSync(
    path.resolve(__dirname, "../data/recommendations.json")
  );
  res.render("recommendations", {
    data: JSON.parse(data),
    isAuthenticated: req.isAuthenticated(),
  });
});

var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();

// Post req only if person havent given one before!
router.post("/", jsonParser, function (req, res, next) {
  const errorArr = [];
  const allowedAvatars = [1, 2, 3, "avatar1", "avatar2", "avatar3"];

  // Avatar
  const checkAvatar =
    typeof req.body.avatar === "string"
      ? req.body.avatar.trim()
      : req.body.avatar;
  if (checkAvatar === null || checkAvatar === undefined || checkAvatar === "") {
    errorArr.push("avatar required");
  }
  if (!allowedAvatars.includes(checkAvatar)) {
    errorArr.push("avatar must be one of: " + allowedAvatars.join(", "));
  }

  // Name
  const checkName =
    typeof req.body.name === "string" ? req.body.name.trim() : req.body.name;
  if (checkName === null || checkName === undefined || checkName === "") {
    errorArr.push("name is required");
  }
  if (typeof checkName !== "string") {
    errorArr.push("name must be string");
  } else {
    if (checkName.length > 25) {
      errorArr.push("name cannot be longer than 25 characters");
    }
  }

  // Role
  const checkRole =
    typeof req.body.role === "string" ? req.body.role.trim() : req.body.role;
  if (checkRole === null || checkRole === undefined || checkRole === "") {
    errorArr.push("role required");
  }
  if (typeof checkRole !== "string") {
    errorArr.push("role must be string");
  } else {
    if (checkRole.length > 25) {
      errorArr.push("role cannot be longer than 25 characters");
    }
  }

  // Description
  const checkDescription =
    typeof req.body.description === "string"
      ? req.body.description.trim()
      : req.body.description;
  if (
    checkDescription === null ||
    checkDescription === undefined ||
    checkDescription === ""
  ) {
    errorArr.push("description required");
  }
  if (typeof checkDescription !== "string") {
    errorArr.push("description must be string");
  } else {
    if (checkDescription.length > 300) {
      errorArr.push("description must be less than 300 characters");
    }
  }

  // Return validation errors
  if (errorArr.length > 0) {
    return res.status(400).json({ errors: errorArr });
  }

  // Save data if valid and dosent exist in the json
  let rawdata = fs.readFileSync(
    path.resolve(__dirname, "../data/recommendations.json")
  );
  let recommendationsArray = JSON.parse(rawdata);
  if (
    recommendationsArray.filter((x) => x.name === req.body.name).length == 0
  ) {
    const newArray = recommendationsArray.concat([req.body]);
    fs.writeFileSync(
      path.resolve(__dirname, "../data/recommendations.json"),
      JSON.stringify(newArray)
    );
  } else {
    return res
      .status(409)
      .json({ message: "Skipped cause name already exists" });
  }
  return res.status(201).json({ message: "Recommendation item added" });
});

// Post delete request
router.delete("/", jsonParser, ensureLoggedIn, function (req, res, next) {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Missing "name" in body' });
    }

    const filePath = path.resolve(__dirname, "../data/recommendations.json");
    const recommendationsArray = JSON.parse(fs.readFileSync(filePath, "utf8"));

    const newArray = recommendationsArray.filter((x) => x.name !== name);

    // If no change, item not found
    if (newArray.length === recommendationsArray.length) {
      return res.status(404).json({ error: "Recommendation not found" });
    }

    fs.writeFileSync(filePath, JSON.stringify(newArray, null, 2));
    return res.status(200).json({ ok: true, message: `${name} deleted.` });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
