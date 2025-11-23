const express = require("express");
const router = express.Router();

const {
  getAllCinemas,
  createCinema,
  updateCinema,
  deleteCinema,
  Cinema
} = require("../models/cinemas_model");


function validarCampos(obrigatorios, body) {
  let vazios = [];

  for (const campo of obrigatorios) {
    if (!body[campo] || body[campo].toString().trim() === "") {
      vazios.push(campo);
    }
  }

  if (vazios.length > 0) {
    return {
      ok: false,
      mensagem: `Campos obrigatórios vazios: ${vazios.join(", ")}`
    };
  }

  return { ok: true };
}


// LISTAR CINEMAS

router.get("/", async (req, res) => {
  try {
    const cinemas = await getAllCinemas();
    res.json(cinemas);
  } catch (err) {
    res.status(500).json({ error: "Erro ao listar cinemas." });
  }
});


//  CRIAR CINEMA

router.post("/", async (req, res) => {
  try {
    const obrigatorios = ["nome", "endereco"];

    const validacao = validarCampos(obrigatorios, req.body);

    if (!validacao.ok) {
      return res.status(400).json({ error: validacao.mensagem });
    }

    const result = await createCinema({
      nome: req.body.nome,
      endereco: req.body.endereco,
      foto: req.body.foto
    });
    res.json(result);

  } catch (err) {
    res.status(500).json({ error: "Erro ao criar cinema." });
  }
});



// BUSCAR CINEMA POR ID

router.get("/:id", async (req, res) => {
  try {
    const cinema = await Cinema.findOne({ _id: req.params.id });

    if (!cinema) {
      return res.status(404).json({ error: "Cinema não encontrado" });
    }

    res.json(cinema);

  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar cinema." });
  }
});



// ATUALIZAR CINEMA

router.put("/:id", async (req, res) => {
  try {
    const campos = ["nome", "endereco"];

    const validacao = validarCampos(campos, req.body);

    if (!validacao.ok) {
      return res.status(400).json({ error: validacao.mensagem });
    }

    const result = await updateCinema(req.params.id, {
      nome: req.body.nome,
      endereco: req.body.endereco,
      foto: req.body.foto
    });

    if (!result) {
      return res.status(404).json({ error: "Cinema não encontrado" });
    }

    res.json(result);

  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar cinema." });
  }
});




// DELETAR CINEMA

router.delete("/:id", async (req, res) => {
  try {
    const result = await deleteCinema(req.params.id);

    if (!result) {
      return res.status(404).json({ error: "Cinema não encontrado" });
    }

    res.json({ message: "Cinema excluído com sucesso" });

  } catch (err) {
    res.status(500).json({ error: "Erro ao excluir cinema." });
  }
});


module.exports = router;