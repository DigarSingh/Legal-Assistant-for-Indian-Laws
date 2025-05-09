const db = require('../config/database');

class Query {
  static async create(userId, queryText, topic, language) {
    const query = {
      text: 'INSERT INTO queries(user_id, query_text, topic, language, created_at) VALUES($1, $2, $3, $4, NOW()) RETURNING *',
      values: [userId, queryText, topic, language],
    };
    
    const result = await db.query(query);
    return result.rows[0];
  }

  static async getById(queryId) {
    const query = {
      text: 'SELECT * FROM queries WHERE id = $1',
      values: [queryId],
    };
    
    const result = await db.query(query);
    return result.rows[0];
  }

  static async getUserQueries(userId, limit = 10, offset = 0) {
    const query = {
      text: 'SELECT * FROM queries WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
      values: [userId, limit, offset],
    };
    
    const result = await db.query(query);
    return result.rows;
  }
}

module.exports = Query;
