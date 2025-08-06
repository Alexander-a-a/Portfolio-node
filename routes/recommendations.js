var express = require('express');
var router = express.Router();
const fs = require("fs")
const path = require("path")




/* GET home page. */
router.get('/', function(req, res, next) {
  let data = fs.readFileSync(path.resolve(__dirname, "../data/recommendations.json"));
  res.render('recommendations', { data: JSON.parse(data)
 });
});

module.exports = router;