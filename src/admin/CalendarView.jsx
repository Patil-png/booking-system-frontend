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
        end: new Date(b.checkOut || b.checkIn),
        allDay: true,
        resource: b,
      }));
      setAllBookings(mapped);
      setFilteredEvents(mapped);
    });
  }, []);

  useEffect(() => {
    fetchBlockedDates().then(setBlocked);
  }, []);

  useEffect(() => {
    let filtered = allBookings;
    if (typeFilter !== 'All') {
      filtered = filtered.filter(event => event.resource.type === typeFilter);
    }
    if (startDate && endDate) {
      const sDate = new Date(startDate);
      const eDate = new Date(endDate);
      filtered = filtered.filter(event =>
        isWithinInterval(new Date(event.start), { start: sDate, end: eDate })
      );
    }
    setFilteredEvents(filtered);
  }, [typeFilter, startDate, endDate, allBookings]);

  const handleBlockDate = async (slotInfo) => {
    const date = slotInfo.start;
    const type = prompt('Block for Room or Lawn?');
    const reason = prompt('Reason (optional)');
    if (!['Room', 'Lawn'].includes(type)) return;

    await addBlockedDate({ date, type, reason });
    alert('Date blocked!');
    fetchBlockedDates().then(setBlocked);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white mt-6 rounded-xl shadow-lg animate-fade-in-down">
      <h2 className="text-3xl font-bold text-center text-green-600 mb-6">Booking Calendar</h2>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
        <div>
          <label className="block font-semibold text-gray-600 mb-1">Filter by Type:</label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <option value="All">All</option>
            <option value="Room">Room</option>
            <option value="Lawn">Lawn</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold text-gray-600 mb-1">From:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm"
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-600 mb-1">To:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm"
          />
        </div>
      </div>

      {/* Calendar */}
      <div className="overflow-hidden rounded-md shadow-md">
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


// import React, { useEffect, useState } from 'react';
// import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
// import 'react-big-calendar/lib/css/react-big-calendar.css';
// import { format, parse, startOfWeek, getDay, isWithinInterval } from 'date-fns';
// import { fetchBookings, fetchBlockedDates, addBlockedDate } from '../utils/api';

// // ESM import for the locale
// import enUS from 'date-fns/locale/en-US';

// const locales = {
//   'en-US': enUS, // Use ESM import here
// };

// const localizer = dateFnsLocalizer({
//   format,
//   parse,
//   startOfWeek,
//   getDay,
//   locales,
// });

// const CalendarView = () => {
//   const [allBookings, setAllBookings] = useState([]);
//   const [filteredEvents, setFilteredEvents] = useState([]);
//   const [typeFilter, setTypeFilter] = useState('All');
//   const [startDate, setStartDate] = useState('');
//   const [endDate, setEndDate] = useState('');
//   const [blockedEvents, setBlocked] = useState([]);

//   // Fetch bookings on component mount
//   useEffect(() => {
//     fetchBookings().then(bookings => {
//       const mapped = bookings.map(b => ({
//         title: `${b.type} - ₹${b.amount}`,
//         start: new Date(b.checkIn),
//         end: new Date(b.checkOut || b.checkIn),
//         allDay: true,
//         resource: b,
//       }));
//       setAllBookings(mapped);
//       setFilteredEvents(mapped); // Default to all bookings
//     });
//   }, []);

//   // Fetch blocked dates on component mount
//   useEffect(() => {
//     fetchBlockedDates().then(setBlocked);
//   }, []);

//   // Filter events based on type and date range
//   useEffect(() => {
//     let filtered = allBookings;

//     if (typeFilter !== 'All') {
//       filtered = filtered.filter(event => event.resource.type === typeFilter);
//     }

//     if (startDate && endDate) {
//       const sDate = new Date(startDate);
//       const eDate = new Date(endDate);
//       filtered = filtered.filter(event =>
//         isWithinInterval(new Date(event.start), { start: sDate, end: eDate })
//       );
//     }

//     setFilteredEvents(filtered);
//   }, [typeFilter, startDate, endDate, allBookings]);

//   // Handle blocking a date (Room/Lawn)
//   const handleBlockDate = async (slotInfo) => {
//     const date = slotInfo.start;
//     const type = prompt('Block for Room or Lawn?');
//     const reason = prompt('Reason (optional)');
//     if (!['Room', 'Lawn'].includes(type)) return;

//     await addBlockedDate({ date, type, reason });
//     alert('Date blocked!');
//     fetchBlockedDates().then(setBlocked); // Refresh blocked dates
//   };

//   return (
//     <div>
//       <h2>Booking Calendar</h2>

//       {/* Filters */}
//       <div style={{ marginBottom: '20px' }}>
//         <label>Filter by Type: </label>
//         <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
//           <option value="All">All</option>
//           <option value="Room">Room</option>
//           <option value="Lawn">Lawn</option>
//         </select>

//         &nbsp;&nbsp;

//         <label>From: </label>
//         <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />

//         &nbsp;

//         <label>To: </label>
//         <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
//       </div>

//       {/* Calendar */}
//       <Calendar
//         localizer={localizer}
//         events={[...filteredEvents, ...blockedEvents]} // Merge filtered and blocked events
//         startAccessor="start"
//         endAccessor="end"
//         style={{ height: 500 }}
//         selectable
//         onSelectSlot={handleBlockDate} // Handle block date on select
//         eventPropGetter={(event) => ({
//           style: {
//             backgroundColor: event.resource?.blocked ? 'red' : 
//               event.resource.type === 'Room' ? '#00aaff' : '#ff9900',
//             color: 'white',
//           },
//         })}
//       />
//     </div>
//   );
// };

// export default CalendarView;
