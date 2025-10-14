const oracledb = require("oracledb");
const crypto = require("crypto");
const path = require("path");

const dbConfig = {
  user: "popflix",
  password: "vnc123",
  connectString: "localhost:1521/XEPDB1",
};

// Criação do pool
async function criarPool() {
  try {
    const pool = await oracledb.createPool({
      ...dbConfig,
      poolMin: 2,       // mínimo de conexões abertas
      poolMax: 10,      // máximo de conexões
      poolIncrement: 1, // incrementa quando necessário
    });
    console.log("Pool de conexões criado com sucesso!");
    return pool;
  } catch (err) {
    console.error("Erro ao criar pool de conexões:", err);
    return null;
  }
}

// Função para pegar conexão do pool
async function getConnection(pool) {
  try {
    const conn = await pool.getConnection();
    return conn;
  } catch (err) {
    console.error("Erro ao obter conexão do pool:", err);
    return null;
  }
}

// Chave secreta para sessão
const sessionSecret = crypto.randomBytes(16).toString("hex");

// Pasta de uploads
const uploadsDir = path.join(process.cwd(), "uploads");

// Configurações adicionais
const serverConfig = {
  port: 8088,
  maxFileSize: 5 * 1024 * 1024, // 5MB
};

module.exports = {
  dbConfig,
  criarPool,
  getConnection,
  sessionSecret,
  uploadsDir,
  serverConfig,
};
