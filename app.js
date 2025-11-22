const express = require("express");
const path = require("path");
const connectDB = require("./config");

const cinemasRouters = require("./controllers/cinemas_controller");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

connectDB();

// Rotas da API
app.use("/cinemas", cinemasRouters);

// Página inicial → abre cinema.ejs diretamente
app.get("/", (req, res) => {
  res.render("templates/config_sistema");
});

// Página cinema (rota direta)
app.get("/config", (req, res) => {
  res.render("templates/config_sistema");
});

const PORT = 8088;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
