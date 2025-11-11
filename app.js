const express = require("express");
const { criarPool, serverConfig } = require("./config");
const usersController = require("./controllers/users_controller");

const app = express();
app.set("view engine", "ejs");

<<<<<<< HEAD
=======

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(process.cwd(), "public")));


const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage, limits: { fileSize: serverConfig.maxFileSize } });


app.get("/", async (req, res) => {
  let conn;
  try {
    conn = await getConnection(pool);
    let result = [];
    if (conn) {
      const query = await conn.execute(`SELECT us_id, us_name, us_email FROM users`); 
      result = query.rows.map(row => ({
        us_id: row[0],
        us_name: row[1], 
        us_email: row[2]
      }));
    }
    res.render("home", { data: result });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao carregar a página");
  } finally {
    if (conn) await conn.close(); 
  }
});

app.post("/upload", upload.single("file"), (req, res) => {
  if (req.file) {
    res.send(`Arquivo ${req.file.filename} enviado com sucesso!`);
  } else {
    res.status(400).send("Nenhum arquivo enviado");
  }
});

>>>>>>> ce6046c15241a71274e8aadf09dd4271b5ef0db4
(async () => {
  const pool = await criarPool(); // cria e aguarda o pool
  console.log("✅ Pool de conexões criado com sucesso!");

  // Passa o pool para o controller (note os parênteses)
  app.use("/", usersController);

  app.listen(serverConfig.port, () => {
    console.log(`Servidor rodando em http://localhost:${serverConfig.port}`);
  });
})();
