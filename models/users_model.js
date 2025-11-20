const db = require("../config"); // importa conexão

async function createUser(data) {
  try {
    const collection = db.collection("users");
    const result = await collection.insertOne(data);
    return result;
  } catch (err) {
    console.error("Erro ao criar usuário:", err);
    throw err;
  }
}


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


async function updateUser(id, data) {
  try {
    const collection = db.collection("users");

    const result = await collection.updateOne(
      { _id: new require("mongodb").ObjectId(id) },
      { $set: data }
    );

    return result;
  } catch (err) {
    console.error("Erro ao atualizar usuário:", err);
    throw err;
  }
}

async function deleteUser(id) {
  try {
    const collection = db.collection("users");

    const result = await collection.deleteOne({
      _id: new ObjectId(id)
    });

    return result;
  } catch (err) {
    console.error("Erro ao deletar usuário:", err);
    throw err;
  }
}

module.exports = { getAllUsers, updateUser, createUser, deleteUser };