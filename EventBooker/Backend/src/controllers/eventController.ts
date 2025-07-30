import { Request, Response } from 'express';
import { Event } from "../model/index";
import { ApiResponse, AuthRequest } from '../types';
 import mongoose from 'mongoose';

export const getAllEvents = async (req: Request, res: Response) => {
  try {
    const events = await Event.find({
      date: { $gte: new Date() }
    })
    .populate('createdBy', 'name email')
    .sort({ date: 1 });
    const eventsWithVirtuals = events.map(event => event.toJSON());

    res.json({
      success: true,
      message: 'Events fetched successfully',
      data: eventsWithVirtuals
    } as ApiResponse);
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse);
  }
};

export const getEventById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID'
      } as ApiResponse);
    }

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
      data: event.toJSON()
    } as ApiResponse);
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse);
  }
  return ;
};


export const createEvent = async (req: Request, res: Response) => {
  const user = (req as unknown as AuthRequest).user;
  try {
    const newEvent = await Event.create({ ...req.body, createdBy: user?.id });
    await newEvent.populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: newEvent.toJSON()
    } as ApiResponse);
  } catch (error: any) {
    console.error('Create event error:', error);

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      } as ApiResponse);
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse);
  }
};

export const updateEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, date, location, maxCapacity, price } = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID'
      } as ApiResponse);
    }

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
  } catch (error: any) {
    console.error('Update event error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      } as ApiResponse);
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse);
  }
  return ;
};

export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID'
      } as ApiResponse);
    }

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
    console.error('Delete event error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse);
  }
  return; 
};

export const getEventBookings = async (req:Request, res: Response) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID'
      } as ApiResponse);
    }

    // Import Booking model here to avoid circular dependency
    const { Booking } = require('../models');
    
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
    console.error('Get event bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse);
  }
  return; 
};