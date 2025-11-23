const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const FATOR_HASH = 10;

// Detecta se o valor já é um hash bcrypt
const isBcryptHash = (str) => typeof str === "string" && /^\$2[abzy]\$/.test(str);

// ===== SCHEMA =====
// Mantém seus campos originais (nome, email, idade, senha)
// + campos/funções adicionais (funcao, timestamps)
const UserSchema = new mongoose.Schema(
  {
    nome: String,
    email: String,
    idade: Number,
    senha: String, // armazenará o hash (os hooks cuidam disso)
    funcao: { type: String, enum: ["user", "admin"], default: "user" }, // autorização
  },
  {
    timestamps: { createdAt: "criacao", updatedAt: "atualizacao" }, // + datas
    versionKey: false,
  }
);

// ===== MÉTODOS DE INSTÂNCIA =====
// Para login: compara a senha em texto com o hash armazenado em "senha"
UserSchema.methods.verificarSenha = async function (senhaPlano) {
  if (!this.senha) return false;
  return bcrypt.compare(senhaPlano, this.senha);
};

// ===== MÉTODOS ESTÁTICOS/UTILITÁRIOS =====
// (Opcionalmente úteis para login/cadastro)
UserSchema.statics.getByNome = function (nome) {
  return this.findOne({ nome });
};
UserSchema.statics.getByEmail = function (email) {
  return this.findOne({ email });
};
UserSchema.statics.existePorEmailOuNome = function (email, nome) {
  return this.exists({ $or: [{ email }, { nome }] });
};

// ===== HOOKS PARA HASH =====
// Hash automático quando criar/alterar "senha", sem mudar chamadas existentes:

// 1) save (create)
UserSchema.pre("save", async function (next) {
  try {
    if (this.isModified("senha") && this.senha && !isBcryptHash(this.senha)) {
      this.senha = await bcrypt.hash(this.senha, FATOR_HASH);
    }
    next();
  } catch (err) {
    next(err);
  }
});

// 2) findOneAndUpdate (update)
// Suporta atualização em "senha" tanto direta quanto via $set.senha
UserSchema.pre("findOneAndUpdate", async function (next) {
  try {
    const update = this.getUpdate() || {};
    const senhaDireta = update.senha;
    const senhaSet = update.$set?.senha;
    const novaSenha = senhaDireta ?? senhaSet;

    if (novaSenha && !isBcryptHash(novaSenha)) {
      const hashed = await bcrypt.hash(novaSenha, FATOR_HASH);
      if (update.$set) {
        update.$set.senha = hashed;
      } else {
        update.senha = hashed;
      }
      this.setUpdate(update);
    }

    next();
  } catch (err) {
    next(err);
  }
});

const User = mongoose.model("User", UserSchema);

// ===== CRUD PADRÃO (mantidos exatamente como estavam) =====
async function getAllUsers() {
  return await User.find();
}

async function createUser(data) {
  // Pode receber data.senha em texto; o hook de "save" fará o hash automaticamente
  return await User.create(data);
}

async function updateUser(id, data) {
  // Pode receber data.senha em texto; o hook de "findOneAndUpdate" fará o hash
  return await User.findByIdAndUpdate(id, data, { new: true });
}

async function deleteUser(id) {
  return await User.findByIdAndDelete(id);
}

// ===== NOVAS FUNÇÕES (adicionadas sem remover as anteriores) =====
async function getUserByNome(nome) {
  return await User.findOne({ nome });
}

async function getUserByEmail(email) {
  return await User.findOne({ email });
}

module.exports = {
  // Mantidos
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  User,

  // Novos utilitários
  getUserByNome,
  getUserByEmail,}