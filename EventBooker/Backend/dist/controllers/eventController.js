"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEventBookings = exports.deleteEvent = exports.updateEvent = exports.createEvent = exports.getEventById = exports.getAllEvents = void 0;
const index_1 = require("../model/index");
const mongoose_1 = __importDefault(require("mongoose"));
const model_1 = require("../model");
const getAllEvents = async (req, res) => {
    try {
        const events = await index_1.Event.find({
            date: { $gte: new Date() }
        })
            .populate('createdBy', 'name email')
            .sort({ date: 1 });
        res.json({
            success: true,
            message: 'Events fetched successfully',
            data: events
        });
    }
    catch (error) {
        console.error('Get events error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.getAllEvents = getAllEvents;
const getEventById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid event ID'
            });
        }
        const event = await index_1.Event.findById(id)
            .populate('createdBy', 'name email');
        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }
        res.json({
            success: true,
            message: 'Event fetched successfully',
            data: event
        });
    }
    catch (error) {
        console.error('Get event error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
    return;
};
exports.getEventById = getEventById;
const createEvent = async (req, res) => {
    const user = req.user;
    try {
        const newEvent = await index_1.Event.create({ ...req.body, createdBy: user?.id });
        await newEvent.populate('createdBy', 'name email');
        res.status(201).json({
            success: true,
            message: 'Event created successfully',
            data: newEvent
        });
    }
    catch (error) {
        console.error('Create event error:', error);
        if (typeof error === 'object' &&
            error !== null &&
            'name' in error &&
            error.name === 'ValidationError') {
            const validationError = error;
            const errors = Object.values(validationError.errors).map(err => err.message);
            res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors
            });
            return;
        }
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.createEvent = createEvent;
const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, date, location, maxCapacity, price } = req.body;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid event ID'
            });
        }
        const event = await index_1.Event.findByIdAndUpdate(id, {
            title,
            description,
            date,
            location,
            maxCapacity,
            price
        }, {
            new: true,
            runValidators: true
        }).populate('createdBy', 'name email');
        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }
        res.json({
            success: true,
            message: 'Event updated successfully',
            data: event
        });
    }
    catch (error) {
        console.error('Update event error:', error);
        if (typeof error === 'object' &&
            error !== null &&
            'name' in error &&
            error.name === 'ValidationError') {
            const validationError = error;
            const errors = Object.values(validationError.errors).map(err => err.message);
            res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors
            });
            return;
        }
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
    return;
};
exports.updateEvent = updateEvent;
const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid event ID'
            });
        }
        const event = await index_1.Event.findByIdAndDelete(id);
        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }
        res.json({
            success: true,
            message: 'Event deleted successfully'
        });
    }
    catch (error) {
        console.error('Delete event error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
    return;
};
exports.deleteEvent = deleteEvent;
const getEventBookings = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid event ID'
            });
        }
        const bookings = await model_1.Booking.find({
            eventId: id,
            status: 'active'
        })
            .populate('userId', 'name email')
            .populate('eventId', 'title date location')
            .sort({ createdAt: -1 });
        res.json({
            success: true,
            message: 'Event bookings fetched successfully',
            data: bookings
        });
    }
    catch (error) {
        console.error('Get event bookings error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
    return;
};
exports.getEventBookings = getEventBookings;
//# sourceMappingURL=eventController.js.map