import { Schema, model } from 'mongoose';

const url = new Schema({
  longUrl: { type: String, required: true },
  shortUrl: { type: String, required: true, unique: true },
  clicks: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export const Url = model('Url', url);
