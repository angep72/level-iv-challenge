import React from 'react';
import { Calendar } from 'lucide-react';
import EventList from '../components/events/EventList';
import Navbar from '../components/common/Navbar';

const Events: React.FC = () => {
  // Removed simulated error for ErrorBoundary testing
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Upcoming Events</h1>
          </div>
          <p className="text-gray-600">
            Discover and book tickets for amazing events in your area.
          </p>
        </div>
        
        <EventList />
      </div>
    </div>
  );
};

export default Events;