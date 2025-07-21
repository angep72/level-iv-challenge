export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const ROUTES = {
  // Public routes
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  EVENTS: '/events',
  EVENT_DETAIL: '/events/:id',
  
  // Customer routes
  MY_BOOKINGS: '/bookings',
  
  // Admin routes
  ADMIN_DASHBOARD: '/admin',
  ADMIN_CREATE_EVENT: '/admin/events/new',
  ADMIN_EDIT_EVENT: '/admin/events/:id/edit',
  ADMIN_EVENT_BOOKINGS: '/admin/events/:id/bookings',
} as const;

export const QUERY_KEYS = {
  EVENTS: 'events',
  EVENT: 'event',
  BOOKINGS: 'bookings',
  EVENT_BOOKINGS: 'event-bookings',
  USER: 'user',
} as const;

export const ROLES = {
  ADMIN: 'admin',
  CUSTOMER: 'customer',
} as const;

export const BOOKING_STATUS = {
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
} as const;