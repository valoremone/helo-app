import React from 'react';

// Define types to match what was expected from react-big-calendar
export interface BookingCalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  status: string;
  customer: string;
  aircraft: string;
  resourceId?: string;
  type?: string;
}

// Simple placeholder Calendar component to replace react-big-calendar
export function Calendar({ 
  events = [], 
  onSelectEvent = () => {} 
}: { 
  events: BookingCalendarEvent[]; 
  onSelectEvent?: (event: BookingCalendarEvent) => void; 
}) {
  return (
    <div className="border rounded-lg p-6 bg-white dark:bg-gray-800">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold mb-2">Calendar View Disabled</h2>
        <p className="text-gray-600 dark:text-gray-300">
          The calendar functionality has been removed as requested.
        </p>
      </div>
      <div className="grid gap-4">
        {events.length > 0 ? (
          events.map((event) => (
            <div 
              key={event.id}
              className="p-4 border rounded-lg hover:shadow-md cursor-pointer bg-blue-50 dark:bg-blue-900/20"
              onClick={() => onSelectEvent(event)}
            >
              <h3 className="font-medium">{event.title}</h3>
              <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                {event.start.toLocaleString()} - {event.end.toLocaleString()}
              </div>
              <div className="mt-2 flex gap-2">
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  event.status === 'confirmed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                  event.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                  event.status === 'cancelled' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                  'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                }`}>
                  {event.status}
                </span>
                <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                  {event.type}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center p-8 text-gray-500 dark:text-gray-400">
            No events to display
          </div>
        )}
      </div>
    </div>
  );
}

// Simple placeholder for momentLocalizer
export const momentLocalizer = () => ({
  format: () => '',
});

// Simple placeholder for moment
const moment = {
  // Minimal implementation to satisfy type requirements
  format: () => '',
};

export default {
  Calendar,
  momentLocalizer,
  moment,
}; 