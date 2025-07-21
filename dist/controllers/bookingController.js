"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBookingById = exports.cancelBooking = exports.getUserBookings = exports.createBooking = void 0;
const index_1 = require("../model/index");
const mongoose_1 = __importDefault(require("mongoose"));
const createBooking = async (req, res) => {
    const user = req.user;
    try {
        const { eventId } = req.body;
        if (!mongoose_1.default.Types.ObjectId.isValid(eventId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid event ID'
            });
        }
        const event = await index_1.Event.findById(eventId);
        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }
        if (new Date(event.date) < new Date()) {
            return res.status(400).json({
                success: false,
                message: 'Cannot book past events'
            });
        }
        const existingBooking = await index_1.Booking.findOne({
            userId: user?.id,
            eventId: eventId,
            status: 'active'
        });
        if (existingBooking) {
            return res.status(400).json({
                success: false,
                message: 'You already have a booking for this event'
            });
        }
        if (event.currentBookings >= event.maxCapacity) {
            return res.status(400).json({
                success: false,
                message: 'Event is fully booked'
            });
        }
        const booking = new index_1.Booking({
            userId: user?.id,
            eventId: eventId,
            status: 'active',
            bookingDate: new Date()
        });
        await booking.save();
        await booking.populate([
            { path: 'userId', select: 'name email' },
            { path: 'eventId', select: 'title date location price maxCapacity currentBookings' }
        ]);
        const bookingData = booking.toJSON();
        if (booking.eventId && typeof booking.eventId === 'object' && 'toJSON' in booking.eventId) {
            bookingData.eventId = booking.eventId.toJSON();
        }
        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            data: bookingData
        });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Create booking error:', error);
            if ('name' in error && error.name === 'ValidationError') {
                const validationErr = error;
                const errors = Object.values(validationErr.errors).map((err) => err.message);
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors
                });
            }
            if (error.message.includes('already has an active booking')) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }
            if (error.message.includes('fully booked')) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }
        }
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
    return;
};
exports.createBooking = createBooking;
const getUserBookings = async (req, res) => {
    try {
        const user = req.user;
        const user_id = user?.id;
        const bookings = await index_1.Booking.find({ userId: user_id })
            .populate('eventId', 'title description date location price')
            .sort({ createdAt: -1 });
        res.json({
            success: true,
            message: 'Bookings fetched successfully',
            data: bookings
        });
    }
    catch (error) {
        console.error('Get user bookings error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.getUserBookings = getUserBookings;
const cancelBooking = async (req, res) => {
    const user = req.user;
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid booking ID'
            });
        }
        const booking = await index_1.Booking.findOne({
            _id: id,
            userId: user?.id,
            status: 'active'
        });
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found or already cancelled'
            });
        }
        booking.status = 'cancelled';
        await booking.save();
        await index_1.Event.findByIdAndUpdate(booking.eventId, { $inc: { currentBookings: -1 } });
        res.json({
            success: true,
            message: 'Booking cancelled successfully'
        });
    }
    catch (error) {
        console.error('Cancel booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
    return;
};
exports.cancelBooking = cancelBooking;
const getBookingById = async (req, res) => {
    const user = req.user;
    try {
        const { id } = req.params;
        const user_id = user?.id;
        const user_role = user?.id;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid booking ID'
            });
        }
        const query = { _id: id };
        if (user_role !== 'admin') {
            query.userId = user_id;
        }
        const booking = await index_1.Booking.findOne(query)
            .populate('userId', 'name email')
            .populate('eventId', 'title description date location price');
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }
        res.json({
            success: true,
            message: 'Booking fetched successfully',
            data: booking
        });
    }
    catch (error) {
        console.error('Get booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
    return;
};
exports.getBookingById = getBookingById;
//# sourceMappingURL=bookingController.js.map