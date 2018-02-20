"use strict";
var request = require('request');
var db = require("../db/db");
var genres = require("../util/genres");

class FilmeModel {

    sincronizar(urlAPI, totalPages, callback) {
        var self = this;
        var Filmes = db.Mongoose.model('filme', db.FilmeSchema, 'filme');
        Filmes.remove({}).exec();
        for (var page = 1; page <= totalPages; page++) {
            var urlPage = urlAPI + "&page=" + page;
            request(urlPage, function callback(error, response, body) {
                if (!error) {
                    var data = JSON.parse(body);
                    for (var index in data.results) {
                        self.insertData(data.results[index], page, function (err, result) {
                            if (!result) {
                                console.log("Erro no metodo inserData: " + err);
                            }
                        });
                    }
                }
            });
        }
    }

    insertGenres(callback) {
        console.log("Inserindo generos");
        var Genero = db.Mongoose.model('genero', db.GeneroSchema, 'genero');
        for (var index in genres.list) {
            console.log("inseriu genero: " + index);
            let genreToCreate = new Genero({
                genero_id: genres.list[index].id,
                nome: genres.list[index].name,
            });
            genreToCreate.save(function (err) {
                if (err) {
                    console.log("Error! " + err.message);
                    callback(err);
                }
            });
        }
        callback(null);
    }

    showData(callback) {
        var Filmes = db.Mongoose.model('filme', db.FilmeSchema, 'filme');
        Filmes.find({}).sort({ popularity: -1 })
            .lean().exec(
            function (e, docs) {
                callback(docs);
            });
    }

    filmeGenres(callback) {
        var Genero = db.Mongoose.model('genero', db.GeneroSchema, 'genero');
        Genero.find({}).exec(function (e, docs) {
            if (docs) {
                callback(null, docs);
            } else {
                callback(e, null);                
            }
        });

    }

    filmeDetails(idFilme, callback) {
        var Filmes = db.Mongoose.model('filme', db.FilmeSchema, 'filme');
        Filmes.find({ id: idFilme }).exec(
            function (e, docs) {
                if (docs) {
                    callback(null, docs[0]);
                } else {
                    console.log("Error! " + err.message);
                    callback(err, false);
                }
            });
    }

    searchFilme(busca, callback) {
        console.log("VAI BUSCAR PELO MONGO, BUSCA: " + busca);
        var Filmes = db.Mongoose.model('filme', db.FilmeSchema, 'filme');
        Filmes.find({ title: "/" + busca + "/" }).sort({ popularity: -1 })
            .lean().exec(
            function (e, docs) {
                console.log("ACHOU: " + JSON.stringify(docs));
                callback(null, docs);
            });
    }

    computarVoto(nota, userId, filmeId, callback) {
        console.log("Entrou em computador voto");
        var self = this;
        var Voto = db.Mongoose.model('voto', db.VotoSchema, 'voto');
        Voto.find({ user_id: userId, filme_id: filmeId }).exec(function (e, docs) {
            if (docs && JSON.stringify(docs) != '[]') {
                console.log("existe voto com o filmeID especificado: ");
                Voto.update({ user_id: userId, filme_id: filmeId },
                    { voto: nota }).exec(function (e, docs) {
                        if (e) {
                            console.log("Error! " + err.message);
                            callback(err, false);
                        }
                        else {
                            self.recalcularVoto(filmeId, function (err, result) {
                                if (!err) {
                                    console.log("Voto computado! = result: "+result);
                                    self.setVoto(filmeId, result, function(r) {
                                        if (r) {
                                            callback(null, true);
                                        }
                                    });
                                } else {
                                    console.log("Error! " + err.message);
                                    callback(err, false);
                                }
                            });
                        }
                    });
            } else {
                console.log("nao existe voto desse usuario para esse filme");
                var votoToCreate = new Voto({
                    user_id: userId,
                    filme_id: filmeId,
                    voto: nota
                });
                console.log("voto criado");
                votoToCreate.save(function (err) {
                    if (err) {
                        console.log("Error! " + err.message);
                        callback(err, false);
                    }
                    else {
                        console.log("voto inserido, vai recalcular");
                        self.recalcularVoto(filmeId, function (err, result) {
                            if (!err) {
                                console.log("Voto computado! = result: "+result);
                                self.setVoto(filmeId, result, function(r) {
                                    if (r) {
                                        callback(null, true);
                                    }
                                });
                            } else {
                                console.log("Error! " + err.message);
                                callback(err, false);
                            }
                        });
                    }
                });
            }
        });

    }

    setVoto(filmeId, calculo, callback) {
        var Filme = db.Mongoose.model('filme', db.FilmeSchema, 'filme'); 
        var votoNumber = Number((calculo).toFixed(1));  
        var votoNumber = votoNumber+"";
        console.log("VOTO = "+calculo);
        Filme.update({ id: filmeId },
            { voto: votoNumber }).exec(function (e, docs) {
            if (docs) {
                callback(true);
            } else {
                callback(false);
            }        
        });
    }

    recalcularVoto(filmeId, callback) {
        var Voto = db.Mongoose.model('voto', db.VotoSchema, 'voto');        
        Voto.find({filme_id: filmeId}).exec(function (e, docs) {
            if (docs) {
                let soma = 0;
                for (var i in docs) {
                    soma = soma + parseInt(docs[i].voto);
                }
                callback(null, soma/docs.length);
            } else {
                console.log("Error! " + err.message);
                callback(err, false);
            }

        });
    }

    insertData(data, page, callback) {
        var Filmes = db.Mongoose.model('filme', db.FilmeSchema, 'filme');
        var filme = new Filmes({
            id: data.id,
            vote_average: data.vote_average,
            title: data.title,
            popularity: data.popularity,
            poster_path: data.poster_path,
            overview: data.overview,
            release_date: data.release_date,
            voto: 0,
            genres: data.genre_ids,
            page: page
        });

        filme.save(function (err) {
            if (err) {
                console.log("Error! " + err.message);
                callback(err, false);
            }
            else {
                console.log("Filme cadastrado!");
                callback(null, true);
            }
        });
    }
}

module.exports = FilmeModel;