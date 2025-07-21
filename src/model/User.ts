import mongoose, { Document, Schema } from 'mongoose';

/**
 * Interface for User document in MongoDB.
 */
export interface IUser extends Document {
  _id:string;
  email: string;
  password : string;
  firstName:string;
  lastName:string 
  role: 'customer' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Mongoose schema for User collection.
 */
const UserSchema: Schema = new Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    index: true, 
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'] // Email validation regex
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  firstName: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long']
  },
  lastName: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long']
  },
  role: {
    type: String,
    enum: ['customer', 'admin'],
    default: 'customer'
  }
}, 
 {
  timestamps: true, // Automatically adds createdAt and updatedAt
});

export default mongoose.model<IUser>('User', UserSchema);