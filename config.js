const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect(
      "mongodb+srv://luser:fffpnr@cluster0.7wjux.mongodb.net/Final-BAck?retryWrites=true&w=majority&appName=Cluster0",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("🔥 MongoDB conectado com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao conectar ao MongoDB:", error);
    process.exit(1);
  }
}

module.exports = connectDB;
