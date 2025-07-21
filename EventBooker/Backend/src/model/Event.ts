import mongoose, { Document, Schema } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  description: string;
  date: Date;
  location: string;
  maxCapacity: number;
  currentBookings: number;
  price: number;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters long']
  },
  description: {
    type: String,
    required: [true, 'Event description is required'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters long']
  },
  date: {
    type: Date,
    required: [true, 'Event date is required'],
    validate: {
      validator: function(value: Date) {
        return value > new Date();
      },
      message: 'Event date must be in the future'
    }
  },
  location: {
    type: String,
    required: [true, 'Event location is required'],
    trim: true,
    minlength: [3, 'Location must be at least 3 characters long']
  },
  maxCapacity: {
    type: Number,
    required: [true, 'Maximum capacity is required'],
    min: [1, 'Maximum capacity must be at least 1']
  },
  currentBookings: {
    type: Number,
    default: 0,
    min: [0, 'Current bookings cannot be negative'],
    validate: {
      validator: function(this: IEvent, value: number) {
        return value <= this.maxCapacity;
      },
      message: 'Current bookings cannot exceed maximum capacity'
    }
  },
  price: {
    type: Number,
    required: [true, 'Event price is required'],
    min: [0, 'Price cannot be negative']
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Event creator is required']
  }
}, {
  timestamps: true
});

// Indexes for better query performance
EventSchema.index({ date: 1 });
EventSchema.index({ createdBy: 1 });
EventSchema.index({ title: 'text', description: 'text' });

// Virtual for available spots
EventSchema.virtual('availableSpots').get(function(this: IEvent) {
  return this.maxCapacity - this.currentBookings;
});

// Ensure virtual fields are serialized
EventSchema.set('toJSON', { virtuals: true });

export default mongoose.model<IEvent>('Event', EventSchema);