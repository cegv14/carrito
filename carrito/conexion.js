const { Pool } = require('pg');

const connectionData = {
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'local',
  port: '5432',
}
const sql = new Pool(connectionData)
  
module.exports = sql;