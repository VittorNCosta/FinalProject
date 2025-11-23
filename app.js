const express = require("express");
const path = require("path");
const connectDB = require("./config");

const session = require("express-session");
const MongoStore = require("connect-mongo");

const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const cinemasRouter = require("./controllers/cinemas_controller");
const usersRouter = require("./controllers/users_controller");
const filmesRouter = require("./controllers/filmes_controller");

const app = express();

// =======================
// CONFIGURAÇÕES BÁSICAS
// =======================
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// BD
connectDB();

// Segurança
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],

        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "'unsafe-eval'",
          "https://cdnjs.cloudflare.com"
        ],

        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://cdnjs.cloudflare.com"
        ],

       "img-src": ["'self'", "data:", "blob:", "*"],

        fontSrc: [
          "'self'",
          "https://cdnjs.cloudflare.com",
          "data:",
        ]
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false
  })
);
app.use(rateLimit({ windowMs: 60 * 1000, max: 100 }));

// =======================
// SESSÃO
// =======================
const MONGO_URI = "mongodb+srv://luser:fffpnr@cluster0.7wjux.mongodb.net/Final-BAck";

app.use(session({
    secret: "PopFlix-Secret-123!",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: MONGO_URI,
        collectionName: "sessions",
        ttl: 60 * 60 * 24
    }),
    cookie: {
        secure: false,
        httpOnly: true,
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24
    },
    name: "connect.sid"
}));

// =======================
// MIDDLEWARE DE PROTEÇÃO
// =======================
function proteger(req, res, next) {
    if (req.session.userId) return next();
    return res.redirect("/login");
}

// =======================
// ENVIAR USUÁRIO PARA O EJS
// =======================
app.use((req, res, next) => {
    res.locals.currentUser = {
        id: req.session.userId || null,
        username: req.session.username || null,
        funcao: req.session.funcao || null
    };
    next();
});

// =======================
// ROTAS PÚBLICAS
// =======================
app.get("/", (req, res) => res.redirect("/login"));

app.get("/login", (req, res) => {
    if (req.session.userId) return res.redirect("/home");
    res.render("templates/login", { erro: null });
});

app.get("/createaccount", (req, res) => {
    res.render("templates/createaccount", { erro: null });
});

// =======================
// ROTAS INTERNAS
// SEM PASSAR CURRENTUSER
// =======================
app.get("/favoritos", proteger, (req, res) => {
    res.render("templates/favoritos", {
        currentUser: req.session.username,
        favoritos: [] // ← ADICIONE ISTO
    });
});

const { getAllCinemas } = require("./models/cinemas_model");

app.get("/lista-cinemas", proteger, async (req, res) => {
    try {
        const cinemas = await getAllCinemas();
        res.render("templates/cinema", { cinemas });
    } catch (error) {
        console.error(error);
        res.render("templates/cinema", { cinemas: [] });
    }
});

app.get("/config", proteger, (req, res) => {
    res.render("templates/config_sistema");
});

// =======================
// CONTROLLERS
// =======================
app.use("/", usersRouter);
app.use("/", filmesRouter);
app.use("/cinemas", cinemasRouter);

// =======================
// SERVIDOR
// =======================
const PORT = 8088;
app.listen(PORT, () =>
    console.log(`Servidor rodando em http://localhost:${PORT}`)
);