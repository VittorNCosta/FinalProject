// users_model.js
const { getConnection } = require("../config"); // pegar função de conexão do seu config

/**
 * Retorna todos os usuários do banco Oracle
 * @param {Pool} pool - pool de conexões Oracle
 * @returns {Promise<Array>} - lista de usuários
 */
async function getAllUsers(pool) {
  let conn;
  try {
    conn = await getConnection(pool);
    const query = await conn.execute(
      `SELECT us_id, us_name, us_email FROM users`
    );

    // Mapear os resultados do Oracle para objetos JS
    return query.rows.map(row => ({
      us_id: row[0],
      us_name: row[1],
      us_email: row[2]
    }));
  } catch (err) {
    console.error("Erro no model getAllUsers:", err);
    throw err; // repassa para o controller tratar
  } finally {
    if (conn) await conn.close();
  }
}

module.exports = { getAllUsers };
