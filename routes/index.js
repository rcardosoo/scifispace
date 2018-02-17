var express = require('express');
var router = express.Router();
var request = require('request');
var FilmeModel = require("../models/FilmeModel");
var filmeModel = new FilmeModel();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/filmes', function (req, res, next) {
    filmeCtrl.showData(function(data) {
        res.render('filmelist', { "filmelist": data });      
    });
});

router.get('/sincronizar', function(req, res, next) {
  var urlAPI = "https://api.themoviedb.org/3/discover/movie?api_key=516df799631d51e95f9abca329a46d83&language=pt-BR&sort_by=popularity.desc&with_genres=878&include_video=false";

  request(urlAPI, function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
        var data = JSON.parse(body);
        var totalPages = parseInt(data.total_pages);
        //filmeModel.updateFilmes(urlAPI, totalPages);
    }
  });

  res.render('index', { title: 'Express' });
});

module.exports = router;
