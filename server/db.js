const knexLib = require('knex');
require('dotenv').config();
const config = {
  client: process.env.DB_CLIENT || (process.env.DATABASE_URL ? 'pg' : 'better-sqlite3'),
  connection: process.env.DATABASE_URL || { filename: './paoemcasa.db' },
  useNullAsDefault: true
};
module.exports = knexLib(config);
