const express = require("express");
const { criarPool } = require("../config");
const UsersModel = require("../models/cinemas_model");

const router = express.Router();
let pool;

// Inicializa o pool uma única vez, quando o módulo é carregado
(async () => {
  pool = await criarPool();
})();

router.get("/", async (req, res) => {
  try {
    const users = await CinemasModel.getAllCinemas(pool);
    res.render("templates/home", { data: users });
  } catch (err) {
    console.error("Erro ao carregar cinemas:", err);
    res.status(500).send("Erro ao carregar a página");
  }
});


module.exports = router;