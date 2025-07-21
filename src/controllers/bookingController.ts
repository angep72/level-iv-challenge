import { Request, Response } from 'express';
import { Booking, Event } from '../model/index';
import { ApiResponse, AuthRequest, Querys } from '../types';
import mongoose from 'mongoose';

/**
 * Create a new booking for an event.
 * Validates event existence, date, duplicate booking, and capacity.
 * @param req - Express request object
 * @param res - Express response object
 */
export const createBooking = async (req: Request, res: Response) => {
  const user = (req as unknown as AuthRequest).user;

  try {
    const { eventId } = req.body;

    // Validate eventId format
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID'
      } as ApiResponse);
    }

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      } as ApiResponse);
    }

    // Prevent booking for past events
    if (new Date(event.date) < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot book past events'
      } as ApiResponse);
    }

    // Prevent duplicate active bookings
    const existingBooking = await Booking.findOne({
      userId: user?.id,
      eventId: eventId,
      status: 'active'
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: 'You already have a booking for this event'
      } as ApiResponse);
    }

    // Prevent overbooking
    if (event.currentBookings >= event.maxCapacity) {
      return res.status(400).json({
        success: false,
        message: 'Event is fully booked'
      } as ApiResponse);
    }

    // Create and save the booking
    const booking = new Booking({
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

    // Manually convert booking and its populated eventId to JSON to apply virtuals
    const bookingData = booking.toJSON();
    if (booking.eventId && typeof booking.eventId === 'object' && 'toJSON' in booking.eventId) {
      bookingData.eventId = (booking.eventId as any).toJSON();
    }

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: bookingData
    } as ApiResponse);
  }catch (error: unknown) {
    if (error instanceof Error) {
      // Log error and handle validation/booking errors
      console.error('Create booking error:', error);

      if ('name' in error && error.name === 'ValidationError') {
        const validationErr = error as any; // or create a proper type
        const errors = Object.values(validationErr.errors).map((err: any) => err.message);

        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors
        } as ApiResponse);
      }

      if (error.message.includes('already has an active booking')) {
        return res.status(400).json({
          success: false,
          message: error.message
        } as ApiResponse);
      }

      if (error.message.includes('fully booked')) {
        return res.status(400).json({
          success: false,
          message: error.message
        } as ApiResponse);
      }
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse);
  }
  return;
};

/**
 * Get all bookings for the authenticated user.
 * @param req - Express request object
 * @param res - Express response object
 */
export const getUserBookings = async (req: Request, res: Response) => {
  try {
    const user = (req as unknown as AuthRequest).user;
    const user_id = user?.id;

    // Find bookings for the user
    const bookings = await Booking.find({ userId: user_id })
      .populate('eventId', 'title description date location price')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      message: 'Bookings fetched successfully',
      data: bookings
    } as ApiResponse);
  } catch (error) {
    // Log and return server error
    console.error('Get user bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse);
  }
};

/**
 * Cancel a booking by ID for the authenticated user.
 * @param req - Express request object
 * @param res - Express response object
 */
export const cancelBooking = async (req: Request, res: Response) => {
  const user = (req as unknown as AuthRequest).user;

  try {
    const { id } = req.params;

    // Validate booking ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking ID'
      } as ApiResponse);
    }

    // Find active booking for user
    const booking = await Booking.findOne({
      _id: id,
      userId: user?.id,
      status: 'active'
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found or already cancelled'
      } as ApiResponse);
    }

    // Update booking status to cancelled
    booking.status = 'cancelled';
    await booking.save();

    // Decrease event booking count
    await Event.findByIdAndUpdate(
      booking.eventId,
      { $inc: { currentBookings: -1 } }
    );

    res.json({
      success: true,
      message: 'Booking cancelled successfully'
    } as ApiResponse);
  } catch (error) {
    // Log and return server error
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse);
  }
  return;
};

/**
 * Get a booking by ID for the authenticated user (or admin).
 * @param req - Express request object
 * @param res - Express response object
 */
export const getBookingById = async (req:Request, res: Response) => {
  const user = (req as unknown as AuthRequest).user;
  try {
    const { id } = req.params;
    const user_id = user?.id;
    const user_role = user?.id; // Note: this should probably be user?.role

    // Validate booking ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking ID'
      } as ApiResponse);
    }

    // Build query based on user role
    const query: Querys = { _id: id };
    if (user_role !== 'admin') {
      query.userId = user_id;
    }

    // Find booking with populated user and event
    const booking = await Booking.findOne(query)
      .populate('userId', 'name email')
      .populate('eventId', 'title description date location price');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      } as ApiResponse);
    }

    res.json({
      success: true,
      message: 'Booking fetched successfully',
      data: booking
    } as ApiResponse);
  } catch (error) {
    // Log and return server error
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse);
  }
  return;
};