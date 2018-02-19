"use strict";
var request = require('request');
var db = require("../db/db");

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
        callback(null, true);
    }

    showData(callback) {
        var Filmes = db.Mongoose.model('filme', db.FilmeSchema, 'filme');
        Filmes.find({}).sort( { popularity: -1 } )
        .lean().exec(
            function (e, docs) {
                callback(docs);
            });
    }

    searchFilme(busca, callback) {
        console.log("VAI BUSCAR PELO MONGO, BUSCA: "+busca);
        var Filmes = db.Mongoose.model('filme', db.FilmeSchema, 'filme');
        Filmes.find({title: "/"+busca+"/"}).sort( { popularity: -1 } )
        .lean().exec(
            function (e, docs) {
                console.log("ACHOU: "+JSON.stringify(docs));
                callback(null, docs);
            });
    }

    insertData(data, page, callback) {
        console.log("ENTROU NO INSERT DATA");
        console.log("VAI INSERIR: " + data);
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
            Page: page
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