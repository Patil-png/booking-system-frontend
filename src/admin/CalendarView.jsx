import React, { useEffect, useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, parse, startOfWeek, getDay, isWithinInterval } from 'date-fns';
import { fetchBookings, fetchBlockedDates, addBlockedDate } from '../utils/api';
import enUS from 'date-fns/locale/en-US';

const locales = { 'en-US': enUS };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const CalendarView = () => {
  const [allBookings, setAllBookings] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [typeFilter, setTypeFilter] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [blockedEvents, setBlocked] = useState([]);

  useEffect(() => {
    fetchBookings().then(bookings => {
      const mapped = bookings.map(b => ({
        title: `${b.type} - ₹${b.amount}`,
        start: new Date(b.checkIn),
        end: new Date(b.checkOut || b.checkIn), // Ensure end date is handled if missing
        allDay: true,
        resource: b, // Keep original booking data in resource
      }));
      setAllBookings(mapped);
      setFilteredEvents(mapped);
    }).catch(error => console.error("Error fetching bookings:", error)); // Add error handling
  }, []);

  useEffect(() => {
    fetchBlockedDates().then(setBlocked).catch(error => console.error("Error fetching blocked dates:", error)); // Add error handling
  }, []);

  useEffect(() => {
    let filtered = allBookings;
    if (typeFilter !== 'All') {
      filtered = filtered.filter(event => event.resource.type === typeFilter);
    }
    if (startDate && endDate) {
      const sDate = new Date(startDate);
      const eDate = new Date(endDate);
      // Filter events that fall within the selected date range
      filtered = filtered.filter(event =>
        (new Date(event.start) >= sDate && new Date(event.start) <= eDate) ||
        (new Date(event.end) >= sDate && new Date(event.end) <= eDate) ||
        (new Date(event.start) <= sDate && new Date(event.end) >= eDate)
      );
    }
    setFilteredEvents(filtered);
  }, [typeFilter, startDate, endDate, allBookings]);

  const handleBlockDate = async (slotInfo) => {
    const date = slotInfo.start;
    const type = prompt('Block for Room or Lawn? (Type "Room" or "Lawn")');
    if (!type || !['Room', 'Lawn'].includes(type.trim())) {
      alert('Invalid type. Please type "Room" or "Lawn".');
      return;
    }
    const reason = prompt('Reason (optional)');
    
    try {
      await addBlockedDate({ date, type: type.trim(), reason });
      alert('Date blocked successfully!');
      fetchBlockedDates().then(setBlocked); // Re-fetch blocked dates to update calendar
    } catch (error) {
      console.error("Error adding blocked date:", error);
      alert('Failed to block date. Please try again.');
    }
  };

  // Custom event styles for react-big-calendar
  const eventPropGetter = (event) => {
    let backgroundColor = '';
    let textColor = 'white';

    // Check if it's a blocked event
    if (event.resource?.blocked) {
      backgroundColor = '#EF4444'; // Tailwind red-500
      textColor = 'white';
    } else {
      // Regular booking events
      switch (event.resource?.type) {
        case 'Room':
          backgroundColor = '#3B82F6'; // Tailwind blue-500
          break;
        case 'Lawn':
          backgroundColor = '#F59E0B'; // Tailwind orange-500
          break;
        default:
          backgroundColor = '#6B7280'; // Tailwind gray-500 (fallback)
      }
    }

    return {
      style: {
        backgroundColor: backgroundColor,
        color: textColor,
        borderRadius: '4px',
        border: 'none',
        padding: '2px 4px', // Slight padding for better visual
        fontSize: '0.75rem', // text-xs
      },
    };
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 bg-white mt-6 rounded-xl shadow-lg animate-fade-in-down">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-center text-green-600 mb-6 sm:mb-8">
        Booking Calendar Overview
      </h2>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 justify-center items-stretch md:items-end mb-6 sm:mb-8">
        <div className="w-full md:w-auto"> {/* Take full width on small screens */}
          <label htmlFor="type-filter" className="block font-semibold text-gray-600 mb-1 text-sm sm:text-base">Filter by Type:</label>
          <select
            id="type-filter"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-3 py-2 sm:px-4 sm:py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 text-sm sm:text-base transition duration-200 ease-in-out hover:border-green-400"
          >
            <option value="All">All</option>
            <option value="Room">Room</option>
            <option value="Lawn">Lawn</option>
          </select>
        </div>

        <div className="w-full md:w-auto"> {/* Take full width on small screens */}
          <label htmlFor="start-date" className="block font-semibold text-gray-600 mb-1 text-sm sm:text-base">From:</label>
          <input
            id="start-date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3 py-2 sm:px-4 sm:py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 text-sm sm:text-base transition duration-200 ease-in-out hover:border-green-400"
          />
        </div>

        <div className="w-full md:w-auto"> {/* Take full width on small screens */}
          <label htmlFor="end-date" className="block font-semibold text-gray-600 mb-1 text-sm sm:text-base">To:</label>
          <input
            id="end-date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-3 py-2 sm:px-4 sm:py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 text-sm sm:text-base transition duration-200 ease-in-out hover:border-green-400"
          />
        </div>
      </div>

      {/* Calendar */}
      <div className="overflow-hidden rounded-md shadow-md border border-gray-200"> {/* Added border */}
        <Calendar
         localizer={localizer}
          events={[...filteredEvents, ...blockedEvents]}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          selectable
          onSelectSlot={handleBlockDate}
          eventPropGetter={(event) => ({
            style: {
              backgroundColor: event.resource?.blocked
                ? 'red'
                : event.resource?.type === 'Room'
                ? '#00aaff'
                : '#ff9900',
              color: 'white',
              borderRadius: '6px',
              border: 'none',
            },
          })}
        />
      </div>
    </div>
  );
};

export default CalendarView;
