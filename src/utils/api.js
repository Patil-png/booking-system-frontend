import axios from 'axios';

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
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
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/bookings/stats`);
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
