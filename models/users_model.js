const mongoose = require("mongoose");

// ===== SCHEMA =====
const UserSchema = new mongoose.Schema({
  nome: String,
  email: String,
  idade: Number,
  senha: String,
});

const User = mongoose.model("User", UserSchema);



// CRUD PADRÃO

async function getAllUsers() {
  return await User.find();
}

async function createUser(data) {
  return await User.create(data);
}

async function updateUser(id, data) {
  return await User.findByIdAndUpdate(id, data, { new: true });
}

async function deleteUser(id) {
  return await User.findByIdAndDelete(id);
}

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  User
};
