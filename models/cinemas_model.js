const mongoose = require("mongoose");

// Schema de cinemas
const CinemaSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  endereco: {
    type: String,
    required: true
  },
  foto: {
    type: String, 
    required: false  // pode ser opcional
  }
});

// Model
const Cinema = mongoose.model("Cinema", CinemaSchema);

// CRUD PADRÃO
async function getAllCinemas() {
  return await Cinema.find();
}

async function createCinema(data) {
  return await Cinema.create(data);
}

async function updateCinema(id, data) {
  return await Cinema.findByIdAndUpdate(id, data, { new: true });
}

async function deleteCinema(id) {
  return await Cinema.findByIdAndDelete(id);
}

module.exports = {
  getAllCinemas,
  createCinema,
  updateCinema,
  deleteCinema,
  Cinema
};
