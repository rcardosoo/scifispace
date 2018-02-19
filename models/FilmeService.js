"use strict";
var request = require('request');

class FilmeService {

    pageList(urlAPI, page, callback) {
        var urlPage = urlAPI+"&page="+page;
        request(urlPage, function (error, response, body) {
            if (error == null) {
                var data = JSON.parse(body);
                console.log("Request funcionou, dados: "+data);
                return callback(null, data.results);
            } else {
                console.log("Ocorreu um erro ao buscar a página "+page+" - Error: "+error);
                return callback(error, null);
            }
        });
   }

   filmeProduction(urlAPI, callback) {
    request(urlAPI, function (error, response, body) {
        if (error == null) {
            var data = JSON.parse(body);
            return callback(null, data);
        } else {
            console.log("Ocorreu um erro ao buscar o fime - Error: "+error);
            return callback(error, null);
        }
    });
   }

   searchFilme(urlAPI, callback) {
    request(urlAPI, function (error, response, body) {
        if (error == null) {
            var data = JSON.parse(body);
            return callback(null, data.results);   
        } else {
            console.log("Ocorreu um erro ao buscar o fime - Error: "+error);
            return callback(error, null);
        }
    });
   }

   filmeDetails(urlAPI, callback) {
    request(urlAPI, function (error, response, body) {
        if (error == null) {
            var data = JSON.parse(body);
            console.log("Request funcionou, dados: "+data);
            return callback(null, data);
        } else {
            console.log("Ocorreu um erro ao buscar o fime - Error: "+error);
            return callback(error, null);
        }
    });
   }
}

module.exports = FilmeService;