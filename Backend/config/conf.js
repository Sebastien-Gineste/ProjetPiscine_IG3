const Pool = require('pg').Pool
/*
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: 5432,
})
*/

const connectionString = process.env.DATABASE_URL
const pool = new Pool({
  connectionString
})

pool.connect()
  .then(() => console.log('connected to PostgresSQL'))
  .catch(err => console.error('connection error', err.stack))

module.exports = pool
