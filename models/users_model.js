const db = require("../config"); // importa conexão

async function getAllUsers() {
  try {
    const collection = db.collection("users");
    const users = await collection.find({}).toArray();
    return users;
  } catch (err) {
    console.error("Erro ao buscar usuários:", err);
    throw err;
  }
}

module.exports = { getAllUsers };