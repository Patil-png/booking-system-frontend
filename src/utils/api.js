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
  const res = await API.get('/bookings/stats');
  return res.data;
};

export const approveBooking = async (bookingId) => {
  const res = await API.put(`/bookings/approve/${bookingId}`);
  return res.data;
};

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

export const addBlockedDate = async (data) => {
  return await API.post('/blocked-dates', data);
};

export const deleteBlockedDate = async (id) => {
  return await API.delete(`/blocked-dates/${id}`);
};

export const markBookingPaid = async ({ bookingId, paymentId, amount }) => {
  const res = await API.put('/bookings/payment-success', {
    bookingId,
    paymentId,
    amount,
  });
  return res.data;
};

export const sendInvoiceEmail = async (bookingData) => {
  const res = await API.post('/bookings/send-confirmation-email', bookingData);
  return res.data;
};

