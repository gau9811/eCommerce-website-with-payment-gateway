const exress = require("express")
const router = exress.Router()

const {
  getUserById,
  getUser,
  updateUser,
  userPurchaseList,
} = require("../controllers/user")
const {isAuthenticated, isSignedIn, isAdmin} = require("../controllers/auth")

router.param("userId", getUserById)

router.get("/user/:userId", isSignedIn, isAuthenticated, getUser)

router.put("/user/update/:userId", isSignedIn, isAuthenticated, updateUser)
router.get(
  "/orders/user/:userId",
  isSignedIn,
  isAuthenticated,
  userPurchaseList
)

module.exports = router
