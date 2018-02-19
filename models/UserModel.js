"use strict";
var request = require('request');
var db = require("../db/db");
var bcrypt = require("bcrypt-nodejs");

class UserModel {

    create(user, callback) {
        var User = db.Mongoose.model('user', db.UserSchema, 'user');
        var userToCreate = new User({
            nome: user.nome,
            email: user.email,
            senha: bcrypt.hashSync(user.senha)
        });

        userToCreate.save(function (err) {
            if (err) {
                console.log("Error! " + err.message);
                callback(err, false);
            }
            else {
                console.log("Usuario cadastrado!");
                callback(null, true);
            }
        });
    }

    login(data, callback) {
        var User = db.Mongoose.model('user', db.UserSchema, 'user');
        console.log("vai buscar o email");
        User.findOne({email: data.email}).exec(function(e, docs){
            if (docs) {
                if (bcrypt.compareSync(data.senha, docs.senha)) {
                    console.log("Senha bateu");
                    return callback(e, docs);
                } else {
                    console.log("Senha nao bateu");
                    return callback(e, null);
                }                    
            }
        });
    }
}

module.exports = UserModel;