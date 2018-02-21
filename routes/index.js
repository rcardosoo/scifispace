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
  filmeModel.filmeDetails(idFilme, function(err, result) {
    if (!err) {
          filmeModel.filmeGenres(function(e, resGenres) {
            if (resGenres) {
              var genresArray = JSON.stringify(result.genres).slice(1);
              genresArray = genresArray.slice(0, -1);
              genresArray = genresArray.split(','); 
              res.render('details', { filme: result,
                                      genres: resGenres, genresFilme: genresArray, msg: null});
            } else {
              console.log("Erro ao buscar generos: "+e);
              res.redirect('/');
            }                              
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
  var busca = typeof req.body.busca != 'undefined' ? req.body.busca : null;

  filmeModel.searchFilme(busca, function(err, resultMongo){
      if (resultMongo != null) {
          if (JSON.stringify(resultMongo[0]) != "[]") {
            res.render('index', { filmelist: resultMongo, msg: null });                            
          } else {
            res.render('index', { filmelist: null, msg: "Não foram encontrados resultados para a busca" });                                      
          }
        } else {
          res.render('index', { filmelist: null, msg: "Não foram encontrados resultados para a busca" });                          
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
      filmeModel.computarVoto(voto, result._id, filmeId, function(data) {
        filmeModel.showData(function(data) {
          res.render('index', { "filmelist": data, msg: "Voto computado com sucesso", error: false});      
        });
      });  
    } else {
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
