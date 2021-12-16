import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "/.env" });
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();
app.use(cors());
app.use(express.json());
import Phonecase from "./models/phonecases";

// const stripe = require("stripe")(`${process.env.STRIPE_PRIVATE_KEY}`);

mongoose
  .connect(`${process.env.MONGO_URL}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("connected to MongoDB database");
  })
  .catch((err) => {
    console.log("error connecting to MongoDB: ", err.message);
  });

app.get("/", (_req, res) => {
  res.json("this is the backend of the caseity ecommerce website");
});

// app.post("/create-checkout-session", async (req, res) => {
//   const products = req.body;
//   console.log(products);
//   const session = await stripe.checkout.sessions.create({
//     payment_method_types: ["card"],
//     line_items: products.map((item) => {
//       return {
//         price_data: {
//           currency: "inr",
//           product_data: {
//             name: item.title,
//           },
//           unit_amount: item.price * 100,
//         },
//         quantity: item.quantity,
//       };
//     }),
//     mode: "payment",
//     success_url: `${process.env.DOMAIN}/success`,
//     cancel_url: `${process.env.DOMAIN}/canceled`,
//   });

//   res.json({ url: session.url });
// });

app.get("/api/phoncase", async (_req, res) => {
  const data = await Phonecase.find({});

  res.json(data);
});

app.post("/api/phoncase", async (req, res) => {
  const body = req.body;
  console.log(body);
  if (body.title === null) {
    return res.status(400).json({
      error: "title is missing",
    });
  }
  if (body.price === null) {
    return res.status(400).json({
      error: "price is missing",
    });
  }
  if (body.img === null) {
    return res.status(400).json({
      error: "img is missing",
    });
  }

  const phonecase = new Phonecase({
    title: body.title,
    price: body.price,
    img: body.img,
  });

  const response = await phonecase.save();
  return res.json(response);
});

app.listen(process.env.PORT || 3001, () => {
  console.log(`Express server listening on port ${process.env.PORT}`);
});
