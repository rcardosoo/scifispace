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
    voto: [Number],
    genres: Object
}, { collection: 'filme' }
);

var userSchema = new mongoose.Schema({
    nome: { type: String, unique: true, required: true, dropDups: true },
    email: { type: String, unique: true, required: true, dropDups: true },
    senha: { type: String, unique: true, required: true, dropDups: true }
}, { collection: 'user' }
);

var generoSchema = new mongoose.Schema({
    genero_id: String,
    nome: String,
}, { collection: 'genero' }
);

var votoSchema = new mongoose.Schema({
    user_id: String,
    filme_id: String,
    voto: String
}, { collection: 'voto' }
);

module.exports = { Mongoose: mongoose, 
                   FilmeSchema: filmeSchema, 
                   UserSchema: userSchema,
                   GeneroSchema: generoSchema,
                   VotoSchema: votoSchema }
