const express = require("express");
const connectDB = require("./config"); 
const usersRouter = require("./routes/users");

// ================================
// CRIA O SERVIDOR
// ================================
const app = express();

// Configura EJS
app.set("view engine", "ejs");

// Middlewares para leitura de JSON 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Conecta ao MongoDB
connectDB();

// Rotas
app.use(usersRouter);

// Rota inicial para teste
app.get("/", (req, res) => {
  res.render("templates/home");
});

// Inicia servidor
const PORT = 8088;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});