const mongoose = require("mongoose");

// Schema
const FilmeSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descricao: String,
  diretor: String,
  genero: String,
  ano: Number,
  sinopse: String,
  poster: String,
});

// 👉 força o Mongoose a usar a coleção "Filmes"
const Filme = mongoose.model("filme", FilmeSchema, "filmes");

// ---------------------
// FUNÇÕES DO CRUD
// ---------------------

// Listar todos os filmes
async function getAllMovies() {
  try {
    return await Filme.find();
  } catch (err) {
    console.error("Erro ao buscar filmes:", err);
    throw err;
  }
}

// Buscar filme por ID
async function getMovieById(id) {
  try {
    return await Filme.findById(id);
  } catch (err) {
    console.error("Erro ao buscar filme:", err);
    throw err;
  }
}

async function getAllFilmes() {
  return await Filme.find();
}

async function createFilme(data) {
  return await Filme.create(data);
}

async function updateFilme(id, data) {
  return await Filme.findByIdAndUpdate(id, data, { new: true });
}

async function deleteFilme(id) {
  return await Filme.findByIdAndDelete(id);
}

module.exports = {
  getAllFilmes,
  createFilme,
  updateFilme,
  deleteFilme,
  Filme
};