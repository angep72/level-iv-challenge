import { Router } from 'express';
import {
  createBooking,
  
  cancelBooking,
  getBookingById,
  getUserBookings
} from "../controllers/bookingController"
import { authenticateToken, requireRole } from '../middleware/auth';
import { validateBooking, validateUUID } from '../middleware/validation';

const router = Router();

/**
 * @route   POST /bookings
 * @desc    Create a new booking
 * @access  Customer/Admin
 */
router.post(
  '/',
  authenticateToken,
  requireRole(['customer', 'admin']),
  validateBooking,
  createBooking
);

/**
 * @route   GET /bookings
 * @desc    Get user's bookings
 * @access  Customer/Admin
 */
router.get(
  '/',
  authenticateToken,
  requireRole(['customer', 'admin']),
  getUserBookings
);

/**
 * @route   GET /bookings/:id
 * @desc    Get booking by ID
 * @access  Customer/Admin (own bookings) or Admin (all bookings)
 */
router.get(
  '/:id',
  authenticateToken,
  requireRole(['customer', 'admin']),
  validateUUID,
  getBookingById
);

/**
 * @route   PUT /bookings/:id
 * @desc    Cancel a booking
 * @access  Customer/Admin
 */
router.put(
  '/:id',
  authenticateToken,
  requireRole(['customer', 'admin']),
  validateUUID,
  cancelBooking
);

export default router;