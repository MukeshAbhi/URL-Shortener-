import { Counter } from '@url-shortener/db';

/**
 * Atomic sequence generator
 * Works like SQL auto-increment
 */
export async function getNextSequence(name: string) {
  const counter = await Counter.findOneAndUpdate(
    { name },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  return counter!.seq;
}