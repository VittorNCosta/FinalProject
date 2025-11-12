const { getConnection } = require("../config"); // função de conexão

/**
 * Retorna todos os usuários do banco Oracle
 * @param {Pool} pool - pool de conexões Oracle
 * @returns {Promise<Array>}
 */
async function getAllCinemas(pool) {
  let conn;
  try {
    conn = await getConnection(pool); // ✅ usa o helper corretamente
    const query = await conn.execute(
      `SELECT id, name, address FROM cinemas`
    );

    // Mapear os resultados do Oracle para objetos JS
    return query.rows.map(row => ({
      id: row[0],
      name: row[1],
      address: row[2],
    }));
  } catch (err) {
    console.error("Erro no model getAllCinemas:", err);
    throw err;
  } finally {
    if (conn) await conn.close();
  }
}

/**
 * Busca cinema por ID
 */
async function getCinemaById(pool, id) {
  let conn;
  try {
    conn = await getConnection(pool);
    const result = await conn.execute(
      `SELECT id, name, address FROM cinemas WHERE id = :id`,
      [id]
    );
    if (result.rows.length === 0) return null;
    const [cid, name, address] = result.rows[0];
    return { id: cid, name, address };
  } finally {
    if (conn) await conn.close();
  }
}

/**
 * Cria um novo cinema
 */
async function createCinema(pool, { name, address }) {
  let conn;
  try {
    conn = await getConnection(pool);
    await conn.execute(
      `INSERT INTO cinemas (id, name, address) VALUES (cinemas_seq.NEXTVAL, :name, :address)`,
      [name, address],
      { autoCommit: true }
    );
  } finally {
    if (conn) await conn.close();
  }
}

/**
 * Atualiza um cinema existente
 */
async function updateCinema(pool, id, { name, address }) {
  let conn;
  try {
    conn = await getConnection(pool);
    await conn.execute(
      `UPDATE cinemas SET name = :name, address = :address WHERE id = :id`,
      [name, address, id],
      { autoCommit: true }
    );
  } finally {
    if (conn) await conn.close();
  }
}

/**
 * Deleta um cinema pelo ID
 */
async function deleteCinema(pool, id) {
  let conn;
  try {
    conn = await getConnection(pool);
    await conn.execute(`DELETE FROM cinemas WHERE id = :id`, [id], { autoCommit: true });
  } finally {
    if (conn) await conn.close();
  }
}

module.exports = {
  getAllCinemas,
  getCinemaById,
  createCinema,
  updateCinema,
  deleteCinema,
};