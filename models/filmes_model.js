/*import { getConnection } from "../config/db.js";

export async function getFilmes() {
  const conn = await getConnection();
  try {
    const result = await conn.execute(`
      SELECT ID, TITULO, DESCRICAO, GENERO, ANO_LANCAMENTO, DIRETOR, SINOPSE, POSTER_URL
      FROM FILMES
      ORDER BY TITULO
    `);
    return result.rows;
  } finally {
    await conn.close();
  }
}

export async function getFilmePorId(id) {
  const conn = await getConnection();
  try {
    const result = await conn.execute(
      `
      SELECT ID, TITULO, DESCRICAO, GENERO, ANO_LANCAMENTO, DIRETOR, SINOPSE, POSTER_URL
      FROM FILMES
      WHERE ID = :id
      `,
      { id }
    );
    return result.rows[0];
  } finally {
    await conn.close();
  }
}

export async function criarFilme({
  titulo,
  descricao,
  genero,
  ano_lancamento,
  diretor,
  sinopse,
  poster_url,
}) {
  const conn = await getConnection();
  try {
    await conn.execute(
      `
      INSERT INTO FILMES (TITULO, DESCRICAO, GENERO, ANO_LANCAMENTO, DIRETOR, SINOPSE, POSTER_URL)
      VALUES (:titulo, :descricao, :genero, :ano_lancamento, :diretor, :sinopse, :poster_url)
      `,
      { titulo, descricao, genero, ano_lancamento, diretor, sinopse, poster_url },
      { autoCommit: true }
    );
  } finally {
    await conn.close();
  }
}

export async function atualizarFilme(id, {
  titulo,
  descricao,
  genero,
  ano_lancamento,
  diretor,
  sinopse,
  poster_url,
}) {
  const conn = await getConnection();
  try {
    await conn.execute(
      `
      UPDATE FILMES
      SET TITULO = :titulo,
          DESCRICAO = :descricao,
          GENERO = :genero,
          ANO_LANCAMENTO = :ano_lancamento,
          DIRETOR = :diretor,
          SINOPSE = :sinopse,
          POSTER_URL = :poster_url
      WHERE ID = :id
      `,
      { id, titulo, descricao, genero, ano_lancamento, diretor, sinopse, poster_url },
      { autoCommit: true }
    );
  } finally {
    await conn.close();
  }
}

export async function deletarFilme(id) {
  const conn = await getConnection();
  try {
    await conn.execute(
      `DELETE FROM FILMES WHERE ID = :id`,
      { id },
      { autoCommit: true }
    );
  } finally {
    await conn.close();
  }
}
*/