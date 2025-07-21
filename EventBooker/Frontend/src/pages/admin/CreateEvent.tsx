import React from 'react';
import { Plus } from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/admin/Sidebar';
import CreateEventForm from '../../components/events/CreateEventForm';

const CreateEvent: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="flex">
        <Sidebar />
        
        <div className="flex-1 p-8">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Plus className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">Create New Event</h1>
            </div>
            <p className="text-gray-600">
              Fill in the details below to create a new event.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-8">
            <CreateEventForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;