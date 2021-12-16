import { Schema, model } from "mongoose";
import { Phonecase } from "../types";

const phonecaseSchema = new Schema<Phonecase>({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
  },
  img: {
    type: String,
    required: true,
  },
});

export default model<Phonecase>("phonecase", phonecaseSchema);
