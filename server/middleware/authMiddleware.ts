import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret';

interface AuthenticatedRequest extends Request {
  user?: { userId: string; email: string };
}

// Middleware to authenticate token
export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  // Get token from the header
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'Access is denied. No token.' });
    return;
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, jwtSecret) as {
      userId: string;
      email: string;
    };

    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid token' });
  }
};
