const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  User
} = require("../models/users_model");


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


// API LISTAR
router.get("/users", async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Erro ao listar." });
  }
});


// API CRIAR
router.post("/users", async (req, res) => {
  try {
    const obrigatorios = ["nome", "email", "senha"];

    const validacao = validarCampos(obrigatorios, req.body);

    if (!validacao.ok) {
      return res.status(400).json({ error: validacao.mensagem });
    }

    const result = await createUser(req.body);
    res.json(result);

  } catch (err) {
    res.status(500).json({ error: "Erro ao criar." });
  }
});



// API BUSCAR PELO ID
router.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar usuário." });
  }
});


// API ATUALIZAR
router.put("/users/:id", async (req, res) => {
  try {
    const campos = ["nome", "email", "senha"];

    const validacao = validarCampos(campos, req.body);

    if (!validacao.ok) {
      return res.status(400).json({ error: validacao.mensagem });
    }

    const result = await updateUser(req.params.id, req.body);

    if (!result) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.json(result);

  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar." });
  }
});


// API DELETAR
router.delete("/users/:id", async (req, res) => {
  try {
    const result = await User.findByIdAndDelete(req.params.id);

    if (!result) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.json({ message: "Usuário excluído com sucesso" });

  } catch (err) {
    res.status(500).json({ error: "Erro ao excluir usuário." });
  }
});


module.exports = router;
