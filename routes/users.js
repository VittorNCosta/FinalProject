const express = require("express");
const router = express.Router();
const UsersModel = require("../models/users_model");

router.get("/users", async (req, res) => {
  try {
    const users = await UsersModel.getAllUsers();
    res.json(users);
  } catch (err) {
    console.error("Erro ao buscar usuários:", err);
    res.status(500).send("Erro ao buscar usuários");
  }
});

module.exports = router;