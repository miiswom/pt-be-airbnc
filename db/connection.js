
const { Pool } = require("pg");

//console.log(process.env)
const ENV = process.env.NODE_ENV || "development"

require("dotenv").config({path: `${__dirname}/../.env.${ENV}`})

const config = {}

if(ENV === "development") {
  config.connectionString = process.env.DATABASE_URL;
  config.max = 2;
}
// console.log(process.env)

// load file into env variables
// set PGDATABASE key in process.env
const pool = new Pool(config)


module.exports = pool;