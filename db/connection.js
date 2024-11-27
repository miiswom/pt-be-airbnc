const { Pool } = require("pg");

const ENV = process.env.NODE_ENV || "development";
const path = `${__dirname}/../.env.${ENV}`;
const pool = new Pool()

require("dotenv").config({ path });

if (!process.env.PGDATABASE) {
  throw new Error("PGDATABASE not set");
};


module.exports = pool;