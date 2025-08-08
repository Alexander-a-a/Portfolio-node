var express = require('express');
var router = express.Router();
var fs = require("fs");
const path = require("path");
var request = require('request');

// GET home page. 
router.get('/', function(req, res, next) {
  let data = fs.readFileSync(path.resolve(__dirname, "../data/portfolio.json"));
  res.render('portfolio', { cakes: JSON.parse(data)});
});



var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();

// Post image req
router.post('/', jsonParser, function(req, res, next) {
  let rawdata = fs.readFileSync(path.resolve(__dirname, "../data/portfolio.json"));
  let portfoliosArray = JSON.parse(rawdata);
  if(portfoliosArray.filter(x => x.name === req.body.name).length == 0) {
    download(req.body.url, req.body.name, function(){
      console.log('done');
    });
    const newArray = portfoliosArray.concat([req.body])
    fs.writeFileSync(path.resolve(__dirname, "../data/portfolio.json"), JSON.stringify(newArray));
  }
  res.end();
});

//download image to the server:
var download = function(url, filename, callback){
  request.head(url, function(err, res, body){
    request(url).pipe(fs.createWriteStream(path.resolve(__dirname, '../data/img/'+ filename))).on('close', callback);
  });
};

// Delete image

router.delete('/', jsonParser, function(req, res, next) {
  let rawdata = fs.readFileSync(path.resolve(__dirname, "../data/portfolio.json"));
  let portfoliosArray = JSON.parse(rawdata);
  const newArray = portfoliosArray.filter(x => x.name !== req.body.name)
  if(newArray.length !== portfoliosArray.length) {
    fs.unlink(path.resolve(__dirname, '../data/img/'+ req.body.name), () => {
      console.log(req.body.name + " deleted!");
    });
    fs.writeFileSync(path.resolve(__dirname, "../data/portfolio.json"), JSON.stringify(newArray));
  }
  res.end();
});








module.exports = router;