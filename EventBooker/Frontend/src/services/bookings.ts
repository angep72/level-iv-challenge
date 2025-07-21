import api from './api';
import { Booking, CreateBookingData, ApiResponse } from '../types';

export const bookingsService = {
  async createBooking(data: CreateBookingData): Promise<Booking> {
    const response = await api.post<ApiResponse<Booking>>('/bookings', data);
    return response.data.data;
  },

  async getMyBookings(): Promise<Booking[]> {
    const response = await api.get<ApiResponse<Booking[]>>('/bookings');
    return response.data.data;
  },

  async cancelBooking(id: string): Promise<Booking> {
    const response = await api.put<ApiResponse<Booking>>(`/bookings/${id}`, {
      status: 'cancelled',
    });
    return response.data.data;
  },

  async getEventBookings(eventId: string): Promise<Booking[]> {
    const response = await api.get<ApiResponse<Booking[]>>(`/events/${eventId}/bookings`);
    return response.data.data;
  },
};