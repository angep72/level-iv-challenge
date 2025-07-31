import React from "react";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Users, DollarSign } from "lucide-react";
import { Event } from "../../types";

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isEventFull = event.availableSpots === 0;
  const isPastEvent = new Date(event.date) < new Date();

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group">
      {event.imageUrl && (
        <div className="h-48 overflow-hidden">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
            {event.title}
          </h3>
          <div className="flex items-center text-emerald-600 font-semibold">
            <DollarSign size={16} />
            <span>{event.price === 0 ? "Free" : `$${event.price}`}</span>
          </div>
        </div>

        <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <Calendar size={16} className="mr-2" />
            <span>{formatDate(event.date)}</span>
          </div>

          <div className="flex items-center text-sm text-gray-500">
            <MapPin size={16} className="mr-2" />
            <span>{event.location}</span>
          </div>

          <div className="flex items-center text-sm text-gray-500">
            <Users size={16} className="mr-2" />
            <span>
              {event.availableSpots} / {event.maxCapacity} tickets available
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Link
            to={`/events/${event.id}`}
            className="text-orange-600 hover:text-orange-700 font-medium transition-colors"
          >
            View Details
          </Link>

          <div className="flex items-center gap-2">
            {isPastEvent && (
              <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                Past Event
              </span>
            )}
            {isEventFull && !isPastEvent && (
              <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-600 rounded-full">
                Sold Out
              </span>
            )}
            {!isEventFull && !isPastEvent && (
              <span className="px-2 py-1 text-xs font-medium bg-emerald-100 text-emerald-600 rounded-full">
                Available
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
