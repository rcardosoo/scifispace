var express = require('express');
var router = express.Router();
var request = require('request');
var FilmeModel = require("../models/FilmeModel");
var filmeModel = new FilmeModel();
var UserModel = require("../models/UserModel");
var userModel = new UserModel();
var session = require('express-session');
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
  var idFilme = req.params.id;
  var urlProd = "https://api.themoviedb.org/3/movie/"+ req.params.id +"/credits?api_key=516df799631d51e95f9abca329a46d83&language=pt-BR";      
  filmeModel.filmeDetails(idFilme, function(err, result) {
    if (!err) {
      console.log(JSON.stringify(result)); 
      filmeService.filmeProduction(urlProd, function(error, resData) {
          filmeModel.filmeGenres(result.genres, function(resGenres) {
              res.render('details', { filme: result, production: resData, genres: resGenres, msg: null});                                
          });
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
  res.render('registro', { msg: null, error: false });
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

router.post('/store', function(req, res, next) {
  var user = {
    nome: req.body.nome,
    email: req.body.email,
    senha: req.body.senha
  };

  userModel.create(user, function(err, result) {
    if (!err && result) {
      res.render('registro', { msg:"Usuário cadastrado com sucesso", error: false });
    } else {
      console.log("Erro ao cadastrar: "+err);
      res.render('registro', { msg:"Não foi possível cadastrar o usuário", error: true });      
    }
  });

});

router.post('/computar/:id', function(req, res, next) {
  var data = {
    email: req.body.email,
    senha: req.body.senha
  };
  var filmeId = req.params.id;
  var voto = req.body.range;
  userModel.login(data, function (err, result) {
    if (!err && result) {
      filmeModel.computarVoto(range, result._id, filmeId, function(data) {
        res.render('index', { "filmelist": data, msg: "Voto computado com sucesso", error: false});      
      });  
    } else {
      console.log("falhou");
      filmeModel.showData(function(data) {
        res.render('index', { "filmelist": data, msg: "Email ou senha incorretos", error: true });      
      });           
    }
  });
});

router.get('/genres', function(req, res, next) {
  filmeModel.insertGenres(function(e) {
    if (!e) {
      res.redirect('/');
    } else {
      console.log("Erro ao inserir generos: "+e);
      res.redirect('/');
    }
  });
});

module.exports = router;
