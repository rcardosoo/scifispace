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
    voto: String
}, { collection: 'filme' }
);

module.exports = { Mongoose: mongoose, FilmeSchema: filmeSchema }
