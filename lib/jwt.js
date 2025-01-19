import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('Please define the JWT_SECRET environment variable inside .env');
}

export const signToken = (payload) => {
  try {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: '7d', // Token expires in 7 days
    });
  } catch (error) {
    console.error('Error signing token:', error);
    return null;
  }
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
};

export const getTokenFromHeader = (req) => {
  try {
    // For Next.js 13 API routes using headers() method
    if (req.headers?.get) {
      const authHeader = req.headers.get('authorization');
      if (authHeader?.startsWith('Bearer ')) {
        return authHeader.split(' ')[1];
      }
      return null;
    }
    
    // For traditional headers object
    if (req.headers?.authorization?.startsWith('Bearer ')) {
      return req.headers.authorization.split(' ')[1];
    }
    return null;
  } catch (error) {
    console.error('Error getting token from header:', error);
    return null;
  }
};
