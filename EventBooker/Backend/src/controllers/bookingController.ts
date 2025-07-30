import { Request, Response } from "express";
import { Booking, Event } from "../model/index";
import { ApiResponse, AuthRequest } from "../types";
import mongoose from "mongoose";

// Create Booking
export const createBooking = async (req: Request, res: Response) => {
  const user = (req as unknown as AuthRequest).user;
  try {
    const { event_id, ticketCount } = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(event_id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID",
      } as ApiResponse);
    }

    // Validate ticket count
    const parsedTicketCount = Number(ticketCount);
    if (!parsedTicketCount || parsedTicketCount < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid ticket count",
      } as ApiResponse);
    }

    // Check if event exists
    const event = await Event.findById(event_id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      } as ApiResponse);
    }

    // Check if event is in the future
    if (new Date(event.date) < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Cannot book past events",
      } as ApiResponse);
    }

    // Check if user already has a booking for this event
    const existingBooking = await Booking.findOne({
      userId: user?.id,
      eventId: event_id,
      status: "active",
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: "You already have a booking for this event",
      } as ApiResponse);
    }

    // Check event capacity
    const current = event.currentBookings || 0;
    if (current + parsedTicketCount > event.maxCapacity) {
      return res.status(400).json({
        success: false,
        message: "Not enough tickets available",
      } as ApiResponse);
    }

    // Create booking
    const booking = new Booking({
      userId: user?.id,
      eventId: event_id,
      status: "active",
      bookingDate: new Date(),
      ticketCount: parsedTicketCount,
    });

    await booking.save();
    await booking.populate([
      { path: "userId", select: "name email" },
      {
        path: "eventId",
        select: "title date location price maxCapacity currentBookings",
      },
    ]);

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: booking,
    } as ApiResponse);
  } catch (error: any) {
    console.error("Create booking error:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      } as ApiResponse);
    }

    if (
      error.message &&
      error.message.includes("already has an active booking")
    ) {
      return res.status(400).json({
        success: false,
        message: error.message,
      } as ApiResponse);
    }

    if (error.message && error.message.includes("fully booked")) {
      return res.status(400).json({
        success: false,
        message: error.message,
      } as ApiResponse);
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    } as ApiResponse);
  }
  return;
};

// Get User Bookings
export const getUserBookings = async (req: Request, res: Response) => {
  try {
    const user = (req as unknown as AuthRequest).user;
    const user_id = user?.id;

    const bookings = await Booking.find({ userId: user_id })
      .populate("eventId", "title description date location price")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      message: "Bookings fetched successfully",
      data: bookings,
    } as ApiResponse);
  } catch (error) {
    console.error("Get user bookings error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    } as ApiResponse);
  }
};

// Cancel Booking
export const cancelBooking = async (req: Request, res: Response) => {
  const user = (req as unknown as AuthRequest).user;

  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID",
      } as ApiResponse);
    }

    // Find booking
    const booking = await Booking.findOne({
      _id: id,
      userId: user?.id,
      status: "active",
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found or already cancelled",
      } as ApiResponse);
    }

    // Update booking status
    booking.status = "cancelled";
    await booking.save();

    // Decrease event booking count by ticketCount
    await Event.findByIdAndUpdate(booking.eventId, {
      $inc: { currentBookings: -booking.ticketCount },
    });

    res.json({
      success: true,
      message: "Booking cancelled successfully",
    } as ApiResponse);
  } catch (error) {
    console.error("Cancel booking error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    } as ApiResponse);
  }
  return;
};

// Get Booking By ID
export const getBookingById = async (req: Request, res: Response) => {
  const user = (req as unknown as AuthRequest).user;
  try {
    const { id } = req.params;
    const user_id = user?.id;
    const user_role = user?.role;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID",
      } as ApiResponse);
    }

    const query: any = { _id: id };
    if (user_role !== "admin") {
      query.userId = user_id;
    }

    const booking = await Booking.findOne(query)
      .populate("userId", "name email")
      .populate("eventId", "title description date location price");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      } as ApiResponse);
    }

    res.json({
      success: true,
      message: "Booking fetched successfully",
      data: booking,
    } as ApiResponse);
  } catch (error) {
    console.error("Get booking error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    } as ApiResponse);
  }
  return;
};
