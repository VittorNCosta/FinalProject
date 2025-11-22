const express = require("express");
const router = express.Router();
const FilmesController = require("../controllers/filmes_controller");

// Rota home
router.get("/", FilmesController.listarFilmes);

router.get("/filmes/:id", FilmesController.detalhesFilme);

// Criar
router.post("/filmes", FilmesController.criarFilme);

// Editar
router.post("/filmes/:id/update", FilmesController.atualizarFilme);

// Deletar
router.post("/filmes/:id/delete", FilmesController.deletarFilme);

router.get("/favoritos", (req, res) => {
    res.render("templates/favoritos");
});

router.get("/cinemas", (req, res) => {
    res.render("templates/cinema");
});

router.get("/config", (req, res) => {
    res.render("templates/config_sistema");
});


module.exports = router;