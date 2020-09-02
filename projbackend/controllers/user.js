const User = require("../models/user")
const Order = require("../models/order")

const getUserById = async (req, res, next, id) => {
  await User.findById(id)
    .select("-encry_password")
    .exec((err, user) => {
      if (!user || err) {
        return res.status(400).json({err: "user not found"})
      }

      req.profile = user
      next()
    })
}

const getUser = (req, res) => {
  return res.json(req.profile)
}

const updateUser = async (req, res) => {
  await User.findByIdAndUpdate(
    {_id: req.profile._id},
    {$set: req.body},
    {new: true, useFindAndModify: false}
  )
    .select("-encry_password")
    .exec((err, user) => {
      if (err) {
        return res
          .status(400)
          .json({err: "You are not authorized to update this user"})
      }
      return res.json(user)
    })
}

const userPurchaseList = async (req, res) => {
  await Order.find({user: req.profile._id})
    .populate("user", "_id name")
    .exec((err, order) => {
      if (err) {
        return res.status(400).json({
          err: "No Order In this Account",
        })
      }
      return res.json(order)
    })
}

const pushOrderInPurchaseList = async (req, res, next) => {
  let purchases = []
  req.body.order.products.forEach((product) => {
    purchases.push({
      _id: product._id,
      name: product.name,
      category: product.category,
      quantity: product.quantity,
      description: product.description,
      amount: product.amount,
      transaction_id: req.body.order.transaction_id,
    })
  })

  await User.findByIdAndUpdate(
    {_id: req.profile._id},
    {$push: {purchases: purchases}},
    {new: true}
  ).exec((err) => {
    if (err) {
      return res.status(400).json({err: "Unable to save purchases"})
    }
  })

  next()
}

module.exports = {
  getUserById,
  getUser,
  updateUser,
  userPurchaseList,
  pushOrderInPurchaseList,
}
