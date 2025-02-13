import crypto from 'crypto';

export function generateReferralCode(): string {
  return crypto.randomBytes(8).toString('hex').slice(0, 8).toUpperCase();
}