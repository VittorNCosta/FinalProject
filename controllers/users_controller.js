const express = require("express");
const router = express.Router();

const {
  User,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserByNome,
  getUserByEmail
} = require("../models/users_model");

const { autenticacaoLogin, autenticacaoAdmin } = require("../middleware/auth");

// ==========================
// Função de validação
// ==========================
function validarCampos(obrigatorios, body) {
  let vazios = [];
  for (const campo of obrigatorios) {
    if (!body[campo] || body[campo].toString().trim() === "") vazios.push(campo);
  }
  if (vazios.length > 0)
    return { ok: false, mensagem: `Campos obrigatórios vazios: ${vazios.join(", ")}` };

  return { ok: true };
}

// ==========================
// Remover senha ao retornar JSON
// ==========================
function sanitizeUser(doc) {
  if (!doc) return null;
  const json = typeof doc.toJSON === "function" ? doc.toJSON() : doc;
  delete json.senha;
  return json;
}

// ==========================
// CRUD DE USUÁRIO (API)
// ==========================

// Listar todos
router.get("/users", async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users.map(sanitizeUser));
  } catch (err) {
    res.status(500).json({ error: "Erro ao listar usuários." });
  }
});

// Criar usuário
router.post("/users", async (req, res) => {
  try {
    const validacao = validarCampos(["nome", "email", "senha"], req.body);
    if (!validacao.ok) return res.status(400).json({ error: validacao.mensagem });

    const existe = await User.exists({
      $or: [{ email: req.body.email }, { nome: req.body.nome }]
    });

    if (existe) return res.status(409).json({ error: "Email ou nome já cadastrado." });

    const novo = await createUser(req.body);
    res.status(201).json(sanitizeUser(novo));
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar usuário." });
  }
});

// Buscar usuário por ID
router.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "Usuário não encontrado." });
    res.json(sanitizeUser(user));
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar usuário." });
  }
});

// Atualizar usuário
router.put("/users/:id", async (req, res) => {
  try {
    const validacao = validarCampos(["nome", "email", "senha"], req.body);
    if (!validacao.ok) return res.status(400).json({ error: validacao.mensagem });

    const atualizado = await updateUser(req.params.id, req.body);

    if (!atualizado)
      return res.status(404).json({ error: "Usuário não encontrado." });

    res.json(sanitizeUser(atualizado));
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar usuário." });
  }
});

// Deletar usuário
router.delete("/users/:id", async (req, res) => {
  try {
    const deletado = await deleteUser(req.params.id);
    if (!deletado) return res.status(404).json({ error: "Usuário não encontrado." });
    res.json({ message: "Usuário excluído com sucesso." });
  } catch (err) {
    res.status(500).json({ error: "Erro ao excluir usuário." });
  }
});

// ==========================
// LOGIN
// ==========================
router.post("/auth/login", async (req, res) => {
  try {
    const loginId =
      (req.body.username || req.body.nome || req.body.email)?.toString().trim();
    const password = (req.body.password || req.body.senha)?.toString();

    if (!loginId || !password) {
      return res.render("templates/login", {
        erro: "Usuário/email e senha são obrigatórios!"
      });
    }

    // Buscar por email ou nome
    const query = loginId.includes("@")
      ? { email: loginId.toLowerCase() }
      : { nome: loginId };

    const usuario = await User.findOne(query);

    if (!usuario) {
      return res.render("templates/login", {
        erro: "Usuário ou senha inválidos."
      });
    }

    const ok = await usuario.verificarSenha(password);
    if (!ok) {
      return res.render("templates/login", {
        erro: "Usuário ou senha inválidos."
      });
    }

    // Criar sessão
    req.session.userId = usuario._id.toString();
    req.session.username = usuario.nome;
    req.session.funcao = usuario.funcao;

    return res.redirect("/home");
  } catch (err) {
    console.error("Erro login:", err);
    res.render("templates/login", { erro: "Erro interno no servidor." });
  }
});

// ==========================
// REGISTRO
// ==========================
router.post("/auth/register", async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    const validacao = validarCampos(["nome", "email", "senha"], req.body);
    if (!validacao.ok)
      return res.render("templates/createaccount", { erro: validacao.mensagem });

    const existe = await User.exists({
      $or: [{ email: email.toLowerCase() }, { nome }]
    });

    if (existe)
      return res.render("templates/createaccount", {
        erro: "Email ou nome já cadastrado."
      });

    // Criar usuário com hash automático (feito no model)
    await createUser({
      nome,
      email: email.toLowerCase(),
      senha,
      funcao: "user"
    });

    return res.redirect("/login");
  } catch (err) {
    console.error("Erro /auth/register:", err);
    return res.render("templates/createaccount", {
      erro: "Erro ao registrar usuário."
    });
  }
});

// ==========================
// LOGOUT
// ==========================
router.get("/auth/logout", (req, res) => {
  req.session.destroy(err => {
    if (err)
      return res.status(500).json({ error: "Não foi possível fazer logout." });

    res.clearCookie("connect.sid");
    return res.redirect("/login");
  });
});

module.exports = router;