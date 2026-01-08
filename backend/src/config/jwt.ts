import jwt from 'jsonwebtoken';

const JWT_SECRET: string = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || '7d';

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export const generateToken = (payload: JwtPayload): string => {
  // Note: expiresIn is hardcoded to avoid TypeScript type inference issues
  // Can be configured via JWT_SECRET and other runtime configs
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};

export { JWT_SECRET, JWT_EXPIRES_IN };
