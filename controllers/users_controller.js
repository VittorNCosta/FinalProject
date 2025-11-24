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

const crypto = require("crypto");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

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

// ==========================
// ESQUECI MINHA SENHA
// ==========================

// Página de formulário
router.get("/esqueci-senha", (req, res) => {
  res.render("templates/esqueci_senha", { erro: null, sucesso: null });
});

// Enviar link
router.post("/esqueci-senha", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.render("templates/esqueci_senha", {
        erro: "E-mail não encontrado.",
        sucesso: null
      });
    }

    const token = crypto.randomBytes(32).toString("hex");

    user.resetToken = token;
    user.resetTokenExpira = Date.now() + 3600000; // 1 hora
    await user.save();

    const link = `http://localhost:8088/resetar-senha/${token}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "livramentolucas182@gmail.com",
        pass: "smdqbyclojomxruq"
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    transporter.verify((error, success) => {
      if (error) {
        console.log("Erro SMTP:", error);
      } else {
        console.log("SMTP funcionando! Pronto para enviar.");
      }
    });

    await transporter.sendMail({
      from: "PopFlix <no-reply@popflix.com>",
      to: email,
      subject: "Redefinição de Senha - PopFlix",
      html: `
        <h3>Redefinir sua senha</h3>
        <p>Clique no link abaixo:</p>
        <a href="${link}">${link}</a>
        <p>Validade: 1 hora</p>
      `
    });

    res.render("templates/esqueci_senha", {
      erro: null,
      sucesso: "Um link foi enviado para seu e-mail!"
    });

  } catch (err) {
    console.log(err);
    res.render("templates/esqueci_senha", {
      erro: "Erro ao enviar e-mail.",
      sucesso: null
    });
  }
});

// ==========================
// NOVA SENHA (GET)
// ==========================
router.get("/resetar-senha/:token", async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpira: { $gt: Date.now() }
    });

    if (!user) {
      return res.send("Link inválido ou expirado.");
    }

    res.render("templates/nova_senha", {
      token,
      erro: null,
      sucesso: null
    });

  } catch (err) {
    console.log(err);
    res.send("Erro ao carregar página.");
  }
});

// ==========================
// SALVAR NOVA SENHA (POST)
// ==========================
router.post("/resetar-senha/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.render("templates/nova_senha", {
        token,
        erro: "As senhas não coincidem!",
        sucesso: null
      });
    }

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpira: { $gt: Date.now() }
    });

    if (!user) {
      return res.send("Token inválido ou expirado.");
    }

    const hash = await bcrypt.hash(password, 10);

    user.senha = hash;
    user.resetToken = undefined;
    user.resetTokenExpira = undefined;

    await user.save();

    return res.render("templates/nova_senha", {
      token,
      erro: null,
      sucesso: "Senha redefinida! Faça login."
    });

  } catch (err) {
    console.log(err);
    res.send("Erro ao salvar nova senha.");
  }
});

module.exports = router;