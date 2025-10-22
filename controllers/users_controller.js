const express = require("express");
const router = express.Router();
const { getAllUsers } = require("../models/users_model");
const { pool } = require("../app"); // ou importe seu pool se estiver exportando

router.get("/", async (req, res) => {
  try {
    const users = await getAllUsers(pool);
    res.render("index", { data: users });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao carregar a página");
  }
});

module.exports = router;
