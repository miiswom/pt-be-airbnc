
const { Pool } = require("pg");

//console.log(process.env)

require("dotenv").config({path: `${__dirname}/../.env.test`})

// console.log(process.env)

// load file into env variables
// set PGDATABASE key in process.env
const pool = new Pool()


module.exports = pool;