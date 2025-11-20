// src/controllers/filmesController.js
/*
import * as FilmeModel from "../models/filmeModel.js";

export async function listarFilmes(req, res) {
  try {
    const filmes = await FilmeModel.getFilmes();

    res.json(filmes);
  } catch (err) {
    console.error("Erro ao listar filmes:", err);
    res.status(500).json({ error: "Erro interno ao listar filmes." });
  }
}

export async function detalhesFilme(req, res) {
  try {
    const { id } = req.params;
    const filme = await FilmeModel.getFilmePorId(id);

    if (!filme) {
      return res.status(404).json({ error: "Filme não encontrado." });
    }

    res.json(filme);
  } catch (err) {
    console.error("Erro ao buscar filme:", err);
    res.status(500).json({ error: "Erro interno ao buscar filme." });
  }
}

export async function criarFilme(req, res) {
  try {
    const {
      titulo,
      descricao,
      genero,
      ano_lancamento,
      diretor,
      sinopse,
      poster_url,
    } = req.body;

    if (!titulo || !genero || !ano_lancamento) {
      return res.status(400).json({ error: "Título, gênero e ano são obrigatórios." });
    }

    await FilmeModel.criarFilme({
      titulo,
      descricao,
      genero,
      ano_lancamento,
      diretor,
      sinopse,
      poster_url,
    });

    res.status(201).json({ message: "Filme criado com sucesso!" });
  } catch (err) {
    console.error("Erro ao criar filme:", err);
    res.status(500).json({ error: "Erro interno ao criar filme." });
  }
}

export async function editarFilme(req, res) {
  try {
    const { id } = req.params;
    const {
      titulo,
      descricao,
      genero,
      ano_lancamento,
      diretor,
      sinopse,
      poster_url,
    } = req.body;

    await FilmeModel.atualizarFilme(id, {
      titulo,
      descricao,
      genero,
      ano_lancamento,
      diretor,
      sinopse,
      poster_url,
    });

    res.json({ message: "Filme atualizado com sucesso!" });
  } catch (err) {
    console.error("Erro ao editar filme:", err);
    res.status(500).json({ error: "Erro interno ao editar filme." });
  }
}

export async function excluirFilme(req, res) {
  try {
    const { id } = req.params;
    await FilmeModel.deletarFilme(id);
    res.json({ message: "Filme excluído com sucesso!" });
  } catch (err) {
    console.error("Erro ao excluir filme:", err);
    res.status(500).json({ error: "Erro interno ao excluir filme." });
  }
}

*/