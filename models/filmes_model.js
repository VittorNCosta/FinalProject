const mongoose = require("mongoose");

// Schema representa a estrutura do documento no MongoDB
const FilmeSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  diretor: String,
  genero: String,
  ano: Number,
  sinopse: String,
  imagem: String,
  favorito: { type: Boolean, default: false }
});

// Model baseado no schema
const Filme = mongoose.model("Filme", FilmeSchema);

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

// Criar novo filme
async function createMovie(data) {
  try {
    return await Filme.create(data);
  } catch (err) {
    console.error("Erro ao criar filme:", err);
    throw err;
  }
}

// Editar um filme existente
async function updateMovie(id, data) {
  try {
    return await Filme.findByIdAndUpdate(id, data, { new: true });
  } catch (err) {
    console.error("Erro ao atualizar filme:", err);
    throw err;
  }
}

// Apagar um filme
async function deleteMovie(id) {
  try {
    return await Filme.findByIdAndDelete(id);
  } catch (err) {
    console.error("Erro ao deletar filme:", err);
    throw err;
  }
}

module.exports = {
  Filme,
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
};