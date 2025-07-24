import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createBooking } from '../../src/utils/api';
import { generateInvoice } from '../../src/utils/invoiceGenerator';
import { useNavigate } from 'react-router-dom';
import { sendInvoiceEmail } from '../utils/api';
const AdminCustomBooking = () => {
  const navigate = useNavigate();
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
  const maxMembers = selectedRoom?.members || 5;
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
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/blocked-dates?type=Room`);
        if (!res.ok) throw new Error('Failed to fetch blocked dates');
        const data = await res.json();
        const converted = data.map(d => new Date(d.date).toISOString().split('T')[0]);
        setBlockedDates(converted);
      } catch (error) {
        console.error("Error fetching blocked dates:", error);
        setStatusMessage({ type: 'error', message: 'Failed to load blocked dates.' });
      }
    };
    fetchBlockedDates();
  }, []);
  useEffect(() => {
    const fetchRoomOptions = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/options`);
        if (!res.ok) throw new Error('Failed to fetch room options');
        const data = await res.json();
        const rooms = Array.isArray(data) ? data.filter(item => item.type === 'Room') : data.rooms || [];
        setAvailableRooms(rooms);
        if (rooms.length && !formData.roomId) {
          setFormData(prev => ({ ...prev, roomId: rooms[0]._id }));
        }
      } catch (error) {
        console.error("Error fetching room options:", error);
        setStatusMessage({ type: 'error', message: 'Failed to load room options.' });
      }
    };
    fetchRoomOptions();
  }, [formData.roomId]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      setFormData({ ...formData, [name]: value.replace(/\D/g, '').slice(0, 10) });
      return;
    }
    if (name === 'adults' || name === 'children') {
      const newAdults = name === 'adults' ? parseInt(value) || 0 : formData.adults;
      const newChildren = name === 'children' ? parseInt(value) || 0 : formData.children;
      const total = newAdults + newChildren;
      if (total > maxMembers) {
        setStatusMessage({ type: 'error', message: `⚠️ Max ${maxMembers} guests allowed for this room.` });
        return;
      }
      setFormData({ ...formData, [name]: parseInt(value) || 0 });
      setStatusMessage({ type: '', message: '' });
      return;
    }
    if (name === 'checkIn' || name === 'checkOut') {
      if (blockedDates.includes(value)) {
        setStatusMessage({ type: 'error', message: `⚠️ ${value} is blocked.` });
        return;
      } else {
        setStatusMessage({ type: '', message: '' });
      }
    }
    setFormData({ ...formData, [name]: value });
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
      await sendInvoiceEmail({
        ...formData,
        checkIn: normalizedCheckIn,
        checkOut: normalizedCheckOut,
        amount: totalAmount,
        paymentId: 'OFFLINE',
        type: 'Room',
      });
      setStatusMessage({ type: 'success', message: '✅ Offline booking successful! Invoice generated.' });
      setFormData({
        roomId: availableRooms.length > 0 ? availableRooms[0]._id : '',
        adults: 1,
        children: 0,
        checkIn: '',
        checkOut: '',
        email: '',
        phone: '',
      });
    } catch (error) {
      setStatusMessage({ type: 'error', message: `❌ Booking failed: ${error.message}` });
    }
  };
  const handleOnlinePayment = async () => {
    setStatusMessage({ type: '', message: '' });
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      setStatusMessage({ type: 'error', message: '❌ Razorpay failed to load. Please try again.' });
      return;
    }
    const normalizedCheckIn = new Date(formData.checkIn).toISOString().split('T')[0];
    const normalizedCheckOut = new Date(formData.checkOut).toISOString().split('T')[0];
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/razorpay/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: totalAmount }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to create Razorpay order.');
      }
      const { order } = await res.json();
      if (!order?.id) {
        setStatusMessage({ type: 'error', message: 'Order creation failed: No order ID received.' });
        return;
      }
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "Hotel Booking (Admin)",
        description: `Room Reservation for ${formData.email}`,
        order_id: order.id,
        handler: async (response) => {
          try {
            await createBooking({
              ...formData,
              checkIn: normalizedCheckIn,
              checkOut: normalizedCheckOut,
              type: 'Room',
              amount: totalAmount,
              paymentId: 'OFFLINE',
              createdByAdmin: true,
            });
            generateInvoice({
              bookingType: 'Room',
              formData: { ...formData, checkIn: normalizedCheckIn, checkOut: normalizedCheckOut },
              price: totalAmount,
              paymentId: response.razorpay_payment_id,
            });
            setStatusMessage({ type: 'success', message: "✅ Online booking successful! Invoice generated." });
            setFormData({
              roomId: availableRooms.length > 0 ? availableRooms[0]._id : '',
              adults: 1,
              children: 0,
              checkIn: '',
              checkOut: '',
              email: '',
              phone: '',
            });
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
      const rzp1 = new window.Razorpay(options);
      rzp1.on('razorpay.payment.failed', function (response){
        setStatusMessage({ type: 'error', message: `❌ Payment failed: ${response.error.description}` });
      });
      rzp1.open();
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
    if (formData.phone.length !== 10) {
      setStatusMessage({ type: 'error', message: 'Please enter a valid 10-digit phone number.' });
      return;
    }
    const checkInDate = formData.checkIn;
    const checkOutDate = formData.checkOut;
    if (blockedDates.includes(checkInDate)) {
      setStatusMessage({ type: 'error', message: `⚠️ Check-in date ${checkInDate} is blocked.` });
      return;
    }
    if (blockedDates.includes(checkOutDate)) {
      setStatusMessage({ type: 'error', message: `⚠️ Check-out date ${checkOutDate} is blocked.` });
      return;
    }
    if (paymentMode === 'Offline') handleOfflineBooking();
    else handleOnlinePayment();
  };
  const containerVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
        when: "beforeChildren",
        staggerChildren: 0.12
      }
    },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 25, scale: 0.98 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        duration: 0.6, 
        ease: [0.25, 0.46, 0.45, 0.94] 
      } 
    },
  };
  const buttonVariants = {
    hover: { 
      scale: 1.03, 
      boxShadow: "0px 15px 35px rgba(59, 130, 246, 0.4)",
      transition: { duration: 0.3 }
    },
    tap: { scale: 0.97 },
  };
  const pulseVariants = {
    pulse: {
      scale: [1, 1.02, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <motion.div
        className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl border border-white/20 overflow-hidden"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 p-4 sm:p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <motion.h2 
              className="text-xl sm:text-2xl font-bold text-white text-center"
              variants={itemVariants}
            >
              🏨 Admin Room Booking
            </motion.h2>
            <motion.p 
              className="text-xs sm:text-sm text-blue-100 text-center mt-1"
              variants={itemVariants}
            >
              Create custom bookings with ease
            </motion.p>
          </div>
        </div>
        {/* Content Section */}
        <div className="p-4 sm:p-6 lg:p-8">
          <AnimatePresence>
            {statusMessage.message && (
              <motion.div
                className={`p-2 sm:p-3 mb-4 sm:mb-6 rounded-2xl flex items-center justify-center text-xs sm:text-sm font-medium border-2 ${
                  statusMessage.type === 'success' 
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200 shadow-emerald-100' 
                    : 'bg-red-50 text-red-800 border-red-200 shadow-red-100'
                } shadow-lg`}
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  {statusMessage.type === 'success' ? (
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-red-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                  )}
                  {statusMessage.message}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="space-y-4 sm:space-y-6">
            {/* Room Selection */}
            <motion.div variants={itemVariants} className="space-y-2 sm:space-y-3">
              <label htmlFor="roomId" className="block text-gray-800 text-xs sm:text-sm font-bold flex items-center gap-1 sm:gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Room Type
              </label>
              <select
                id="roomId"
                className="w-full p-2 sm:p-4 border-2 border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-xs sm:text-sm bg-white hover:shadow-md"
                name="roomId"
                value={formData.roomId}
                onChange={handleChange}
              >
                {availableRooms.length > 0 ? (
                  availableRooms.map((room) => (
                    <option key={room._id} value={room._id} className="text-xs sm:text-sm">
                      {room.name} - ₹{room.price} per night
                    </option>
                  ))
                ) : (
                  <option value="">Loading Rooms...</option>
                )}
              </select>
            </motion.div>
            {/* Guest Count */}
            <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6" variants={itemVariants}>
              <div className="space-y-2 sm:space-y-3">
                <label htmlFor="adults" className="block text-gray-800 text-xs sm:text-sm font-bold flex items-center gap-1 sm:gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Adults
                </label>
                <input
                  type="number"
                  id="adults"
                  name="adults"
                  value={formData.adults}
                  onChange={handleChange}
                  min="1"
                  className="w-full p-2 sm:p-4 border-2 border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-xs sm:text-sm bg-white hover:shadow-md"
                  autoComplete="off"
                />
              </div>
              <div className="space-y-2 sm:space-y-3">
                <label htmlFor="children" className="block text-gray-800 text-xs sm:text-sm font-bold flex items-center gap-1 sm:gap-2">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                  Children
                </label>
                <input
                  type="number"
                  id="children"
                  name="children"
                  value={formData.children}
                  onChange={handleChange}
                  min="0"
                  className="w-full p-2 sm:p-4 border-2 border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-xs sm:text-sm bg-white hover:shadow-md"
                  autoComplete="off"
                />
              </div>
            </motion.div>
            {/* Dates */}
            <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6" variants={itemVariants}>
              <div className="space-y-2 sm:space-y-3">
                <label htmlFor="checkIn" className="block text-gray-800 text-xs sm:text-sm font-bold flex items-center gap-1 sm:gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  Check-In Date
                </label>
                <input
                  type="date"
                  id="checkIn"
                  name="checkIn"
                  value={formData.checkIn}
                  min={today}
                  onChange={handleChange}
                  className="w-full p-2 sm:p-4 border-2 border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-xs sm:text-sm bg-white hover:shadow-md"
                  autoComplete="off"
                />
              </div>
              <div className="space-y-2 sm:space-y-3">
                <label htmlFor="checkOut" className="block text-gray-800 text-xs sm:text-sm font-bold flex items-center gap-1 sm:gap-2">
                  <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
                  Check-Out Date
                </label>
                <input
                  type="date"
                  id="checkOut"
                  name="checkOut"
                  value={formData.checkOut}
                  min={formData.checkIn || today}
                  onChange={handleChange}
                  className="w-full p-2 sm:p-4 border-2 border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-xs sm:text-sm bg-white hover:shadow-md"
                  autoComplete="off"
                />
              </div>
            </motion.div>
            {/* Contact Information */}
            <motion.div className="space-y-4 sm:space-y-6" variants={itemVariants}>
              <div className="space-y-2 sm:space-y-3">
                <label htmlFor="email" className="block text-gray-800 text-xs sm:text-sm font-bold flex items-center gap-1 sm:gap-2">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                  Guest Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 sm:p-4 border-2 border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-xs sm:text-sm bg-white hover:shadow-md"
                  placeholder="e.g., guest@email.com"
                  autoComplete="email"
                />
              </div>
              <div className="space-y-2 sm:space-y-3">
                <label htmlFor="phone" className="block text-gray-800 text-xs sm:text-sm font-bold flex items-center gap-1 sm:gap-2">
                  <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
                  Guest Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-2 sm:p-4 border-2 border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-xs sm:text-sm bg-white hover:shadow-md"
                  maxLength="10"
                  placeholder="e.g., 9876543210"
                  autoComplete="tel"
                />
              </div>
            </motion.div>
            {/* Payment Mode */}
            <motion.div variants={itemVariants} className="space-y-2 sm:space-y-3">
              <label className="block text-gray-800 text-xs sm:text-sm font-bold flex items-center gap-1 sm:gap-2">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                Payment Mode
              </label>
              <select
                id="paymentMode"
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
                className="w-full p-2 sm:p-4 border-2 border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-xs sm:text-sm bg-white hover:shadow-md"
              >
                <option value="Online">💳 Online (Razorpay)</option>
                <option value="Offline">💰 Offline (Cash/Card)</option>
              </select>
            </motion.div>
            {/* Total Amount */}
            <motion.div 
              variants={itemVariants} 
              className="bg-gradient-to-r from-emerald-50 to-blue-50 p-3 sm:p-6 rounded-2xl border-2 border-emerald-200"
            >
              <div className="flex items-center justify-between">
                <span className="text-base sm:text-xl font-bold text-gray-700">Total Amount:</span>
                <motion.span 
                  className="text-lg sm:text-3xl font-extrabold text-emerald-600"
                  variants={pulseVariants}
                  animate="pulse"
                >
                  ₹{totalAmount.toFixed(2)}
                </motion.span>
              </div>
              <div className="text-xs text-gray-600 mt-1 sm:mt-2">
                {calculateDays()} night{calculateDays() > 1 ? 's' : ''} × ₹{selectedRoomPrice}
              </div>
            </motion.div>
            {/* Submit Button */}
            <motion.button
              onClick={handleSubmit}
              className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white w-full py-3 sm:py-5 rounded-2xl font-bold text-base sm:text-xl tracking-wide hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 transform shadow-xl relative overflow-hidden group"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              <span className="relative z-10 flex items-center justify-center gap-2 sm:gap-3">
                {paymentMode === 'Offline' ? (
                  <span className="flex items-center justify-center gap-2 xs:gap-2.5 sm:gap-3 text-xs xs:text-sm sm:text-base font-semibold">
                    <svg className="h-4 w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="whitespace-nowrap">Confirm Offline Booking</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2 xs:gap-2.5 sm:gap-3 text-xs xs:text-sm sm:text-base font-semibold">
                    <svg className="h-4 w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="whitespace-nowrap">Proceed to Online Payment</span>
                  </span>
                )}
              </span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
export default AdminCustomBooking;



// import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { createBooking } from '../../src/utils/api';
// import { generateInvoice } from '../../src/utils/invoiceGenerator';
// import { useNavigate } from 'react-router-dom';
// import { sendInvoiceEmail } from '../utils/api';
// const AdminCustomBooking = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     roomId: '',
//     adults: 1,
//     children: 0,
//     checkIn: '',
//     checkOut: '',
//     email: '',
//     phone: '',
//   });
//   const [availableRooms, setAvailableRooms] = useState([]);
//   const [blockedDates, setBlockedDates] = useState([]);
//   const [paymentMode, setPaymentMode] = useState('Online');
//   const [statusMessage, setStatusMessage] = useState({ type: '', message: '' });
//   const selectedRoom = availableRooms.find(r => r._id === formData.roomId);
//   const selectedRoomPrice = selectedRoom?.price || 0;
//   const maxMembers = selectedRoom?.members || 5;
//   const calculateDays = () => {
//     const checkIn = new Date(formData.checkIn);
//     const checkOut = new Date(formData.checkOut);
//     if (checkOut <= checkIn) return 1;
//     const diffTime = checkOut - checkIn;
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//     return diffDays > 0 ? diffDays : 1;
//   };
//   const totalAmount = selectedRoomPrice * calculateDays();
//   const today = new Date().toISOString().split('T')[0];
//   useEffect(() => {
//     const fetchBlockedDates = async () => {
//       try {
//         const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/blocked-dates?type=Room`);
//         if (!res.ok) throw new Error('Failed to fetch blocked dates');
//         const data = await res.json();
//         const converted = data.map(d => new Date(d.date).toISOString().split('T')[0]);
//         setBlockedDates(converted);
//       } catch (error) {
//         console.error("Error fetching blocked dates:", error);
//         setStatusMessage({ type: 'error', message: 'Failed to load blocked dates.' });
//       }
//     };
//     fetchBlockedDates();
//   }, []);
//   useEffect(() => {
//     const fetchRoomOptions = async () => {
//       try {
//         const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/options`);
//         if (!res.ok) throw new Error('Failed to fetch room options');
//         const data = await res.json();
//         const rooms = Array.isArray(data) ? data.filter(item => item.type === 'Room') : data.rooms || [];
//         setAvailableRooms(rooms);
//         if (rooms.length && !formData.roomId) {
//           setFormData(prev => ({ ...prev, roomId: rooms[0]._id }));
//         }
//       } catch (error) {
//         console.error("Error fetching room options:", error);
//         setStatusMessage({ type: 'error', message: 'Failed to load room options.' });
//       }
//     };
//     fetchRoomOptions();
//   }, [formData.roomId]);
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     if (name === 'phone') {
//       setFormData({ ...formData, [name]: value.replace(/\D/g, '').slice(0, 10) });
//       return;
//     }
//     if (name === 'adults' || name === 'children') {
//       const newAdults = name === 'adults' ? parseInt(value) || 0 : formData.adults;
//       const newChildren = name === 'children' ? parseInt(value) || 0 : formData.children;
//       const total = newAdults + newChildren;
//       if (total > maxMembers) {
//         setStatusMessage({ type: 'error', message: `⚠️ Max ${maxMembers} guests allowed for this room.` });
//         return;
//       }
//       setFormData({ ...formData, [name]: parseInt(value) || 0 });
//       setStatusMessage({ type: '', message: '' });
//       return;
//     }
//     if (name === 'checkIn' || name === 'checkOut') {
//       if (blockedDates.includes(value)) {
//         setStatusMessage({ type: 'error', message: `⚠️ ${value} is blocked.` });
//         return;
//       } else {
//         setStatusMessage({ type: '', message: '' });
//       }
//     }
//     setFormData({ ...formData, [name]: value });
//   };
//   const loadRazorpayScript = () => {
//     return new Promise((resolve) => {
//       const script = document.createElement("script");
//       script.src = "https://checkout.razorpay.com/v1/checkout.js";
//       script.onload = () => resolve(true);
//       script.onerror = () => resolve(false);
//       document.body.appendChild(script);
//     });
//   };
//   const handleOfflineBooking = async () => {
//     const normalizedCheckIn = new Date(formData.checkIn).toISOString().split('T')[0];
//     const normalizedCheckOut = new Date(formData.checkOut).toISOString().split('T')[0];
//     try {
//       await createBooking({
//         ...formData,
//         checkIn: normalizedCheckIn,
//         checkOut: normalizedCheckOut,
//         type: 'Room',
//         amount: totalAmount,
//         paymentId: 'OFFLINE',
//       });
//       generateInvoice({
//         bookingType: 'Room',
//         formData: { ...formData, checkIn: normalizedCheckIn, checkOut: normalizedCheckOut },
//         price: totalAmount,
//         paymentId: 'OFFLINE',
//       });
//       await sendInvoiceEmail({
//         ...formData,
//         checkIn: normalizedCheckIn,
//         checkOut: normalizedCheckOut,
//         amount: totalAmount,
//         paymentId: 'OFFLINE',
//         type: 'Room',
//       });
//       setStatusMessage({ type: 'success', message: '✅ Offline booking successful! Invoice generated.' });
//       setFormData({
//         roomId: availableRooms.length > 0 ? availableRooms[0]._id : '',
//         adults: 1,
//         children: 0,
//         checkIn: '',
//         checkOut: '',
//         email: '',
//         phone: '',
//       });
//     } catch (error) {
//       setStatusMessage({ type: 'error', message: `❌ Booking failed: ${error.message}` });
//     }
//   };
//   const handleOnlinePayment = async () => {
//     setStatusMessage({ type: '', message: '' });
//     const loaded = await loadRazorpayScript();
//     if (!loaded) {
//       setStatusMessage({ type: 'error', message: '❌ Razorpay failed to load. Please try again.' });
//       return;
//     }
//     const normalizedCheckIn = new Date(formData.checkIn).toISOString().split('T')[0];
//     const normalizedCheckOut = new Date(formData.checkOut).toISOString().split('T')[0];
//     try {
//       const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/razorpay/create-order`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ amount: totalAmount }),
//       });
//       if (!res.ok) {
//         const errorData = await res.json();
//         throw new Error(errorData.error || 'Failed to create Razorpay order.');
//       }
//       const { order } = await res.json();
//       if (!order?.id) {
//         setStatusMessage({ type: 'error', message: 'Order creation failed: No order ID received.' });
//         return;
//       }
//       const options = {
//         key: import.meta.env.VITE_RAZORPAY_KEY_ID,
//         amount: order.amount,
//         currency: "INR",
//         name: "Hotel Booking (Admin)",
//         description: `Room Reservation for ${formData.email}`,
//         order_id: order.id,
//         handler: async (response) => {
//           try {
//             await createBooking({
//               ...formData,
//               checkIn: normalizedCheckIn,
//               checkOut: normalizedCheckOut,
//               type: 'Room',
//               amount: totalAmount,
//               paymentId: 'OFFLINE',
//               createdByAdmin: true,
//             });
//             generateInvoice({
//               bookingType: 'Room',
//               formData: { ...formData, checkIn: normalizedCheckIn, checkOut: normalizedCheckOut },
//               price: totalAmount,
//               paymentId: response.razorpay_payment_id,
//             });
//             setStatusMessage({ type: 'success', message: "✅ Online booking successful! Invoice generated." });
//             setFormData({
//               roomId: availableRooms.length > 0 ? availableRooms[0]._id : '',
//               adults: 1,
//               children: 0,
//               checkIn: '',
//               checkOut: '',
//               email: '',
//               phone: '',
//             });
//           } catch (error) {
//             setStatusMessage({ type: 'error', message: `❌ Booking failed after payment: ${error.message}` });
//           }
//         },
//         prefill: {
//           name: formData.email,
//           email: formData.email,
//           contact: formData.phone,
//         },
//         theme: { color: "#1e40af" },
//       };
//       const rzp1 = new window.Razorpay(options);
//       rzp1.on('razorpay.payment.failed', function (response){
//         setStatusMessage({ type: 'error', message: `❌ Payment failed: ${response.error.description}` });
//       });
//       rzp1.open();
//     } catch (error) {
//       setStatusMessage({ type: 'error', message: `❌ Payment initiation failed: ${error.message}` });
//     }
//   };
//   const handleSubmit = () => {
//     if (!formData.roomId || !formData.checkIn || !formData.checkOut || !formData.email || !formData.phone) {
//       setStatusMessage({ type: 'error', message: 'Please fill in all required fields.' });
//       return;
//     }
//     if (new Date(formData.checkOut) <= new Date(formData.checkIn)) {
//       setStatusMessage({ type: 'error', message: 'Check-out date must be after check-in date.' });
//       return;
//     }
//     if (totalAmount <= 0) {
//       setStatusMessage({ type: 'error', message: 'Total amount cannot be zero. Please select a valid room and dates.' });
//       return;
//     }
//     if (formData.phone.length !== 10) {
//       setStatusMessage({ type: 'error', message: 'Please enter a valid 10-digit phone number.' });
//       return;
//     }
//     const checkInDate = formData.checkIn;
//     const checkOutDate = formData.checkOut;
//     if (blockedDates.includes(checkInDate)) {
//       setStatusMessage({ type: 'error', message: `⚠️ Check-in date ${checkInDate} is blocked.` });
//       return;
//     }
//     if (blockedDates.includes(checkOutDate)) {
//       setStatusMessage({ type: 'error', message: `⚠️ Check-out date ${checkOutDate} is blocked.` });
//       return;
//     }
//     if (paymentMode === 'Offline') handleOfflineBooking();
//     else handleOnlinePayment();
//   };
//   const containerVariants = {
//     hidden: { opacity: 0, y: 30, scale: 0.98 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       scale: 1,
//       transition: {
//         duration: 0.8,
//         ease: [0.25, 0.46, 0.45, 0.94],
//         when: "beforeChildren",
//         staggerChildren: 0.12
//       }
//     },
//   };
//   const itemVariants = {
//     hidden: { opacity: 0, y: 25, scale: 0.98 },
//     visible: { 
//       opacity: 1, 
//       y: 0, 
//       scale: 1,
//       transition: { 
//         duration: 0.6, 
//         ease: [0.25, 0.46, 0.45, 0.94] 
//       } 
//     },
//   };
//   const buttonVariants = {
//     hover: { 
//       scale: 1.03, 
//       boxShadow: "0px 15px 35px rgba(59, 130, 246, 0.4)",
//       transition: { duration: 0.3 }
//     },
//     tap: { scale: 0.97 },
//   };
//   const pulseVariants = {
//     pulse: {
//       scale: [1, 1.02, 1],
//       transition: {
//         duration: 2,
//         repeat: Infinity,
//         ease: "easeInOut"
//       }
//     }
//   };
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
//       <motion.div
//         className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl border border-white/20 overflow-hidden"
//         variants={containerVariants}
//         initial="hidden"
//         animate="visible"
//       >
//         {/* Header Section */}
//         <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 p-6 relative overflow-hidden">
//           <div className="absolute inset-0 bg-black/10"></div>
//           <div className="relative z-10">
//             <motion.button
//               onClick={() => navigate(-1)}
//               className="mb-4 inline-flex items-center gap-2 text-white/90 hover:text-white font-medium text-sm transition duration-200 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm"
//               whileHover={{ scale: 1.05, x: -2 }}
//               whileTap={{ scale: 0.95 }}
//             >
//               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//               </svg>
//               Back
//             </motion.button>
//             <motion.h2 
//               className="text-3xl lg:text-4xl font-bold text-white text-center"
//               variants={itemVariants}
//             >
//               🏨 Admin Room Booking
//             </motion.h2>
//             <motion.p 
//               className="text-blue-100 text-center mt-2 text-lg"
//               variants={itemVariants}
//             >
//               Create custom bookings with ease
//             </motion.p>
//           </div>
//         </div>
//         {/* Content Section */}
//         <div className="p-6 lg:p-8">
//           <AnimatePresence>
//             {statusMessage.message && (
//               <motion.div
//                 className={`p-4 mb-6 rounded-2xl flex items-center justify-center text-base font-medium border-2 ${
//                   statusMessage.type === 'success' 
//                     ? 'bg-emerald-50 text-emerald-800 border-emerald-200 shadow-emerald-100' 
//                     : 'bg-red-50 text-red-800 border-red-200 shadow-red-100'
//                 } shadow-lg`}
//                 initial={{ opacity: 0, y: -20, scale: 0.95 }}
//                 animate={{ opacity: 1, y: 0, scale: 1 }}
//                 exit={{ opacity: 0, y: -20, scale: 0.95 }}
//                 transition={{ duration: 0.4, ease: "easeOut" }}
//               >
//                 <div className="flex items-center gap-3">
//                   {statusMessage.type === 'success' ? (
//                     <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
//                       <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                       </svg>
//                     </div>
//                   ) : (
//                     <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
//                       <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                       </svg>
//                     </div>
//                   )}
//                   {statusMessage.message}
//                 </div>
//               </motion.div>
//             )}
//           </AnimatePresence>
//           <div className="space-y-6">
//             {/* Room Selection */}
//             <motion.div variants={itemVariants} className="space-y-3">
//               <label className="block text-gray-800 text-sm font-bold flex items-center gap-2">
//                 <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
//                 Room Type
//               </label>
//               <select
//                 id="roomId"
//                 className="w-full p-4 border-2 border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-lg bg-white hover:shadow-md"
//                 name="roomId"
//                 value={formData.roomId}
//                 onChange={handleChange}
//               >
//                 {availableRooms.length > 0 ? (
//                   availableRooms.map((room) => (
//                     <option key={room._id} value={room._id}>
//                       {room.name} - ₹{room.price} per night
//                     </option>
//                   ))
//                 ) : (
//                   <option value="">Loading Rooms...</option>
//                 )}
//               </select>
//             </motion.div>
//             {/* Guest Count */}
//             <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-6" variants={itemVariants}>
//               <div className="space-y-3">
//                 <label className="block text-gray-800 text-sm font-bold flex items-center gap-2">
//                   <span className="w-2 h-2 bg-green-500 rounded-full"></span>
//                   Adults
//                 </label>
//                 <input
//                   type="number"
//                   id="adults"
//                   name="adults"
//                   value={formData.adults}
//                   onChange={handleChange}
//                   min="1"
//                   className="w-full p-4 border-2 border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-lg bg-white hover:shadow-md"
//                 />
//               </div>
//               <div className="space-y-3">
//                 <label className="block text-gray-800 text-sm font-bold flex items-center gap-2">
//                   <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
//                   Children
//                 </label>
//                 <input
//                   type="number"
//                   id="children"
//                   name="children"
//                   value={formData.children}
//                   onChange={handleChange}
//                   min="0"
//                   className="w-full p-4 border-2 border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-lg bg-white hover:shadow-md"
//                 />
//               </div>
//             </motion.div>
//             {/* Dates */}
//             <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-6" variants={itemVariants}>
//               <div className="space-y-3">
//                 <label className="block text-gray-800 text-sm font-bold flex items-center gap-2">
//                   <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
//                   Check-In Date
//                 </label>
//                 <input
//                   type="date"
//                   id="checkIn"
//                   name="checkIn"
//                   value={formData.checkIn}
//                   min={today}
//                   onChange={handleChange}
//                   className="w-full p-4 border-2 border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-lg bg-white hover:shadow-md"
//                 />
//               </div>
//               <div className="space-y-3">
//                 <label className="block text-gray-800 text-sm font-bold flex items-center gap-2">
//                   <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
//                   Check-Out Date
//                 </label>
//                 <input
//                   type="date"
//                   id="checkOut"
//                   name="checkOut"
//                   value={formData.checkOut}
//                   min={formData.checkIn || today}
//                   onChange={handleChange}
//                   className="w-full p-4 border-2 border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-lg bg-white hover:shadow-md"
//                 />
//               </div>
//             </motion.div>
//             {/* Contact Information */}
//             <motion.div className="space-y-6" variants={itemVariants}>
//               <div className="space-y-3">
//                 <label className="block text-gray-800 text-sm font-bold flex items-center gap-2">
//                   <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
//                   Guest Email
//                 </label>
//                 <input
//                   type="email"
//                   id="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   className="w-full p-4 border-2 border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-lg bg-white hover:shadow-md"
//                   placeholder="e.g., guest@email.com"
//                 />
//               </div>
//               <div className="space-y-3">
//                 <label className="block text-gray-800 text-sm font-bold flex items-center gap-2">
//                   <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
//                   Guest Phone Number
//                 </label>
//                 <input
//                   type="tel"
//                   id="phone"
//                   name="phone"
//                   value={formData.phone}
//                   onChange={handleChange}
//                   className="w-full p-4 border-2 border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-lg bg-white hover:shadow-md"
//                   maxLength="10"
//                   placeholder="e.g., 9876543210"
//                 />
//               </div>
//             </motion.div>
//             {/* Payment Mode */}
//             <motion.div variants={itemVariants} className="space-y-3">
//               <label className="block text-gray-800 text-sm font-bold flex items-center gap-2">
//                 <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
//                 Payment Mode
//               </label>
//               <select
//                 id="paymentMode"
//                 value={paymentMode}
//                 onChange={(e) => setPaymentMode(e.target.value)}
//                 className="w-full p-4 border-2 border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-lg bg-white hover:shadow-md"
//               >
//                 <option value="Online">💳 Online (Razorpay)</option>
//                 <option value="Offline">💰 Offline (Cash/Card)</option>
//               </select>
//             </motion.div>
//             {/* Total Amount */}
//             <motion.div 
//               variants={itemVariants} 
//               className="bg-gradient-to-r from-emerald-50 to-blue-50 p-6 rounded-2xl border-2 border-emerald-200"
//             >
//               <div className="flex items-center justify-between">
//                 <span className="text-xl font-bold text-gray-700">Total Amount:</span>
//                 <motion.span 
//                   className="text-3xl font-extrabold text-emerald-600"
//                   variants={pulseVariants}
//                   animate="pulse"
//                 >
//                   ₹{totalAmount.toFixed(2)}
//                 </motion.span>
//               </div>
//               <div className="text-sm text-gray-600 mt-2">
//                 {calculateDays()} night{calculateDays() > 1 ? 's' : ''} × ₹{selectedRoomPrice}
//               </div>
//             </motion.div>
//             {/* Submit Button */}
//             <motion.button
//               onClick={handleSubmit}
//               className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white w-full py-5 rounded-2xl font-bold text-xl tracking-wide hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 transform shadow-xl relative overflow-hidden group"
//               variants={buttonVariants}
//               whileHover="hover"
//               whileTap="tap"
//             >
//               <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
//               <span className="relative z-10 flex items-center justify-center gap-3">
//                 {paymentMode === 'Offline' ? (
//                   <>
//                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                     </svg>
//                     Confirm Offline Booking
//                   </>
//                 ) : (
//                   <>
//                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
//                     </svg>
//                     Proceed to Online Payment
//                   </>
//                 )}
//               </span>
//             </motion.button>
//           </div>
//         </div>
//       </motion.div>
//     </div>
//   );
// };
// export default AdminCustomBooking;

