import api from './api';
import { Event, CreateEventData, ApiResponse } from '../types';

export const eventsService = {
  async getEvents(page = 1, limit = 10): Promise<Event[]> {
    const response = await api.get<ApiResponse<Event[]>>(
      `/events?page=${page}&limit=${limit}`
    );
    return response.data.data; 
  },

  async getEvent(id: string): Promise<Event> {
    const response = await api.get<ApiResponse<Event>>(`/events/${id}`);
    return response.data.data;
  },

  async createEvent(data: CreateEventData): Promise<Event> {
    const response = await api.post<ApiResponse<Event>>('/events', data);
    return response.data.data;
  },

  async updateEvent(id: string, data: Partial<CreateEventData>): Promise<Event> {
    const response = await api.put<ApiResponse<Event>>(`/events/${id}`, data);
    return response.data.data;
  },

  async deleteEvent(id: string): Promise<void> {
    await api.delete(`/events/${id}`);
  },
};
