import { body, param, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

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

export const validateRegister = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').trim().isLength({ min: 2 }),
  body('role').optional().isIn(['customer', 'admin']),
  handleValidationErrors
];

export const validateLogin = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
  handleValidationErrors
];

export const validateEvent = [
  body('title').trim().isLength({ min: 3 }),
  body('description').trim().isLength({ min: 10 }),
  body('date').isISO8601(),
  body('location').trim().isLength({ min: 3 }),
  body('max_capacity').isInt({ min: 1 }),
  body('price').isFloat({ min: 0 }),
  handleValidationErrors
];

export const validateBooking = [
  body('event_id').isUUID(),
  handleValidationErrors
];

export const validateUUID = [
  param('id').isUUID(),
  handleValidationErrors
];