const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

module.exports = {
  connect: async () => {
    try {
      await pool.connect();
      return true;
    } catch (error) {
      console.error('Failed to connect to the database:', error);
      throw error;
    }
  },
  query: (text, params) => pool.query(text, params),
};
