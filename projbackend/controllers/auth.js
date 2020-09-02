const User = require("../models/user")
const {validationResult} = require("express-validator")
const jwt_token = require("jsonwebtoken")
const expressJwt = require("express-jwt")
require("dotenv").config()

const signup = (req, res) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    })
  }

  const user = new User(req.body)
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: "NOT able to save user in DB",
      })
    }
    res.json({
      name: user.name,
      email: user.email,
      id: user._id,
    })
  })
}

const signin = async (req, res) => {
  const {email, password} = req.body

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({errors: errors.array()[0].msg})
  }

  await User.findOne({email}, (err, user) => {
    if (err || !user) {
      return res.json({err: "user doesn't exist"}).status(400)
    }

    if (!user.authenticate(password)) {
      return res.status(401).json({err: "email and password doesn't match"})
    }

    const token = jwt_token.sign({_id: user._id}, process.env.SECRET)

    res.cookie("token", token, {expire: new Date() + 9999})

    const {_id, name, email, role} = user

    return res.json({
      token,
      user: {
        _id,
        name,
        email,
        role,
      },
    })
  })
}

const signout = (req, res) => {
  res.clearCookie("token")
  res.json({
    msg: "user  SignOut succesfully",
  })
}

const isSignedIn = expressJwt({
  secret: process.env.SECRET,
  userProperty: "auth",
  algorithms: ["HS256"],
})

const isAuthenticated = (req, res, next) => {
  let checker = req.profile && req.auth && req.profile._id == req.auth._id

  if (!checker) {
    return res.status(403).json({
      msg: "ACCESS DENIED!!!",
    })
  }
  next()
}

const isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({msg: "YOU ARE NOT ADMIN, ACCESS DENIED!!!"})
  }
  next()
}

module.exports = {
  signout,
  signup,
  signin,
  isSignedIn,
  isAuthenticated,
  isAdmin,
}
