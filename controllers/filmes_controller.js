const express = require("express");
const router = express.Router();
const { autenticacaoLogin } = require("../middleware/auth");

const {
  getAllFilmes,
  createFilme,
  updateFilme,
  deleteFilme,
  Filme
} = require("../models/filmes_model");

router.get("/home", autenticacaoLogin, async (req, res) => {
  try {
    const filmes = await getAllFilmes();

    res.render("templates/home", {
      filmes,
      currentUser: {
        username: req.session.username
      }
    });

  } catch (err) {
    console.error("Erro ao carregar home:", err);
    res.status(500).send("Erro ao carregar home.");
  }
});

// Detalhes do filme
router.get("/filmes/detalhes/:id", autenticacaoLogin, async (req, res) => {
  try {
    const filme = await Filme.findById(req.params.id);

    if (!filme)
      return res.status(404).send("Filme não encontrado");

    res.render("templates/detalhes_filme", { filme });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao buscar filme.");
  }
});

// ===== API =====

// Listar
router.get("/filmes", async (req, res) => {
  try {
    const filmes = await getAllFilmes();
    res.json(filmes);
  } catch (err) {
    res.status(500).json({ error: "Erro ao listar filmes." });
  }
});

// Criar
router.post("/filmes", async (req, res) => {
  try {
    const { titulo, genero, ano } = req.body;
    if (!titulo || !genero || !ano)
      return res.status(400).json({ error: "Campos obrigatórios vazios." });

    const result = await createFilme(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar filme." });
  }
});

// Buscar por ID
router.get("/filmes/:id", async (req, res) => {
  try {
    const filme = await Filme.findById(req.params.id);

    if (!filme)
      return res.status(404).json({ error: "Filme não encontrado" });

    res.json(filme);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar filme." });
  }
});

// Atualizar
router.put("/filmes/:id", async (req, res) => {
  try {
    const { titulo, genero, ano } = req.body;
    if (!titulo || !genero || !ano)
      return res.status(400).json({ error: "Campos obrigatórios vazios." });

    const result = await updateFilme(req.params.id, req.body);

    if (!result)
      return res.status(404).json({ error: "Filme não encontrado" });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar filme." });
  }
});

// Deletar
router.delete("/filmes/:id", async (req, res) => {
  try {
    const result = await deleteFilme(req.params.id);

    if (!result)
      return res.status(404).json({ error: "Filme não encontrado" });

    res.json({ message: "Filme excluído com sucesso" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao excluir filme." });
  }
});

module.exports = router;