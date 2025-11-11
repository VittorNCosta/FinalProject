// src/controllers/cinemasController.js
/*
import {
  getCinemas,
  getCinemaById,
  createCinema,
  updateCinema,
  deleteCinema
} from "../models/cinemas_model.js";

export async function listarCinemas(req, res) {
  try {
    const cinemas = await getCinemas();
    res.status(200).json(cinemas);
  } catch (error) {
    console.error("Erro ao listar cinemas:", error);
    res.status(500).json({ message: "Erro ao buscar cinemas." });
  }
}

export async function obterCinema(req, res) {
  try {
    const { id } = req.params;
    const cinema = await getCinemaById(id);

    if (!cinema) {
      return res.status(404).json({ message: "Cinema não encontrado." });
    }

    res.status(200).json(cinema);
  } catch (error) {
    console.error("Erro ao obter cinema:", error);
    res.status(500).json({ message: "Erro ao buscar cinema." });
  }
}

export async function criarCinema(req, res) {
  try {
    const { nome, endereco, foto_url } = req.body;

    if (!nome || !endereco || !foto_url) {
      return res.status(400).json({ message: "Todos os campos são obrigatórios." });
    }

    await createCinema({ nome, endereco, foto_url });
    res.status(201).json({ message: "Cinema criado com sucesso." });
  } catch (error) {
    console.error("Erro ao criar cinema:", error);
    res.status(500).json({ message: "Erro ao criar cinema." });
  }
}

export async function editarCinema(req, res) {
  try {
    const { id } = req.params;
    const { nome, endereco, foto_url } = req.body;

    await updateCinema(id, { nome, endereco, foto_url });
    res.status(200).json({ message: "Cinema atualizado com sucesso." });
  } catch (error) {
    console.error("Erro ao editar cinema:", error);
    res.status(500).json({ message: "Erro ao atualizar cinema." });
  }
}

export async function excluirCinema(req, res) {
  try {
    const { id } = req.params;
    await deleteCinema(id);
    res.status(200).json({ message: "Cinema excluído com sucesso." });
  } catch (error) {
    console.error("Erro ao excluir cinema:", error);
    res.status(500).json({ message: "Erro ao excluir cinema." });
  }
}
*/