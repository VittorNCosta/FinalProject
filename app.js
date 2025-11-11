const express = require("express");
const { criarPool, serverConfig } = require("./config");
const usersController = require("./controllers/users_controller");

const app = express();
app.set("view engine", "ejs");

(async () => {
  const pool = await criarPool(); // cria e aguarda o pool
  console.log("✅ Pool de conexões criado com sucesso!");

  // Passa o pool para o controller (note os parênteses)
  app.use("/", usersController);

  app.listen(serverConfig.port, () => {
    console.log(`Servidor rodando em http://localhost:${serverConfig.port}`);
  });
})();
