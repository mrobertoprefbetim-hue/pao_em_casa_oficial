const knexLib = require('knex');
const config = require('../knexfile');
const knex = knexLib(config);
(async ()=>{
  console.log('Running migration file directly...');
  const mig = require('./migrations/001_initial_migration');
  await mig.up(knex);
  console.log('Done');
  process.exit(0);
})().catch(e=>{ console.error(e); process.exit(1); });
