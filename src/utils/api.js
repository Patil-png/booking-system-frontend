import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export const createBooking = async (bookingData) => {
  const res = await API.post('/bookings', bookingData);
  return res.data;
};

export const fetchBookings = async () => {
  const res = await API.get('/bookings');
  return res.data;
};

export const fetchStats = async () => {
  const res = await fetch('http://localhost:5000/api/bookings/stats');
  if (!res.ok) throw new Error('Failed to fetch stats');
  return res.json();
};


// ✅ FIXED ROUTE HERE:
export const fetchBlockedDates = async (type = 'Room') => {
  const res = await API.get(`/blocked-dates?type=${type}`);
  return res.data.map(b => ({
    title: `BLOCKED - ${b.type}`,
    start: new Date(b.date),
    end: new Date(b.date),
    allDay: true,
    resource: { ...b, blocked: true }
  }));
};

// ✅ FIXED ROUTE HERE:
export const addBlockedDate = async (data) => {
  return await API.post('/blocked-dates', data);
};

export const deleteBlockedDate = async (id) => {
  return await API.delete(`/blocked-dates/${id}`);
};


// import axios from 'axios';

// const API = axios.create({
//   baseURL: 'http://localhost:5000/api', // ✅ your backend server
// });

// export const createBooking = async (bookingData) => {
//   try {
//     const res = await API.post('/bookings', bookingData);
//     return res.data;
//   } catch (err) {
//     console.error('Booking failed:', err);
//     throw err;
//   }
// };

// export const fetchBookings = async () => {
//   try {
//     const res = await API.get('/bookings');
//     return res.data;
//   } catch (err) {
//     console.error('Fetching bookings failed:', err);
//     return [];
//   }
// };

// export const fetchStats = async () => {
//   try {
//     const res = await API.get('/bookings/stats');
//     return res.data;
//   } catch (err) {
//     console.error('Failed to fetch dashboard stats:', err);
//     return {};
//   }
// };

// export const fetchBlockedDates = async () => {
//   const res = await API.get('/blocked-dates'); // ✅ Fixed
//   return res.data.map(b => ({
//     title: `BLOCKED - ${b.type}`,
//     start: new Date(b.date),
//     end: new Date(b.date),
//     allDay: true,
//     resource: { ...b, blocked: true }
//   }));
// };

// export const addBlockedDate = async (data) => {
//   return await API.post('/blocked-dates', data); // ✅ Fixed
// };
