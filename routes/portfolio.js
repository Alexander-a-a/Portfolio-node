var express = require("express");
var router = express.Router();
var fs = require("fs");
const path = require("path");
var request = require("request");

var ensureLogIn = require('connect-ensure-login').ensureLoggedIn;
var ensureLoggedIn = ensureLogIn();

// GET home page.
router.get("/", function (req, res, next) {
  let data = fs.readFileSync(path.resolve(__dirname, "../data/portfolio.json"));
  res.render("portfolio", { cakes: JSON.parse(data) });
});

var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();

// Post image req
router.post("/", jsonParser, function (req, res, next) {
  const errorArr = [];
  const specialChar = /[!@#$%^&*()_\-=\[\]{};':"\\|,<>\/?]+/;
  const allowedCategories = ["wedding", "christmas", "birthday", "anniversary"];

  // URL
  const checkUrl = typeof req.body.url === "string" ? req.body.url.trim() : req.body.url;
  if (checkUrl === null || checkUrl === undefined) {
    errorArr.push("URL is required");
  }
  if (typeof checkUrl !== "string") {
    errorArr.push("URL must be a string");
  } else {
    if (!checkUrl.startsWith("http://") && !checkUrl.startsWith("https://")) {
      errorArr.push(" URL must be http:// or https://");
    }
  }

  // Name
  const checkName = typeof req.body.name === "string" ? req.body.name.trim() : req.body.name;
  if (checkName === null || checkName === undefined || checkName === "") {
    errorArr.push("name is required!");
  }
   if (typeof checkName !== "string") {
    errorArr.push("name must be a string");
  } else {
    if (checkName.length > 12) {
      errorArr.push("name must be less than 12 characters");
    }

  if (checkName.match(specialChar)) {
    errorArr.push("name can't contain special characters");
  }
}

  // Alt
  const checkAlt = typeof req.body.alt === "string" ? req.body.alt.trim() : req.body.alt;
  if (checkAlt === null || checkAlt === undefined || checkAlt === "") {
    errorArr.push("alt is required");
  }
  if (typeof checkAlt !== "string") {
    errorArr.push("alt must be a string");
  }

  // Category
  const checkCategory = typeof req.body.category === "string" ? req.body.category.trim() : req.body.category;
  if (checkCategory === null || checkCategory === undefined || checkCategory === "") {
    errorArr.push("category is required");
  }

   if (typeof checkCategory !== "string") {
    errorArr.push("category must be a string");
  } else if (!allowedCategories.includes(checkCategory)) {
    errorArr.push("category must be one of: " + allowedCategories.join(", "));
  }

  // Header
  const checkHeader = typeof req.body.header === "string" ? req.body.header.trim() : req.body.header;
  if (checkHeader === null || checkHeader === undefined || checkHeader === "") {
    errorArr.push("header is required");
  }
    if (typeof checkHeader !== "string") {
    errorArr.push("header must be a string");
  } else if (checkHeader.length > 12) {
    errorArr.push("header must be less than 12 characters");
  }

  // Description
  const checkDescription = typeof req.body.description === "string" ? req.body.description.trim() : req.body.description;
  if (checkDescription === null || checkDescription === undefined || checkDescription === "") {
    errorArr.push("must have description");
  }
  if (typeof checkDescription !== "string") {
    errorArr.push("description must be a string");
  } else if (checkDescription.length > 25) {
    errorArr.push("description must be less than 25 characters");
  }

  // Return validation errors
  if (errorArr.length > 0) {
    return res.status(400).json({ errors: errorArr });
  }

  // Save data if valid
  let rawdata = fs.readFileSync(
    path.resolve(__dirname, "../data/portfolio.json")
  );
  let portfoliosArray = JSON.parse(rawdata);
  if (portfoliosArray.filter((x) => x.name === req.body.name).length == 0) {
    download(req.body.url, req.body.name, function () {
      console.log("done");
    });
    const newArray = portfoliosArray.concat([req.body]);
    fs.writeFileSync(
      path.resolve(__dirname, "../data/portfolio.json"),
      JSON.stringify(newArray)
    );
  }
  return res.status(201).json({ message: "Portfolio item added" });
});


//download image to the server:
var download = function (url, filename, callback) {
  request.head(url, function (err, res, body) {
    request(url)
      .pipe(
        fs.createWriteStream(path.resolve(__dirname, "../data/img/" + filename))
      )
      .on("close", callback);
  });
};


// Delete image only for logged in users
router.delete('/', jsonParser, ensureLoggedIn, (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Missing "name" in body' });
    }

    const dataPath = path.resolve(__dirname, '../data/portfolio.json');
    const imgPath = path.resolve(__dirname, `../data/img/${name}`);

    const portfoliosArray = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    const newArray = portfoliosArray.filter(x => x.name !== name);

    // If nothing was removed, return 404 (not found)
    if (newArray.length === portfoliosArray.length) {
      return res.status(404).json({ error: 'Image not found in portfolio.json' });
    }

    // Remove image file (ignore error if file missing)
    fs.unlink(imgPath, () => {
      console.log(`${name} deleted (image + entry).`);
    });

    // Save updated JSON
    fs.writeFileSync(dataPath, JSON.stringify(newArray, null, 2));
    return res.status(200).json({ ok: true });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
