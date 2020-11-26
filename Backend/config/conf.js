const Pool = require('pg').Pool

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: 5432,
})

pool.connect()
  .then(() => console.log('connected to PostgresSQL'))
  .catch(err => console.error('connection error', err.stack))

module.exports = pool

/*
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack)
  }
  console.log("Base de données connectée")
  client.query('SELECT NOW()', (err, result) => {
    release()
    if (err) {
      return console.error('Error executing query', err.stack)
    }
    console.log(result.rows)
  })
})*/