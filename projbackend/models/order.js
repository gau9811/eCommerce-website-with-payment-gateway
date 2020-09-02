const mongoose = require("mongoose")
const Schema = mongoose.Schema
const {ObjectId} = mongoose.Schema

const productCartSchme = new Schema({
  product: {
    type: ObjectId,
    ref: "Product",
  },
  name: String,
  count: Number,
  price: Number,
  DeliverOn: Date,
})

const orderschema = new Schema(
  {
    products: [productCartSchme],
    transaction_id: {},
    amount: {type: Number},
    address: String,
    status: {
      type: String,
      default: "Recieved",
      enum: ["Cancelled", "delivered", "Shipped", "Proccessing", "Recieved"],
    },
    updated: Date,
    user: {
      type: ObjectId,
      ref: "User",
    },
  },
  {timestamps: true}
)

const Order = mongoose.model("Order", orderschema)
const ProductCart = mongoose.model("ProductCar", productCartSchme)

mongoose.exports = {Order, ProductCart}
