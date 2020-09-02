const exress = require("express")
const router = exress.Router()
const {makePayment} = require("../controllers/stripe")

router.post("/stripePayment", makePayment)

module.exports = router
