"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const eventController_1 = require("../controllers/eventController");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const router = (0, express_1.Router)();
router.get('/', eventController_1.getAllEvents);
router.get('/:id', validation_1.validateMongoId, eventController_1.getEventById);
router.post('/', auth_1.authenticateToken, (0, auth_1.requireRole)(['admin']), validation_1.validateEvent, eventController_1.createEvent);
router.put('/:id', auth_1.authenticateToken, (0, auth_1.requireRole)(['admin']), validation_1.validateMongoId, validation_1.validateEvent, eventController_1.updateEvent);
router.delete('/:id', auth_1.authenticateToken, (0, auth_1.requireRole)(['admin']), validation_1.validateMongoId, eventController_1.deleteEvent);
router.get('/:id/bookings', auth_1.authenticateToken, (0, auth_1.requireRole)(['admin']), validation_1.validateMongoId, eventController_1.getEventBookings);
exports.default = router;
//# sourceMappingURL=eventsRoutes.js.map