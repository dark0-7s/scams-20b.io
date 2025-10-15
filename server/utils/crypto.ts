import crypto from 'crypto';

export function hmacSHA256Hex(key: Buffer | string, data: Buffer | string): string {
  return crypto.createHmac('sha256', key).update(data).digest('hex');
}

export function truncatedHmacHex(key: Buffer | string, data: Buffer | string, bytes: number = 8): string {
  const full = crypto.createHmac('sha256', key).update(data).digest();
  return full.subarray(0, bytes).toString('hex');
}

export function constantTimeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}
