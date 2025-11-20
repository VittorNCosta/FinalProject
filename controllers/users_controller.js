const express = require("express");
const router = express.Router();
const User = require("../models/users_model");

// rota para listar todos os usuários
router.get("/", async (req, res) => {
  try {
    const users = await User.find(); // consulta Mongoose
    res.render("templates/home", { data: users });
  } catch (err) {
    console.error("Erro ao carregar usuários:", err);
    res.status(500).send("Erro ao carregar a página");
  }
});

module.exports = router;