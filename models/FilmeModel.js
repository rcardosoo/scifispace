"use strict";
var mysql = require('mysql');
var db = require("../db/db");

class FilmeModel {

    showData(callback) {
        var Filmes = db.Mongoose.model('filme', db.FilmeSchema, 'filme');
        Filmes.find({}).lean().exec(
           function (e, docs) {
                callback(docs);
        });
    }

    /*insert(data, conn, callback) {
            var sqlini = "INSERT INTO `filme` (`id`, `title`, `average`, `popularity`, `poster_path`, `overview`, `release_date`) VALUES";
            var values =    "('" + data.id + "'," +
                            "'" + data.title + "'," +
                            "'" + data.average + "'," +
                            "'" + data.popularity + "'," +
                            "'" + data.poster_path + "'," +
                            "'" + data.overview + "'," +
                            "'" + data.release_date + "')";

            var sql = sqlini+" "+values;
            console.log("SQL A SER EXECUTADO: "+sql);
            conn.query(sql, function(error, results, fields){
                setTimeout(function() {console.log("WAIT INSERT");},1000);
                if(error) {
                    console.log("ERRO NO BD FOI: "+error);
                    callback(false);
                }
                else {
                    callback(true);
                }
            }).on('close', function() {
                conn.end();
            });

    }//end insert

    truncateTable(callback) {
        try {
            var sql = "truncate table `filme`";
            this.execSQLQuery(sql, function (error, results){
                if(error) {
                    throw "Database error: "+error;
                } else {
                    console.log("ZEROU A TABELA FILMES");
                    callback(null, true);  
                }              
            });
        } catch(err) {
            callback(err, false);
        }
    }

    execSQLQuery(sqlQry, callback){
        const connection = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "",
            database: "scifispace"
        });
       
        connection.query(sqlQry, function(error, results, fields){
            if(error) 
                callback(error, null);
            else
              callback(null, results);
            connection.end();
        });
    }//end execSqlQuery*/
}

module.exports = FilmeModel;