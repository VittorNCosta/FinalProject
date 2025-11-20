const FilmesModel = require("../models/filmes_model");

// HOME - listar filmes
exports.listarFilmes = async (req, res) => {
  try {
    const filmes = await FilmesModel.getAllMovies();
    res.render("templates/home", { filmes });
  } catch (err) {
    console.error("Erro ao buscar filmes:", err);
    res.status(500).send("Erro ao buscar filmes.");
  }
};

// PÁGINA DE DETALHES
exports.detalhesFilme = async (req, res) => {
  try {
    const filme = await FilmesModel.getMovieById(req.params.id);
    res.render("templates/detalhes", { filme });
  } catch (err) {
    console.error("Erro ao buscar filme:", err);
    res.status(500).send("Erro ao buscar filme.");
  }
};

// CRIAR FILME
exports.criarFilme = async (req, res) => {
  try {
    await FilmesModel.createMovie(req.body);
    res.redirect("/filmes");
  } catch (err) {
    console.error("Erro ao criar filme:", err);
    res.status(500).send("Erro ao criar filme.");
  }
};

// ATUALIZAR FILME
exports.atualizarFilme = async (req, res) => {
  try {
    await FilmesModel.updateMovie(req.params.id, req.body);
    res.redirect("/filmes");
  } catch (err) {
    console.error("Erro ao atualizar filme:", err);
    res.status(500).send("Erro ao atualizar filme.");
  }
};

// DELETAR FILME
exports.deletarFilme = async (req, res) => {
  try {
    await FilmesModel.deleteMovie(req.params.id);
    res.redirect("/filmes");
  } catch (err) {
    console.error("Erro ao deletar filme:", err);
    res.status(500).send("Erro ao deletar filme.");
  }
};