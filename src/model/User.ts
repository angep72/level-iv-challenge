import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  role: 'customer' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  name: {
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
}, {
  timestamps: true,
//   toJSON: {
//     transform: function(doc, ret) {
//       delete ret.password;
//       return ret;
//     }
//   }
});

// UserSchema.index({ email: 1 });

export default mongoose.model<IUser>('User', UserSchema);