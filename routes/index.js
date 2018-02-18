var express = require('express');
var router = express.Router();
var request = require('request');
var FilmeModel = require("../models/FilmeModel");
var filmeModel = new FilmeModel();
var urlAPI = "https://api.themoviedb.org/3/discover/movie?api_key=516df799631d51e95f9abca329a46d83&language=pt-BR&sort_by=popularity.desc&with_genres=878&include_video=false";

var FilmeService = require("../models/FilmeService");
var filmeService = new FilmeService();

router.get('/', function(req, res, next) {
  filmeService.pageList(urlAPI, 1, function(err, result) {
    if (!err) {
      res.render('index', { filmelist: result, msg: null });
    } else {
      res.render('index', { filmelist: null, msg: "O serviço está fora do ar" });
    }
  });
});

router.get('/filme/:id', function (req, res, next) {
  var urlFilme = "https://api.themoviedb.org/3/movie/"+ req.params.id +"?api_key=516df799631d51e95f9abca329a46d83&language=pt-BR";  
  var urlProd = "https://api.themoviedb.org/3/movie/"+ req.params.id +"/credits?api_key=516df799631d51e95f9abca329a46d83&language=pt-BR";    
  filmeService.filmeDetails(urlFilme, function(err, result) {
    if (!err) {
      filmeService.filmeProduction(urlProd, function(error, resData){
        console.log(JSON.stringify(resData));
        res.render('details', { filme: result, production: resData, msg: null });        
      });
    } else {
      res.render('details', { filme: null, msg: "O serviço está fora do ar" });
    }
  });
});


module.exports = router;
