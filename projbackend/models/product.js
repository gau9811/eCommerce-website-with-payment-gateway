const mongoose = require("mongoose")
const {Context} = require("express-validator/src/context")
const product = require("../controllers/product")
const Schema = mongoose.Schema
const {ObjectId} = mongoose.Schema
const ProductSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
    },
    description: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
    },
    price: {
      type: Number,
      required: true,
      maxlength: 32,
      trim: true,
    },

    stock: {
      type: Number,
    },

    sold: {
      type: Number,
      default: 0,
    },

    photo: {
      data: Buffer,
      ContentType: String,
    },

    category: {
      type: ObjectId,
      ref: "Category",
      required: true,
    },
  },
  {timestamp: true}
)

module.exports = Product = mongoose.model("Product", ProductSchema)
