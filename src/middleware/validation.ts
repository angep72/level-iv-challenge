import { body, param, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to handle validation errors from express-validator.
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  return next();
};

/**
 * Validation chain for user registration.
 */
export const validateRegister = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('firstName').trim().isLength({ min: 2 }),
  body('lastName').trim().isLength({min:2}),
  body('role').optional().isIn(['customer', 'admin']),
  handleValidationErrors
];

/**
 * Validation chain for user login.
 */
export const validateLogin = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
  handleValidationErrors
];

/**
 * Validation chain for event creation and update.
 */
export const validateEvent = [
  body('title').trim().isLength({ min: 3 }),
  body('description').trim().isLength({ min: 10 }),
  body('date').isISO8601(),
  body('location').trim().isLength({ min: 3 }),
  body('maxCapacity').isInt({ min: 1 }),
  body('price').isFloat({ min: 0 }),
  handleValidationErrors
];

/**
 * Validation chain for booking creation.
 */
export const validateBooking = [
  body('eventId').isMongoId(),
  handleValidationErrors
];

/**
 * Validation chain for MongoDB ObjectId in route params.
 */
export const validateMongoId = [
  param('id').isMongoId().withMessage('Invalid MongoDB ObjectId'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        // I can give a proper message here 
        errors: errors.array()
      });
    }
    next();
    return;
  }
];

