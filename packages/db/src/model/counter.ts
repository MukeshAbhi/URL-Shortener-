import { Schema, model } from 'mongoose';

const CounterSchema = new Schema({
  name: { type: String, required: true, unique: true },
  seq: { type: Number, default: 9353 },
});

export const Counter = model("Counter", CounterSchema);