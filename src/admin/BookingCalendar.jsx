import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const BookingCalendar = ({ type }) => {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('all');
  const [blockedDates, setBlockedDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  const fetchBookings = async () => {
    const res = await axios.get('/api/bookings');
    const filtered = filter === 'all'
      ? res.data
      : res.data.filter(booking => booking.type.toLowerCase() === filter);

    const mapped = filtered.map((b) => ({
      title: `${b.type}: ${b.type === 'Room' ? b.roomId : b.slot}`,
      start: b.checkIn,
      end: b.checkOut,
      backgroundColor: b.status === 'confirmed' ? 'green' :
                       b.status === 'pending' ? 'orange' :
                       'red',
      borderColor: 'black',
    }));

    setEvents(mapped);
  };

  useEffect(() => {
    fetch(`/api/blocked-dates?type=${type}`)
      .then(res => res.json())
      .then(data => {
        const dates = data.map(d => new Date(d.date));
        setBlockedDates(dates);
      });
  }, [type]);

  useEffect(() => {
    fetchBookings();
  }, [filter, type]);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white mt-6 rounded-2xl shadow-xl animate-fade-in-down">
      <h2 className="text-3xl font-bold text-center text-green-600 mb-6">Booking Calendar</h2>

      {/* Filter Dropdown */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="w-full md:w-auto">
          <label className="block text-gray-700 font-semibold mb-1">Filter by Type</label>
          <select
            onChange={(e) => setFilter(e.target.value)}
            value={filter}
            className="w-full md:w-48 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <option value="all">All</option>
            <option value="Room">Room</option>
            <option value="Lawn">Lawn</option>
          </select>
        </div>

        {/* Date Picker */}
        <div className="w-full md:w-auto">
          <label className="block text-gray-700 font-semibold mb-1">Select Date</label>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            excludeDates={blockedDates}
            placeholderText="Select booking date"
            minDate={new Date()}
            className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>
      </div>

      {/* FullCalendar */}
      <div className="overflow-hidden rounded-lg shadow">
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={events}
          height="auto"
        />
      </div>
    </div>
  );
};

export default BookingCalendar;


// import React, { useEffect, useState } from 'react';
// import FullCalendar from '@fullcalendar/react';
// import dayGridPlugin from '@fullcalendar/daygrid';
// import axios from 'axios';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';

// const BookingCalendar = ({ type }) => {
//   const [events, setEvents] = useState([]);
//   const [filter, setFilter] = useState('all');
//   const [blockedDates, setBlockedDates] = useState([]);
//   const [selectedDate, setSelectedDate] = useState(null);  // To track selected date

//   // Fetch bookings
//   const fetchBookings = async () => {
//     const res = await axios.get('/api/bookings');  // Adjust path if necessary
//     const filtered = filter === 'all'
//       ? res.data
//       : res.data.filter(booking => booking.type.toLowerCase() === filter);

//     const mapped = filtered.map((b) => ({
//       title: `${b.type}: ${b.type === 'Room' ? b.roomId : b.slot}`,
//       start: b.checkIn,
//       end: b.checkOut,
//       backgroundColor: b.status === 'confirmed' ? 'green' :
//                        b.status === 'pending' ? 'orange' :
//                        'red',
//       borderColor: 'black',
//     }));

//     setEvents(mapped);
//   };

//   // Fetch blocked dates
//   useEffect(() => {
//     fetch(`/api/blocked-dates?type=${type}`)
//       .then(res => res.json())
//       .then(data => {
//         const dates = data.map(d => new Date(d.date));
//         setBlockedDates(dates);
//       });
//   }, [type]);

//   // Fetch bookings whenever the filter or type changes
//   useEffect(() => {
//     fetchBookings();
//   }, [filter, type]);

//   return (
//     <div>
//       <h2>Booking Calendar</h2>

//       {/* Filter Dropdown */}
//       <label>Filter by type: </label>
//       <select onChange={(e) => setFilter(e.target.value)} value={filter}>
//         <option value="all">All</option>
//         <option value="Room">Room</option>
//         <option value="Lawn">Lawn</option>
//       </select>

//       {/* Date Picker for selecting a date */}
//       <div style={{ marginTop: '20px' }}>
//         <label>Select Date: </label>
//         <DatePicker
//   selected={selectedDate}
//   onChange={(date) => setSelectedDate(date)}
//   excludeDates={blockedDates}
//   placeholderText="Select booking date"
//   minDate={new Date()}
// />
//       </div>

//       {/* FullCalendar with the events */}
//       <div style={{ marginTop: '20px' }}>
//         <FullCalendar
//           plugins={[dayGridPlugin]}
//           initialView="dayGridMonth"
//           events={events}
//           height="auto"
//         />
//       </div>
//     </div>
//   );
// };

// export default BookingCalendar;
