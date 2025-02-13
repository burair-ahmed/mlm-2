import jwt from 'jsonwebtoken';
import { IUser } from '../models/User';

export function generateToken(user: IUser): string {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  );
}

export async function verifyToken(token: string): Promise<any> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
      if (err) return reject(err);
      resolve(decoded);
    });
  });
}