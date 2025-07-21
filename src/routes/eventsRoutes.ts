import { Router } from 'express';
import {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  getEventBookings,
  deleteEvent
} from '../controllers/eventController';
import { authenticateToken, requireRole } from '../middleware/auth';
import { validateEvent, validateMongoId } from '../middleware/validation';

const router = Router();

router.get('/', getAllEvents);


router.get('/:id', validateMongoId, getEventById);

router.post(
  '/',
  authenticateToken,
  requireRole(['admin']),
  validateEvent,
  createEvent
);


router.put(
  '/:id',
  authenticateToken,
  requireRole(['admin']),
  validateMongoId,
  validateEvent,
  updateEvent
);


router.delete(
  '/:id',
  authenticateToken,
  requireRole(['admin']),
  validateMongoId,
  deleteEvent
);


router.get(
  '/:id/bookings',
  authenticateToken,
  requireRole(['admin']),
  validateMongoId,
  getEventBookings
);

export default router;