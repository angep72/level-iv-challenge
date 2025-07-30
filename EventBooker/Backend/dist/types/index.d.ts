export interface User {
  id: string;
  email: string;
  role: "customer" | "admin";
  firstName: string;
  lastName: string;
  created_at: string;
  updated_at: string;
}
export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  capacity: number;
  current_bookings: number;
  price: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}
export interface Querys {
  _id: string;
  userId?: string;
}
export interface Booking {
  id: string;
  user_id: string;
  event_id: string;
  status: "active" | "cancelled";
  booking_date: string;
  created_at: string;
  updated_at: string;
}
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: "customer" | "admin";
  };
}
export interface ApiResponse<T = unknown, E = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: E[];
}
export interface JwtPayload {
  userId: string;
  email: string;
  role: "customer" | "admin";
}
export interface EventJSON {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  maxCapacity: number;
  currentBookings: number;
  price: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
export interface PopulatedEvent {
  toJSON: () => any;
}
export interface MongooseValidationError extends Error {
  errors: {
    [key: string]: {
      message: string;
    };
  };
  name: "ValidationError";
}
//# sourceMappingURL=index.d.ts.map
