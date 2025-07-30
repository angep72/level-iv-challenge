/**
 * Represents a user in the system.
 * Note: Password field is intentionally omitted for frontend safety.
 */
export interface User {
  id: string;
  email: string;
  role: 'admin' | 'customer';
  firstName: string;
  lastName: string;
}

/**
 * Represents an event in the system.
 */
export interface Event {
  id: string;
  _id?: string;   
  title: string;
  description: string;
  date: string;
  location: string;
  price: number;
  maxCapacity:number,
  availableSpots: number;
  imageUrl?: string;
  organizerId: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Represents a booking for an event.
 */
export interface Booking {
  id: string;
  _id?:string;
  eventId: Event;
  userId: string;
  status: 'active' | 'cancelled';
  ticketCount: number;
  totalAmount: number;
  bookingDate: string;
  event?: Event;
  user?: User;
}

/**
 * Data required to create a new event.
 */
export interface CreateEventData {
  title: string;
  description: string;
  date: string;
  location: string;
  price: number;
  capacity: number;
  imageUrl?: string;
}

/**
 * Data required to create a new booking.
 */
export interface CreateBookingData {
  event_id: string;
  ticketCount: number;
}

/**
 * Data required for user login.
 */
export interface LoginData {
  email: string;
  password: string;
}

/**
 * Data required for user registration.
 */
export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: 'admin' | 'customer';
}

/**
 * Standard API response wrapper.
 */
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

/**
 * Standard paginated API response wrapper.
 */
export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
}