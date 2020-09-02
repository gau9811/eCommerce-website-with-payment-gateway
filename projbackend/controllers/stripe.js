const Stripe = require("stripe")(
  "sk_test_51FLopOD6vsN6xEGIKZ4KOiUaLheA1GTblh28jynBUyw3R8zol6tVVXxEa2T4FgBOwX1EBjMOpwNx1Yo3iqg7lTh700dooFudda"
)
const uuid = require("uuid")

const makePayment = (req, res) => {
  const {products, token} = req.body
  console.log("PRODUCT", products)
  let amount = 0
  products.map((p) => {
    amount = p.price + amount
  })

  const idempotencyKey = uuid.v4()

  return Stripe.customers
    .create({
      email: token.email,
      source: token.id,
    })
    .then((customer) => {
      Stripe.charges
        .create(
          {
            amount: amount * 100,
            currency: "usd",
            customer: customer.id,
            reciept_email: token.email,
            shipping: {
              name: token.card.name,
              address: {
                line1: token.card.Stripeaddress,
                line2: token.card.address,
                city: token.card.address_city,
                country: token.card.address_country,
                postal_code: token.card.address_zip,
              },
            },
          },
          {idempotencyKey}
        )
        .then((result) => res.status(200).json(result))
        .catch((err) => console.log(err))
    })
}

module.exports = {makePayment}
