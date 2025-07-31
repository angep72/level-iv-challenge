"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bookingController_1 = require("../controllers/bookingController");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const router = (0, express_1.Router)();
router.post('/', auth_1.authenticateToken, (0, auth_1.requireRole)(['customer', 'admin']), validation_1.validateBooking, bookingController_1.createBooking);
router.get('/', auth_1.authenticateToken, (0, auth_1.requireRole)(['customer', 'admin']), bookingController_1.getUserBookings);
router.get('/:id', auth_1.authenticateToken, (0, auth_1.requireRole)(['customer', 'admin']), validation_1.validateMongoIdParam, bookingController_1.getBookingById);
router.put('/:id', auth_1.authenticateToken, (0, auth_1.requireRole)(['customer', 'admin']), validation_1.validateMongoIdParam, bookingController_1.cancelBooking);
exports.default = router;
//# sourceMappingURL=bookingRoutes.js.map