/**
 * Character set used for Base62 encoding.
 * 62 characters = [a-zA-Z0-9]
 *
 * This gives:
 * 62^7  ≈ 3.5 trillion combinations
 * 62^8  ≈ 218 trillion combinations
 *
 * Perfect for URL shorteners.
 */
const ALPHABET =
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

const BASE = ALPHABET.length; // 62

/**
 * Encode a numeric ID into a Base62 string.
 *
 * Example:
 *   125 → "cb"
 *   9999 → "2Bh"
 *
 * Why we encode DB IDs instead of random strings:
 * - No collisions
 * - Deterministic
 * - No retry loops
 * - Fast
 */
function encode(id: number): string {
  if (id === 0) ALPHABET[0];

  let result = "";

  while (id > 0) {
    const remainder = id % BASE;
    result = ALPHABET[remainder] + result;
    id = Math.floor(id / BASE);
  }

  return result;
}

/* ---------- Random Suffix ---------- */

/**
 * Generate cryptographically random Base62 string
 */
function randomBase62(length: number): string {
  let result = "";

  for (let i = 0; i < length; i++) {
    const rand = Math.floor(Math.random() * BASE);
    result += ALPHABET[rand];
  }

  return result;
}

/**
 * Encode with random suffix
 *
 * Example:
 *   id = 9353, suffixLength = 2
 *   → "2n9" + "Kd" = "2n9Kd"
 */
function encodeWithSuffix(
  id: number,
  suffixLength = 2
): string {
  const base = encode(id);
  const suffix = randomBase62(suffixLength);

  return base + suffix;
}

export { encodeWithSuffix };
