import React, { useState } from 'react';
import { Calendar, MapPin, Users, X } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { Booking } from '../../types';
import { bookingsService } from '../../services/bookings';
import { QUERY_KEYS } from '../../utils/constants';
import Modal from '../common/Modal';
import LoadingSpinner from '../common/LoadingSpinner';

interface BookingCardProps {
  booking: Booking;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking }) => {
  const queryClient = useQueryClient();
  const [showCancelModal, setShowCancelModal] = useState(false);

  const cancelMutation = useMutation({
    mutationFn: bookingsService.cancelBooking,
    onSuccess: () => {
      toast.success('Booking cancelled successfully');
      setShowCancelModal(false);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BOOKINGS] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    },
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

const handleCancel = () => {
  
  if (booking._id) {
    cancelMutation.mutate(booking._id);
  } else {
    toast.error('Booking ID is missing.');
  }
};  



  const isCancellable = booking.status === 'active' && 
    booking.eventId && new Date(booking.eventId.date) > new Date();
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {booking.eventId ? booking.eventId.title : "Event deleted"}
          </h3>
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                booking.status === 'active'
                  ? 'bg-emerald-100 text-emerald-600'
                  : 'bg-red-100 text-red-600'
              }`}
            >
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </span>
          </div>
        </div>
        
        {isCancellable && (
          <button
            onClick={() => setShowCancelModal(true)}
            className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
            title="Cancel booking"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {booking.eventId && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar size={16} />
            <span>{formatDate(booking.eventId.date)}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin size={16} />
            <span>{booking.eventId.location}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users size={16} />
            <span>{booking.ticketCount} ticket{booking.ticketCount > 1 ? 's' : ''}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>{booking.eventId.price.toFixed(2)}</span>
          </div>
        </div>
      )}

      <div className="text-sm text-gray-500">
        Booked on {formatDate(booking.bookingDate)}
      </div>

      {/* Cancel Confirmation Modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Cancel Booking"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to cancel your booking for "{booking.event?.title}"?
          </p>
          <p className="text-sm text-gray-500">
            This action cannot be undone. You may be eligible for a refund according to our refund policy.
          </p>
          
          <div className="flex gap-3">
            <button
              onClick={() => setShowCancelModal(false)}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Keep Booking
            </button>
            <button
              onClick={handleCancel}
              disabled={cancelMutation.isPending}
              className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {cancelMutation.isPending ? (
                <LoadingSpinner size="sm" />
              ) : (
                'Cancel Booking'
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BookingCard;