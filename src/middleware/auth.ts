import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { User, IUser } from '../model/index'; // Import both Model and Interface



interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

/**
 * Middleware to authenticate JWT token and attach user to request.
 * @param req - Express request object (with user property)
 * @param res - Express response object
 * @param next - Express next function
 */
export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Get token from Authorization header
  const authHeader = req.get('authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    res.status(401).json({ success: false, message: 'Access token required' });
    return;
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    res.status(500).json({ success: false, message: 'Server misconfiguration' });
    return;
  }

  try {
    // Verify JWT and fetch user from DB
    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
    const user = await User.findById(decoded.userId).select('_id email role').lean() as IUser | null;

    if (!user) {
      res.status(401).json({ success: false, message: 'User not found' });
      return;
    }

    // Attach user info to request
    req.user = {
      id: user._id.toString(), 
      email: user.email,
      role: user.role,
    };

    next();
  } catch (err) {
    res.status(403).json({ success: false, message: 'Invalid or expired token',err });
  }
};

/**
 * Middleware to require a user role for access.
 * @param allowedRoles - Array of allowed roles
 * @returns Express middleware function
 */
export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    // Check if user exists and has required role
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      res.status(403).json({ success: false, message: 'Insufficient permissions' });
      return;
    }
    next();
  };
};