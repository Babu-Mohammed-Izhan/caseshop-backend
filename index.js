var cors = require("cors");
const express = require("express");
const app = express();
app.use(cors());
app.use(express.json());
const Phonecase = require("./models/phonecases");

const stripe = require("stripe")(
  "sk_test_51JHMrwSHAZAO2kf44c5ZXpFnhbZjODG9Dasi2bc5Wi69XwUOOy4ZsCORo6KjRBXKF4S2AJJI3WemgFR2FTr8oWmt00IkZjRvB3"
);

const YOUR_DOMAIN = "http://localhost:3000/products";

app.post("/create-checkout-session", async (req, res) => {
  const product = req.body;
  console.log(product);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "inr",
          product_data: {
            name: product.title,
          },
          unit_amount: product.price * 1000,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${YOUR_DOMAIN}?success=true`,
    cancel_url: `${YOUR_DOMAIN}?canceled=true`,
  });

  res.json({ url: session.url });
});

app.get("/api/phoncases", async (req, res) => {
  const data = await Phonecase.find({});
  console.log(data);
});

app.post("/api/phoncases", async (req, res) => {
  const body = req.body;
  if (body.title === null) {
    return response.status(400).json({
      error: "title is missing",
    });
  }
  if (body.price === null) {
    return response.status(400).json({
      error: "price is missing",
    });
  }
  if (body.imgUrl === null) {
    return response.status(400).json({
      error: "img is missing",
    });
  }

  const phoncase = new Phoncase({
    title: body.title,
    number: body.number,
    imgUrl: body.imgUrl,
  });

  const response = await phoncase.save();
  console.log(response);
});

app.listen(3001, () => {
  console.log("Server is runnung on PORT 3001");
});
