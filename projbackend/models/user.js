const mongoose = require("mongoose")
const Schema = mongoose.Schema
const bcrypt = require("bcryptjs")
const salt = bcrypt.genSaltSync(10)

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    maxlength: 32,
    trim: true,
  },

  lastname: {
    type: String,
    required: true,
    maxlength: 32,
    trim: true,
  },

  encry_password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  userInfo: {
    type: String,
    trim: true,
  },
  role: {
    type: Number,
    default: 0,
  },
  purchases: {
    type: Array,
    defaul: [],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
})
UserSchema.virtual("password")
  .set(function (password) {
    this._password = password
    this.encry_password = this.securepassword(password)
  })
  .get(function () {
    this._password
  })

UserSchema.methods = {
  authenticate: function (plainpassword) {
    return bcrypt.compareSync(plainpassword, this.encry_password)
  },

  securepassword: function (plainpassword) {
    if (!plainpassword) return ""

    try {
      return bcrypt.hashSync(plainpassword, salt)
    } catch (err) {
      return ""
    }
  },
}

let User = mongoose.model("User", UserSchema)

module.exports = User
