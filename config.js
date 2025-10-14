import oracledb from "oracledb";
import crypto from "crypto";
import path from "path";


export const dbConfig = {
  user: "popflix",           
  password: "vnc123",       
  connectString: "localhost:1521/XEPDB1", 
};

// Função para criar conexão
export async function conexao() {
  try {
    const conn = await oracledb.getConnection(dbConfig);
    console.log(" Conexão com Oracle realizada com sucesso!");
    return conn;
  } catch (err) {
    console.error(" Erro ao conectar ao Oracle:", err);
    return null;
  }
}

// ===== Chave secreta para sessão =====
export const sessionSecret = crypto.randomBytes(16).toString("hex");

// ===== Pasta de uploads =====
export const uploadsDir = path.join(process.cwd(), "uploads"); // ./uploads

// ===== Configurações adicionais =====
export const serverConfig = {
  port: 3000,
  maxFileSize: 5 * 1024 * 1024, // 5MB
};
