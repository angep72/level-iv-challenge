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
import { validateEvent, validateUUID } from '../middleware/validation';

const router = Router();

router.get('/', getAllEvents);


router.get('/:id', validateUUID, getEventById);

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
  validateUUID,
  validateEvent,
  updateEvent
);


router.delete(
  '/:id',
  authenticateToken,
  requireRole(['admin']),
  validateUUID,
  deleteEvent
);


router.get(
  '/:id/bookings',
  authenticateToken,
  requireRole(['admin']),
  validateUUID,
  getEventBookings
);

export default router;