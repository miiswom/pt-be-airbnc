const app = require("./app");

const { PORT = 9099 } = process.env;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`)
})

module.exports = PORT;