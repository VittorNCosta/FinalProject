const express = require("express");
const path = require("path");
const connectDB = require("./config");

const filmesRouter = require("./routes/filmes");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

connectDB();

// Usar as rotas de filmes
app.use("/", filmesRouter);

const PORT = 8088;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});