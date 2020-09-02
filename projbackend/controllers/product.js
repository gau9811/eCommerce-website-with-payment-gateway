const Product = require("../models/product")
const formidable = require("formidable")
const _ = require("lodash")
const fs = require("fs")

const getProductById = async (req, res, next, id) => {
  await Product.findById(id)
    .populate("category")
    .exec((err, product) => {
      if (err) {
        return res.status(400).json({err: "Product not Found"})
      }
      req.product = product
      next()
    })
}

const createProduct = (req, res) => {
  let form = new formidable.IncomingForm()
  form.keepExtensions = true

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        err: "problem with image",
      })
    }

    const {name, description, price, category, stock} = fields

    if (!name && !description && !price && !category && !stock) {
      return res.status(400).json({
        err: "Please include all fields",
      })
    }

    let product = new Product(fields)

    if (files.photo) {
      if (files.photo.size > 3000000) {
        return res.status(400).json({err: "File size cannot be large than 3mb"})
      }
      product.photo.data = fs.readFileSync(files.photo.path)
      product.photo.contentType = files.photo.type
    }
    product.save((err, product) => {
      if (err) {
        return res.status(400).json({
          err: "saving product fail",
        })
      }
      res.json({success: product})
    })
  })
}

const getProduct = (req, res) => {
  req.product.photo = undefined
  return res.json(req.product)
}

const photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set("Content-Type", req.product.photo.contentType)
    return res.send(req.product.photo.data)
  }
  next()
}

const deleteProduct = async (req, res) => {
  let product = await req.product
  product.remove((err, deletedProduct) => {
    if (err) {
      return res.status(400).json({err: "Failed to delete product"})
    }
    res.json({
      msg: "Deletion succesfully",
    })
  })
}

const updateProduct = (req, res) => {
  let form = new formidable.IncomingForm()
  form.keepExtensions = true

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        err: "problem with image",
      })
    }
    const {name, description, price, category, stock} = fields

    console.log(name, description, price, category, stock)

    let product = await req.product
    product = _.extend(product, fields)

    if (files.photo) {
      if (files.photo.size > 3000000) {
        return res.status(400).json({err: "File size cannot be large than 3mb"})
      }
      product.photo.data = fs.readFileSync(files.photo.path)
      product.photo.contentType = files.photo.type
    }
    product.save((err, product) => {
      if (err) {
        return res.status(400).json({
          err: "updation of product fails",
        })
      }
      res.json({success: product})
    })
  })
}

const getAllProducts = async (req, res) => {
  let limit = req.query.limit ? pasrseInt(req.query.limit) : 8
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id"
  await Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy, "asc"]])
    .limit(limit)
    .exec((err, product) => {
      if (err) {
        return res.status(400).json({err: "No products FOUND"})
      }
      res.json(product)
    })
}

const updateStock = async (req, res, next) => {
  let myOperation = req.body.order.products.map((prod) => {
    return {
      updateOne: {
        filter: {_id: prod._id},
        update: {$inc: {stock: -prod.count, sold: +prod.count}},
      },
    }
  })

  await Product.bulkWrite(myOperation, (err, product) => {
    if (err) {
      return res.status(400).json({
        err: "Bulk operation failed",
      })
    }
    next()
  })
}

const getAlluniqueCategories = async (req, res) => {
  await Product.distinct("category", (err, product) => {
    if (err) {
      return res.status(400).json({
        err: "failed to get Categories",
      })
    }
    res.json(product)
  })
}

module.exports = {
  getProductById,
  createProduct,
  getProduct,
  photo,
  deleteProduct,
  updateProduct,
  getAllProducts,
  updateStock,
  getAlluniqueCategories,
}
