import React from 'react';
import { Calendar, BookingCalendarEvent } from '@/components/placeholder-calendar';

export interface BookingCalendarProps {
  events: BookingCalendarEvent[];
  onSelectEvent?: (event: BookingCalendarEvent) => void;
}

export const BookingCalendar: React.FC<BookingCalendarProps> = ({ 
  events, 
  onSelectEvent 
}) => {
  return (
    <div className="w-full">
      <Calendar 
        events={events} 
        onSelectEvent={onSelectEvent} 
      />
    </div>
  );
};

export default BookingCalendar;