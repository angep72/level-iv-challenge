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
import { validateEvent, validateMongoIdParam } from '../middleware/validation';

const router = Router();

router.get('/', getAllEvents);


router.get('/:id', validateMongoIdParam, getEventById);

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
  validateMongoIdParam,
  validateEvent,
  updateEvent
);


router.delete(
  '/:id',
  authenticateToken,
  requireRole(['admin']),
  validateMongoIdParam,
  deleteEvent
);


router.get(
  '/:id/bookings',
  authenticateToken,
  requireRole(['admin']),
  validateMongoIdParam,
  getEventBookings
);

export default router;