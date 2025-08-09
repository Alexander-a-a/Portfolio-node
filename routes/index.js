var express = require('express');
var router = express.Router();
const fs = require('fs');
const path = require('path');

router.get('/', (req, res) => {
  const introPath = path.resolve(__dirname, '../data/introductionArray.json');
  const recsPath  = path.resolve(__dirname, '../data/recommendations.json');
  const cakesPath = path.resolve(__dirname, '../data/portfolio.json'); // <-- add this

  const array = JSON.parse(fs.readFileSync(introPath, 'utf8'));
  const data  = JSON.parse(fs.readFileSync(recsPath, 'utf8'));
  const cakes = JSON.parse(fs.readFileSync(cakesPath, 'utf8'));        // <-- and this

  console.log('Rendering HOME index.ejs');
  res.render('index', { title: 'Express', array, data, cakes });       // <-- pass cakes
});

module.exports = router;