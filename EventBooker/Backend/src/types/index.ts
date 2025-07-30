export interface User {
  id: string;
  email: string;
  password: string;
  role: "customer" | "admin";
  name: string;
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

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any[];
}

export interface JwtPayload {
  userId?: string;
  email?: string;
  role?: "customer" | "admin";
}
