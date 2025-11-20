const express = require("express");
const router = express.Router();
const FilmesController = require("../controllers/filmes_controller");

// Rota home
router.get("/", FilmesController.listarFilmes);

// Rota detalhes
router.get("/filmes/:id", FilmesController.detalhesFilme);

// Criar
router.post("/filmes", FilmesController.criarFilme);

// Editar
router.post("/filmes/:id/update", FilmesController.atualizarFilme);

// Deletar
router.post("/filmes/:id/delete", FilmesController.deletarFilme);

module.exports = router;