import { getConnection } from "../config.js";

export async function getCinemas() {
  const conn = await getConnection();
  try {
    const result = await conn.execute(`
      SELECT ID, NOME, ENDERECO, FOTO_URL
      FROM CINEMAS
      ORDER BY NOME`);
    return result.rows;
  } finally {
    await conn.close();
  }
}

export async function getCinemaById(id) {
  const conn = await getConnection();
  try {
    const result = await conn.execute(
      `
      SELECT ID, NOME, ENDERECO, FOTO_URL
      FROM CINEMAS
      WHERE ID = :id`,
      [id]
    );
    return result.rows[0];
  } finally {
    await conn.close();
  }
}

export async function createCinema({ nome, endereco, foto_url }) {
  const conn = await getConnection();
  try {
    await conn.execute(
      `
      INSERT INTO CINEMAS (NOME, ENDERECO, FOTO_URL)
      VALUES (:nome, :endereco, :foto_url)`,
      { nome, endereco, foto_url },
      { autoCommit: true }
    );
  } finally {
    await conn.close();
  }
}

export async function updateCinema(id, { nome, endereco, foto_url }) {
  const conn = await getConnection();
  try {
    await conn.execute(
      `
      UPDATE CINEMAS
      SET NOME = :nome,
          ENDERECO = :endereco,
          FOTO_URL = :foto_url
      WHERE ID = :id`,
      { id, nome, endereco, foto_url },
      { autoCommit: true }
    );
  } finally {
    await conn.close();
  }
}

export async function deleteCinema(id) {
  const conn = await getConnection();
  try {
    await conn.execute(
      `
      DELETE FROM CINEMAS
      WHERE ID = :id`,
      [id],
      { autoCommit: true }
    );
  } finally {
    await conn.close();
  }
}
