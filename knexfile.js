require('dotenv').config();
module.exports = {
  client: process.env.DB_CLIENT || 'pg',
  connection: process.env.DATABASE_URL || { filename: './paoemcasa.db' },
  useNullAsDefault: true,
  migrations: { directory: __dirname + '/server/migrations' }
};
