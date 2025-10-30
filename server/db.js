const knexLib = require('knex');
const dotenv = require('dotenv');
dotenv.config();
const DATABASE_URL = process.env.DATABASE_URL;
let knex;
if (DATABASE_URL) {
  knex = knexLib({ client: 'pg', connection: DATABASE_URL, pool: { min: 2, max: 10 } });
} else {
  knex = knexLib({ client: 'better-sqlite3', connection: { filename: './paoemcasa.db' }, useNullAsDefault: true });
}
module.exports = knex;
