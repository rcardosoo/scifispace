var express = require('express');
var router = express.Router();
var request = require('request');
var FilmeModel = require("../models/FilmeModel");
var filmeModel = new FilmeModel();
var urlAPI = "https://api.themoviedb.org/3/discover/movie?api_key=516df799631d51e95f9abca329a46d83&language=pt-BR&sort_by=popularity.desc&with_genres=878&include_video=false";

var FilmeService = require("../models/FilmeService");
var filmeService = new FilmeService();

router.get('/service', function(req, res, next) {
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

router.get('/', function (req, res, next) {
  filmeModel.showData(function(data) {
    res.render('index', { "filmelist": data, msg: null });      
  });
});

router.get('/sobre', function (req, res, next) {
  res.render('sobre', {});
});

router.get('/registro', function (req, res, next) {
  res.render('registro', {});
});

router.get('/sincronizar', function(req, res, next) {  
  request(urlAPI, function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
      var data = JSON.parse(body);
      var totalPages = parseInt(data.total_pages);
      filmeModel.sincronizar(urlAPI, totalPages, function(err, result) {
        if (!err) {
          res.redirect('/');     
        } else {
          res.render('index', { filmelist: null, msg: "O serviço está fora do ar" });
        }
      });
    }
  });
});

router.post('/busca', function(req, res, next) {
  var busca = req.body.busca;  
  filmeModel.searchFilme(busca, function(err, resultMongo){
    if (!err) {
      if (resultMongo == null || typeof resultMongo == 'undefined' || JSON.stringify(resultMongo) == '[]') {
        var urlAPISearch = "https://api.themoviedb.org/3/search/movie?api_key=516df799631d51e95f9abca329a46d83&adult=false&language=pt-BR&sort_by=popularity.desc&with_genres=878&include_video=false";  
        var searchParam = busca.split(' ').join('+');
        var urlSearch = urlAPISearch+"&query="+searchParam;
        console.log("VAI BUSCAR PELO SERVIÇO");
        filmeService.searchFilme(urlSearch, function(err, result) {
          if (!err) {
            if (typeof result == 'undefined' || JSON.stringify(result) == '[]') {
              res.render('index', { filmelist: null, msg: "Filme não encontrado" });                     
            } else {
              res.render('index', { filmelist: result, msg: null });                   
            }
          } else {
            res.render('index', { filmelist: null, msg:"O serviço está fora do ar"});
          }
        });
      } else {
        console.log("ENCONTROU PELO MONGO");
        res.render('index', { filmelist: resultMongo, msg: null });
      }
    } else {
      console.log("Erro: "+err);
      res.render('index', { filmelist: null, msg:"Algum erro aconteceu"});
    }
  });
});

module.exports = router;
