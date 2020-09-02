const mongoose = require("mongoose")
require("dotenv").config()
// const User = require("../models/user")

let connectDB = async () => {
  let connect = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  try {
    if (!connect) {
      console.log("mongodb not  connected")

      proccess.exit(1)
    }
    console.log("mongodb connected....")
  } catch (err) {
    console.log(err)
  }
}

module.exports = connectDB
