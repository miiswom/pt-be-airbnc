const { fetchProperties } = require("./models")

exports.getProperties = (req, res) => {
  try {
    fetchProperties().then((properties) => {
      res.status(200).json({properties})
    })
  } catch(err) {
    console.log(err)
  }
}