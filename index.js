require("dotenv").config();
var cors = require("cors");
const express = require("express");
const app = express();
app.use(cors());
app.use(express.json());
const Phonecase = require("./models/phonecases");

const stripe = require("stripe")(`${process.env.STRIPE_PRIVATE_KEY}`);

app.get("/", (req, res) => {
  res.json("this is a website");
});

app.post("/create-checkout-session", async (req, res) => {
  const products = req.body;
  console.log(products);
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: products.map((item) => {
      return {
        price_data: {
          currency: "inr",
          product_data: {
            name: item.title,
          },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      };
    }),
    mode: "payment",
    success_url: `${process.env.DOMAIN}/success`,
    cancel_url: `${process.env.DOMAIN}/canceled`,
  });

  res.json({ url: session.url });
});

app.get("/api/phoncase", async (req, res) => {
  const data = await Phonecase.find({});

  res.json(data);
});

app.post("/api/phoncase", async (req, res) => {
  const body = req.body;
  console.log(body);
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
  if (body.img === null) {
    return response.status(400).json({
      error: "img is missing",
    });
  }

  const phonecase = new Phonecase({
    title: body.title,
    price: body.price,
    img: body.img,
  });

  const response = await phonecase.save();
  res.json(response);
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Express server listening on port ${process.env.PORT}`);
});
