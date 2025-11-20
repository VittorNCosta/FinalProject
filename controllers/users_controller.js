const express = require("express");
const router = express.Router();
const {getAllUsers,
  createUser,
  updateUser,
  deleteUser
} = require("../models/users_model");


// rota para listar todos os usuários
router.get("/", async (req, res) => {
  try {
    const users = await getAllUsers(); // consulta Mongoose
    res.render("templates/home", { data: users });
  } catch (err) {
    console.error("Erro ao carregar usuários:", err);
    res.status(500).send("Erro ao carregar a página");
  }
});


//Atualiza
app.put("/users/:id", async (req, res) => {
  try {
    const result = await updateUser(req.params.id, req.body);
    res.json({ message: "Usuário atualizado!", result });
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar." });
  }
});

// CRIAR
router.post("/", async (req, res) => {
  try {
    const result = await createUser(req.body);
    res.json({ message: "Usuário criado!", result });
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar usuário." });
  }
});

// DELETAR
router.delete("/:id", async (req, res) => {
  try {
    const result = await deleteUser(req.params.id);
    res.json({ message: "Usuário deletado!", result });
  } catch (err) {
    res.status(500).json({ error: "Erro ao deletar." });
  }
});


module.exports = router;