import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { eventsService } from '../../services/events';
import { QUERY_KEYS } from '../../utils/constants';
import EventCard from './EventCard';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const EventList: React.FC = () => {
  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: [QUERY_KEYS.EVENTS],
    queryFn: () => eventsService.getEvents(),
  });

const events = response ?? [];

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage
        message="Failed to load events. Please try again later."
        className="mx-auto max-w-md"
      />
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
        <p className="text-gray-600">Check back later for upcoming events.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard key={event.id || event._id} event={event} />
      ))}
    </div>
  );
};

export default EventList;
