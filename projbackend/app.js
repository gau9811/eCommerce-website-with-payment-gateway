const connectDB = require("./config/db")
const express = require("express")
const app = express()
const cookieParser = require("cookie-parser")
const cors = require("cors")
const PORT = process.env.PORT || 5000

app.use(express.json({extended: false}))
app.use(cookieParser())
app.use(cors())

//routes
app.use("/api", require("./routes/auth"))
app.use("/api", require("./routes/user"))
app.use("/api", require("./routes/category"))
app.use("/api", require("./routes/product.js"))
app.use("/api", require("./routes/order.js"))
app.use("/api", require("./routes/stripepayment.js"))

// connecting the database
connectDB()

app.listen(PORT, () => console.log(`server is running at ${PORT}`))
