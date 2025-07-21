import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Ticket } from 'lucide-react';
import { bookingsService } from '../services/bookings';
import { QUERY_KEYS } from '../utils/constants';
import Navbar from '../components/common/Navbar';
import BookingCard from '../components/bookings/BookingCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const MyBookings: React.FC = () => {
  const {
    data: bookings,
    isLoading,
    error,
  } = useQuery({
    queryKey: [QUERY_KEYS.BOOKINGS],
    queryFn: bookingsService.getMyBookings,
  });
  const filteredBookings = bookings?.filter(b => b.eventId);


  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ErrorMessage message="Failed to load bookings. Please try again later." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Ticket className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          </div>
          <p className="text-gray-600">
            View and manage your event bookings.
          </p>
        </div>
        
        {!filteredBookings?.length ? (
          <div className="text-center py-12">
            <Ticket className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-600 mb-6">
              You haven't booked any events yet, or your booked event has been deleted.<br />
              If your event was deleted, you will be refunded according to our policy.
            </p>
            <a
              href="/events"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Events
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {(filteredBookings ?? []).map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;