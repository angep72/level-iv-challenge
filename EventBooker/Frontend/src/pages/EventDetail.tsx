import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Calendar,
  MapPin,
  Users,
  DollarSign,
  ArrowLeft,
  Edit,
  Trash2,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { eventsService } from "../services/events";
import { bookingsService } from "../services/bookings";
import { useAuth } from "../hooks/useAuth";
import { QUERY_KEYS, ROUTES } from "../utils/constants";
import Navbar from "../components/common/Navbar";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorMessage from "../components/common/ErrorMessage";
import Modal from "../components/common/Modal";
import CreateEventForm from "../components/events/CreateEventForm";

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [ticketCount, setTicketCount] = useState(1);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const {
    data: event,
    isLoading,
    error,
  } = useQuery({
    queryKey: [QUERY_KEYS.EVENT, id],
    queryFn: () => eventsService.getEvent(id!),
    enabled: !!id,
  });

  const bookingMutation = useMutation({
    mutationFn: bookingsService.createBooking,
    onSuccess: () => {
      toast.success("Booking successful!");
      setIsBookingModalOpen(false);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EVENT, id] });
      navigate(ROUTES.MY_BOOKINGS);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Booking failed");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => eventsService.deleteEvent(id!),
    onSuccess: () => {
      toast.success("Event deleted successfully!");
      navigate(ROUTES.EVENTS);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EVENTS] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete event");
    },
  });

  const handleBooking = () => {
    if (!isAuthenticated) {
      toast.error("Please login to book tickets");
      navigate(ROUTES.LOGIN);
      return;
    }

    if (user?.role !== "customer") {
      toast.error("Only customers can book tickets");
      return;
    }

    bookingMutation.mutate({
      event_id: id!,
      ticketCount,
    });
  };

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ErrorMessage message="Event not found" />
        </div>
      </div>
    );
  }
  const isEventFull = event.availableSpots === 0;
  const isPastEvent = new Date(event.date) < new Date();
  const canBook =
    isAuthenticated &&
    user?.role === "customer" &&
    !isEventFull &&
    !isPastEvent;
  const totalPrice = event.price * ticketCount;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {event.imageUrl && (
            <div className="h-64 md:h-80 overflow-hidden">
              <img
                src={event.imageUrl}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {event.title}
                </h1>
                <div className="flex items-center text-2xl font-semibold text-emerald-600">
                  <DollarSign size={24} />
                  <span>{event.price === 0 ? "Free" : `${event.price}`}</span>
                </div>
              </div>

              <div className="flex gap-2 mt-4 md:mt-0">
                {canBook && (
                  <button
                    onClick={() => setIsBookingModalOpen(true)}
                    className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors font-medium"
                  >
                    Book Tickets
                  </button>
                )}
                {/* Admin controls */}
                {isAuthenticated && user?.role === "admin" && (
                  <>
                    <button
                      onClick={() => setIsEditModalOpen(true)}
                      className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors font-medium"
                    >
                      <Edit size={18} /> Edit
                    </button>
                    <button
                      onClick={() => setIsDeleteModalOpen(true)}
                      disabled={deleteMutation.isPending}
                      className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
                    >
                      <Trash2 size={18} /> Delete
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="flex items-center gap-3">
                <Calendar className="text-orange-600" size={24} />
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Date & Time
                  </p>
                  <p className="text-gray-900">{formatDate(event.date)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="text-orange-600" size={24} />
                <div>
                  <p className="text-sm font-medium text-gray-500">Location</p>
                  <p className="text-gray-900">{event.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Users className="text-orange-600" size={24} />
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Availability
                  </p>
                  <p className="text-gray-900">
                    {event.availableSpots} / {event.maxCapacity} tickets
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                About this event
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {event.description}
              </p>
            </div>

            <div className="flex items-center gap-4">
              {isPastEvent && (
                <span className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full font-medium">
                  Past Event
                </span>
              )}
              {isEventFull && !isPastEvent && (
                <span className="px-4 py-2 bg-red-100 text-red-600 rounded-full font-medium">
                  Sold Out
                </span>
              )}
              {!canBook &&
                !isPastEvent &&
                !isEventFull &&
                isAuthenticated &&
                user?.role === "admin" && (
                  <span className="px-4 py-2 bg-orange-100 text-orange-600 rounded-full font-medium">
                    Admin View
                  </span>
                )}
              {!isAuthenticated && !isPastEvent && !isEventFull && (
                <span className="text-gray-600">
                  Please{" "}
                  <button
                    onClick={() => navigate(ROUTES.LOGIN)}
                    className="text-orange-600 hover:text-orange-700 font-medium"
                  >
                    login
                  </button>{" "}
                  to book tickets
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <Modal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        title="Book Tickets"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Tickets
            </label>
            <select
              value={ticketCount}
              onChange={(e) => setTicketCount(Number(e.target.value))}
              className="w-full px-3  py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            >
              {Array.from(
                { length: Math.min(event.availableSpots, 10) },
                (_, i) => i + 1
              ).map((num) => (
                <option key={num} value={num}>
                  {num} ticket{num > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total Amount:</span>
              <span className="text-xl font-bold text-emerald-600">
                ${totalPrice.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setIsBookingModalOpen(false)}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleBooking}
              disabled={bookingMutation.isPending}
              className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {bookingMutation.isPending ? (
                <LoadingSpinner size="sm" />
              ) : (
                "Confirm Booking"
              )}
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Event Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Event"
      >
        <CreateEventForm
          initialValues={event}
          isEdit={true}
          eventId={event?._id}
          onSubmitSuccess={() => setIsEditModalOpen(false)}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Event"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to delete this event? This action cannot be
            undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setIsDeleteModalOpen(false);
                handleDelete();
              }}
              disabled={deleteMutation.isPending}
              className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {deleteMutation.isPending ? (
                <LoadingSpinner size="sm" />
              ) : (
                "Delete"
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EventDetail;
