const oracledb = require("oracledb");
const crypto = require("crypto");
const path = require("path");

const dbConfig = {
  user: "popflix",
  password: "vnc123",
  connectString: "10.154.51.12:1521/XEPDB1",
};

async function criarPool() {
  try {
    const pool = await oracledb.createPool({
      ...dbConfig,
      poolMin: 2,
      poolMax: 10,
      poolIncrement: 1,
    });
    console.log("✅ Pool de conexões criado com sucesso!");
    return pool;
  } catch (err) {
    console.error("❌ Erro ao criar pool de conexões:", err);
    return null;
  }
}

async function getConnection(pool) {
  try {
    if (!pool) throw new Error("Pool não foi inicializado!");
    const conn = await pool.getConnection();
    return conn;
  } catch (err) {
    console.error("❌ Erro ao obter conexão do pool:", err);
    return null;
  }
}

const sessionSecret = crypto.randomBytes(16).toString("hex");
const uploadsDir = path.join(process.cwd(), "uploads");

const serverConfig = {
  port: 8088,
  maxFileSize: 5 * 1024 * 1024,
};

module.exports = {
  dbConfig,
  criarPool,
  getConnection,
  sessionSecret,
  uploadsDir,
  serverConfig,
};
