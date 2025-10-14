const express = require("express");
const path = require("path");
const multer = require("multer");
const { criarPool, getConnection, uploadsDir, serverConfig } = require("./config");

const app = express();
let pool; // Pool global

// ===== Configuração do EJS =====
app.set("views", path.join(process.cwd(), "views", "templates"));
app.set("view engine", "ejs");

// ===== Middlewares =====
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(process.cwd(), "public")));

// ===== Upload de arquivos =====
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage, limits: { fileSize: serverConfig.maxFileSize } });

// ===== Rotas =====
app.get("/", async (req, res) => {
  let conn;
  try {
    conn = await getConnection(pool);
    let result = [];
    if (conn) {
      const query = await conn.execute(`SELECT * FROM users`); 
      result = query.rows;
    }
    res.render("index", { data: result });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao carregar a página");
  } finally {
    if (conn) await conn.close(); // devolve a conexão ao pool
  }
});

app.post("/upload", upload.single("file"), (req, res) => {
  if (req.file) {
    res.send(`Arquivo ${req.file.filename} enviado com sucesso!`);
  } else {
    res.status(400).send("Nenhum arquivo enviado");
  }
});

// ===== Inicialização do servidor e pool =====
(async () => {
  pool = await criarPool();
  if (!pool) {
    console.error("Não foi possível iniciar o servidor sem o pool.");
    process.exit(1);
  }

  app.listen(serverConfig.port, () => {
    console.log(`Servidor rodando em http://localhost:${serverConfig.port}`);
  });
})();
