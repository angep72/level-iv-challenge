import { Request, Response } from 'express';
import { Event } from "../model/index";
import { ApiResponse, AuthRequest, MongooseValidationError } from '../types';
 import mongoose from 'mongoose';
 import { Booking } from '../model';


/**
 * Get all upcoming events.
 * @param req - Express request object
 * @param res - Express response object
 */
export const getAllEvents = async (req: Request, res: Response) => {
  try {
    // Find events with date in the future
    const events = await Event.find({
      date: { $gte: new Date() }
    })
    .populate('createdBy', 'name email')
    .sort({ date: 1 });

    res.json({
      success: true,
      message: 'Events fetched successfully',
      data: events
    } as ApiResponse);
  } catch (error) {
    // Log and return server error
    console.error('Get events error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse);
  }
};

/**
 * Get a single event by its ID.
 * @param req - Express request object
 * @param res - Express response object
 */
export const getEventById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Validate event ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID'
      } as ApiResponse);
    }

    // Find event by ID
    const event = await Event.findById(id)
      .populate('createdBy', 'name email');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      } as ApiResponse);
    }

    res.json({
      success: true,
      message: 'Event fetched successfully',
      data: event
    } as ApiResponse);
  } catch (error) {
    // Log and return server error
    console.error('Get event error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse);
  }
  return ;
};

/**
 * Create a new event (admin only).
 * @param req - Express request object
 * @param res - Express response object
 */
export const createEvent = async (req: Request, res: Response) => {
  const user = (req as unknown as AuthRequest).user;
  try {
    // Create event with current user as creator
    const newEvent = await Event.create({ ...req.body, createdBy: user?.id });
    await newEvent.populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: newEvent
    } as ApiResponse);
  } catch (error: unknown) {
    // Log and handle validation errors
    console.error('Create event error:', error);

    // Narrow the error type to MongooseValidationError
    if (
      typeof error === 'object' &&
      error !== null &&
      'name' in error &&
      (error as Error).name === 'ValidationError'
    ) {
      const validationError = error as MongooseValidationError;
      const errors = Object.values(validationError.errors).map(err => err.message);

      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      } satisfies ApiResponse<null, string>);
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } satisfies ApiResponse);
  }
};

/**
 * Update an event by its ID (admin only).
 * @param req - Express request object
 * @param res - Express response object
 */
export const updateEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, date, location, maxCapacity, price } = req.body;

    // Validate event ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID'
      } as ApiResponse);
    }

    // Update event and return the new document
    const event = await Event.findByIdAndUpdate(
      id,
      {
        title,
        description,
        date,
        location,
        maxCapacity,
        price
      },
      { 
        new: true, 
        runValidators: true 
      }
    ).populate('createdBy', 'name email');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      } as ApiResponse);
    }

    res.json({
      success: true,
      message: 'Event updated successfully',
      data: event
    } as ApiResponse);
  } catch (error: unknown) {
    // Log and handle validation errors
    console.error('Update event error:', error);
    
    if (
      typeof error === 'object' &&
      error !== null &&
      'name' in error &&
      (error as Error).name === 'ValidationError'
    ) {
      const validationError = error as MongooseValidationError;
      const errors = Object.values(validationError.errors).map(err => err.message);

      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      } satisfies ApiResponse<null, string>);
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse);
  }
  return ;
};

/**
 * Delete an event by its ID (admin only).
 * @param req - Express request object
 * @param res - Express response object
 */
export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Validate event ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID'
      } as ApiResponse);
    }

    // Delete event by ID
    const event = await Event.findByIdAndDelete(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      } as ApiResponse);
    }

    res.json({
      success: true,
      message: 'Event deleted successfully'
    } as ApiResponse);
  } catch (error) {
    // Log and return server error
    console.error('Delete event error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse);
  }
  return; 
};

/**
 * Get all bookings for a specific event (admin only).
 * @param req - Express request object
 * @param res - Express response object
 */
export const getEventBookings = async (req:Request, res: Response) => {
  try {
    const { id } = req.params;

    // Validate event ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID'
      } as ApiResponse);
    }

    // Find bookings for the event
    const bookings = await Booking.find({
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
    } as ApiResponse);
  } catch (error) {
    // Log and return server error
    console.error('Get event bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse);
  }
  return; 
};