import mongoose, { Document, Schema } from 'mongoose';

export interface IBooking extends Document {
  userId: mongoose.Types.ObjectId;
  eventId: mongoose.Types.ObjectId;
  status: 'active' | 'cancelled';
  bookingDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  eventId: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
    required: [true, 'Event ID is required']
  },
  status: {
    type: String,
    enum: ['active', 'cancelled'],
    default: 'active'
  },
  bookingDate: {
    type: Date,
    required: [true, 'Booking date is required'],
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate active bookings
BookingSchema.index({ userId: 1, eventId: 1, status: 1 }, { 
  unique: true,
  partialFilterExpression: { status: 'active' }
});

// Indexes for better query performance
BookingSchema.index({ userId: 1 });
BookingSchema.index({ eventId: 1 });
BookingSchema.index({ status: 1 });
BookingSchema.index({ createdAt: -1 });

// Pre-save middleware to validate booking constraints
BookingSchema.pre('save', async function(next) {
  if (this.isNew && this.status === 'active') {
    // Check if user already has an active booking for this event
    const existingBooking = await mongoose.model('Booking').findOne({
      userId: this.userId,
      eventId: this.eventId,
      status: 'active',
      _id: { $ne: this._id }
    });

    if (existingBooking) {
      const error = new Error('User already has an active booking for this event');
      return next(error);
    }

    // Check if event has capacity
    const Event = mongoose.model('Event');
    const event = await Event.findById(this.eventId);
    
    if (!event) {
      const error = new Error('Event not found');
      return next(error);
    }

    if (event.currentBookings >= event.maxCapacity) {
      const error = new Error('Event is fully booked');
      return next(error);
    }
  }
  
  next();
});

// Post-save middleware to update event booking count
BookingSchema.post('save', async function(doc) {
  if (doc.status === 'active') {
    await mongoose.model('Event').findByIdAndUpdate(
      doc.eventId,
      { $inc: { currentBookings: 1 } }
    );
  }
});

// Post-findOneAndUpdate middleware to handle status changes
BookingSchema.post('findOneAndUpdate', async function(doc) {
  if (doc && doc.status === 'cancelled') {
    await mongoose.model('Event').findByIdAndUpdate(
      doc.eventId,
      { $inc: { currentBookings: -1 } }
    );
  }
});

export default mongoose.model<IBooking>('Booking', BookingSchema);