const express = require("express")
const router = express.Router()
const {check} = require("express-validator")
const {signout, signup, signin, isSignedIn} = require("../controllers/auth")

router.post(
  "/signup",
  [
    check("name").isLength({min: 4}).withMessage("Please enter your name"),
    check("email").isEmail().withMessage("Please enter your email"),
    check("password")
      .isLength({min: 8})
      .withMessage("Password should be atleast 8 length"),
  ],
  signup
)

router.post(
  "/signin",
  [
    check("email").isEmail().withMessage("Please enter yout email"),
    check("password")
      .isLength({min: 8})
      .withMessage("Password field required "),
  ],
  signin
)

router.get("/signout", signout)

router.get("/testRoute", isSignedIn, (req, res) => {
  res.send("A protected route")
})

module.exports = router
