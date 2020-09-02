const express = require("express")
const router = express.Router()

const {isAdmin, isAuthenticated, isSignedIn} = require("../controllers/auth")
const {getUserById} = require("../controllers/user")
const {
  getProductById,
  createProduct,
  getProduct,
  photo,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getAlluniqueCategories,
} = require("../controllers/product")

router.param("userId", getUserById)
router.param("productId", getProductById)

router.post(
  "/product/create/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  createProduct
)

//delete
router.delete(
  "/product/:productId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  deleteProduct
)

router.put(
  "/product/:productId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateProduct
)

//read
router.get("/product/:productId", getProduct)
router.get("/product/photo/:productId", photo)

router.get("/products", getAllProducts)

router.get("/products/category", getAlluniqueCategories)

module.exports = router
