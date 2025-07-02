import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createBooking } from '../../src/utils/api';
import { generateInvoice } from '../../src/utils/invoiceGenerator';

const AdminCustomBooking = () => {
  const [formData, setFormData] = useState({
    roomId: '',
    adults: 1,
    children: 0,
    checkIn: '',
    checkOut: '',
    email: '',
    phone: '',
  });

  const [availableRooms, setAvailableRooms] = useState([]);
  const [blockedDates, setBlockedDates] = useState([]);
  const [paymentMode, setPaymentMode] = useState('Online');
  const [statusMessage, setStatusMessage] = useState({ type: '', message: '' });

  const selectedRoom = availableRooms.find(r => r._id === formData.roomId);
  const selectedRoomPrice = selectedRoom?.price || 0;
  const API = import.meta.env.VITE_API_BASE_URL;

  const calculateDays = () => {
    const checkIn = new Date(formData.checkIn);
    const checkOut = new Date(formData.checkOut);
    if (checkOut <= checkIn) return 1;
    const diffTime = checkOut - checkIn;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const totalAmount = selectedRoomPrice * calculateDays();
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchBlockedDates = async () => {
      const res = await fetch(`${API}/api/blocked-dates?type=Room`);
      const data = await res.json();
      const converted = data.map(d => new Date(d.date).toISOString().split('T')[0]);
      setBlockedDates(converted);
    };
    fetchBlockedDates();
  }, []);

  useEffect(() => {
    const fetchRoomOptions = async () => {
      const res = await fetch(`${API}/api/options`);
      const data = await res.json();
      const rooms = Array.isArray(data) ? data.filter(item => item.type === 'Room') : data.rooms || [];
      setAvailableRooms(rooms);
      if (rooms.length && !formData.roomId) {
        setFormData(prev => ({ ...prev, roomId: rooms[0]._id }));
      }
    };
    fetchRoomOptions();
  }, [formData.roomId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      setFormData({ ...formData, [name]: value.replace(/\D/g, '').slice(0, 10) });
    } else if (name === 'adults' || name === 'children') {
      const n = parseInt(value) || 0;
      if ((name === 'adults' ? n : formData.adults) + (name === 'children' ? n : formData.children) > 5) {
        setStatusMessage({ type: 'error', message: '⚠️ Max 5 guests allowed.' });
        return;
      }
      setFormData({ ...formData, [name]: n });
      setStatusMessage({ type: '', message: '' });
    } else if (name === 'checkIn' || name === 'checkOut') {
      if (blockedDates.includes(value)) {
        setStatusMessage({ type: 'error', message: `⚠️ ${value} is blocked.` });
        return;
      }
      setFormData({ ...formData, [name]: value });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleOfflineBooking = async () => {
    const normalizedCheckIn = new Date(formData.checkIn).toISOString().split('T')[0];
    const normalizedCheckOut = new Date(formData.checkOut).toISOString().split('T')[0];

    try {
      await createBooking({
        ...formData,
        checkIn: normalizedCheckIn,
        checkOut: normalizedCheckOut,
        type: 'Room',
        amount: totalAmount,
        paymentId: 'OFFLINE',
      });

      generateInvoice({
        bookingType: 'Room',
        formData: { ...formData, checkIn: normalizedCheckIn, checkOut: normalizedCheckOut },
        price: totalAmount,
        paymentId: 'OFFLINE',
      });

      setStatusMessage({ type: 'success', message: '✅ Offline booking successful!' });
    } catch (error) {
      setStatusMessage({ type: 'error', message: `❌ Booking failed: ${error.message}` });
    }
  };

  const handleOnlinePayment = async () => {
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      setStatusMessage({ type: 'error', message: '❌ Razorpay failed to load.' });
      return;
    }

    const normalizedCheckIn = new Date(formData.checkIn).toISOString().split('T')[0];
    const normalizedCheckOut = new Date(formData.checkOut).toISOString().split('T')[0];

    try {
      const res = await fetch(`${API}/api/razorpay/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: totalAmount }),
      });

      const { order } = await res.json();
      if (!order?.id) {
        setStatusMessage({ type: 'error', message: 'Order creation failed.' });
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "Hotel Booking (Admin)",
        description: "Room Reservation",
        order_id: order.id,
        handler: async (response) => {
          try {
            await createBooking({
              ...formData,
              checkIn: normalizedCheckIn,
              checkOut: normalizedCheckOut,
              type: 'Room',
              amount: totalAmount,
              paymentId: response.razorpay_payment_id,
            });

            generateInvoice({
              bookingType: 'Room',
              formData: { ...formData, checkIn: normalizedCheckIn, checkOut: normalizedCheckOut },
              price: totalAmount,
              paymentId: response.razorpay_payment_id,
            });

            setStatusMessage({ type: 'success', message: "✅ Online booking successful!" });
          } catch (error) {
            setStatusMessage({ type: 'error', message: `❌ Booking failed after payment: ${error.message}` });
          }
        },
        prefill: {
          name: formData.email,
          email: formData.email,
          contact: formData.phone,
        },
        theme: { color: "#1e40af" },
      };

      new window.Razorpay(options).open();
    } catch (error) {
      setStatusMessage({ type: 'error', message: `❌ Payment initiation failed: ${error.message}` });
    }
  };

  const handleSubmit = () => {
    if (!formData.roomId || !formData.checkIn || !formData.checkOut || !formData.email || !formData.phone) {
      setStatusMessage({ type: 'error', message: 'Please fill in all required fields.' });
      return;
    }
    if (new Date(formData.checkOut) <= new Date(formData.checkIn)) {
      setStatusMessage({ type: 'error', message: 'Check-out date must be after check-in date.' });
      return;
    }
    if (totalAmount <= 0) {
      setStatusMessage({ type: 'error', message: 'Total amount cannot be zero. Please select a valid room and dates.' });
      return;
    }

    if (paymentMode === 'Offline') handleOfflineBooking();
    else handleOnlinePayment();
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  };

  const buttonVariants = {
    hover: { scale: 1.05, boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.2)" },
    tap: { scale: 0.95 },
  };

  return (
    <motion.div className="p-6 max-w-2xl mx-auto bg-white shadow-2xl rounded-xl border border-blue-200 mt-8" variants={containerVariants} initial="hidden" animate="visible">
      <motion.h2 className="text-3xl font-extrabold mb-6 text-blue-900 text-center" variants={itemVariants}>
        Admin Room Booking
      </motion.h2>

      <AnimatePresence>
        {statusMessage.message && (
          <motion.div
            className={`p-4 mb-5 rounded-lg flex items-center justify-center font-medium ${statusMessage.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}
            initial={{ opacity: 0, y: -30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {statusMessage.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-6">
        {/* Dropdowns and Inputs */}
        <motion.div variants={itemVariants}>
          <label htmlFor="roomId" className="block text-gray-700 text-sm font-bold mb-2">Room Type</label>
          <select id="roomId" className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out" name="roomId" value={formData.roomId} onChange={handleChange}>
            {availableRooms.length > 0 ? (
              availableRooms.map((room) => (
                <option key={room._id} value={room._id}>
                  {room.name} - ₹{room.price} per night
                </option>
              ))
            ) : (
              <option value="">Loading Rooms...</option>
            )}
          </select>
        </motion.div>

        <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6" variants={itemVariants}>
          <div>
            <label htmlFor="adults" className="block text-gray-700 text-sm font-bold mb-2">Adults</label>
            <input type="number" id="adults" name="adults" value={formData.adults} onChange={handleChange} min="1" className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out" />
          </div>
          <div>
            <label htmlFor="children" className="block text-gray-700 text-sm font-bold mb-2">Children</label>
            <input type="number" id="children" name="children" value={formData.children} onChange={handleChange} min="0" className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out" />
          </div>
        </motion.div>

        <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6" variants={itemVariants}>
          <div>
            <label htmlFor="checkIn" className="block text-gray-700 text-sm font-bold mb-2">Check-In Date</label>
            <input type="date" id="checkIn" name="checkIn" value={formData.checkIn} min={today} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out" />
          </div>
          <div>
            <label htmlFor="checkOut" className="block text-gray-700 text-sm font-bold mb-2">Check-Out Date</label>
            <input type="date" id="checkOut" name="checkOut" value={formData.checkOut} min={formData.checkIn || today} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out" />
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Guest Email</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out" placeholder="e.g., example@email.com" />
        </motion.div>
        <motion.div variants={itemVariants}>
          <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">Guest Phone Number</label>
          <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out" maxLength="10" placeholder="e.g., 9876543210" />
        </motion.div>

        <motion.div variants={itemVariants}>
          <label htmlFor="paymentMode" className="block text-gray-700 text-sm font-bold mb-2">Payment Mode</label>
          <select id="paymentMode" value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out">
            <option value="Online">Online (Razorpay)</option>
            <option value="Offline">Offline (Cash/Card)</option>
          </select>
        </motion.div>

        <motion.div variants={itemVariants} className="text-right pt-2">
          <p className="text-xl font-extrabold text-blue-900">Total Amount: <span className="text-green-600">₹{totalAmount.toFixed(2)}</span></p>
        </motion.div>

        <motion.button
          onClick={handleSubmit}
          className="bg-gradient-to-r from-blue-700 to-blue-900 text-white w-full py-3 rounded-lg font-bold text-lg tracking-wide hover:from-blue-800 hover:to-blue-950 focus:outline-none focus:ring-4 focus:ring-blue-300 active:bg-blue-700 transition duration-300 ease-in-out transform origin-center"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          {paymentMode === 'Offline' ? `Confirm Offline Booking` : `Proceed to Online Payment`}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default AdminCustomBooking;