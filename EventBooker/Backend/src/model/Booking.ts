import mongoose, { Document, Schema } from 'mongoose';

export interface IBooking extends Document {
  userId: mongoose.Types.ObjectId;
  eventId: mongoose.Types.ObjectId;
  status: 'active' | 'cancelled';
  ticketCount: number;
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
  ticketCount: {
    type: Number,
    required: [true, 'Ticket count is required'],
    min: [1, 'At least one ticket must be booked'],
    default: 1
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
BookingSchema.pre('save', async function (next) {
  if (this.isNew && this.status === 'active') {
    const existingBooking = await mongoose.model('Booking').findOne({
      userId: this.userId,
      eventId: this.eventId,
      status: 'active',
      _id: { $ne: this._id }
    });

    if (existingBooking) {
      return next(new Error('User already has an active booking for this event'));
    }

    const Event = mongoose.model('Event');
    const event = await Event.findById(this.eventId);

    if (!event) {
      return next(new Error('Event not found'));
    }

    // ✅ Updated capacity check with ticketCount
    if ((event.currentBookings || 0) + this.ticketCount > event.maxCapacity) {
      return next(new Error('Not enough tickets available'));
    }
  }

  next();
});

// Post-save middleware to update event booking count
BookingSchema.post('save', async function (doc) {
  if (doc.status === 'active') {
    await mongoose.model('Event').findByIdAndUpdate(
      doc.eventId,
      { $inc: { currentBookings: doc.ticketCount } }
    );
  }
});

// Post-findOneAndUpdate middleware to handle status changes
BookingSchema.post('findOneAndUpdate', async function (doc) {
  if (doc && doc.status === 'cancelled') {
    await mongoose.model('Event').findByIdAndUpdate(
      doc.eventId,
      { $inc: { currentBookings: -doc.ticketCount } }
    );
  }
});

export default mongoose.model<IBooking>('Booking', BookingSchema);
