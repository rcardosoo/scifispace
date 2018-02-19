var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/scifispace');

var filmeSchema = new mongoose.Schema({
    id: String,
    vote_average: String,
    title: String,
    popularity: String,
    poster_path: String,
    overview: String,
    release_date: String,
    voto: String,
    Page: String
}, { collection: 'filme' }
);

var userSchema = new mongoose.Schema({
    nome: { type: String, unique: true, required: true, dropDups: true },
    email: { type: String, unique: true, required: true, dropDups: true },
    senha: { type: String, unique: true, required: true, dropDups: true }
}, { collection: 'user' }
);

module.exports = { Mongoose: mongoose, FilmeSchema: filmeSchema, UserSchema: userSchema }
