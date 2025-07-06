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
  const maxMembers = selectedRoom?.members || 5; // ✅ use actual room's max members

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

// Generate PDF invoice locally
generateInvoice({
  bookingType: 'Room',
  formData: { ...formData, checkIn: normalizedCheckIn, checkOut: normalizedCheckOut },
  price: totalAmount,
  paymentId: 'OFFLINE',
});

// ✅ Send invoice as email attachment
await sendInvoiceEmail({
  ...formData,
  checkIn: normalizedCheckIn,
  checkOut: normalizedCheckOut,
  amount: totalAmount,
  paymentId: 'OFFLINE',
  type: 'Room',
});


      setStatusMessage({ type: 'success', message: '✅ Offline booking successful! Invoice generated.' });
      // Clear form after successful booking
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
    setStatusMessage({ type: '', message: '' }); // Clear previous messages
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
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Ensure this is correctly configured
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
  paymentId: 'OFFLINE', // or Razorpay ID
  createdByAdmin: true, // ✅ Important!
});


            generateInvoice({
              bookingType: 'Room',
              formData: { ...formData, checkIn: normalizedCheckIn, checkOut: normalizedCheckOut },
              price: totalAmount,
              paymentId: response.razorpay_payment_id,
            });

            setStatusMessage({ type: 'success', message: "✅ Online booking successful! Invoice generated." });
            // Clear form after successful booking
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
          name: formData.email, // Using email as name for prefill
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
    // Basic validation before submission
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

    // Check if check-in or check-out date is blocked
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
        duration: 0.7,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const buttonVariants = {
    hover: { scale: 1.02, boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.25)" },
    tap: { scale: 0.98 },
  };

  return (
    <motion.div
      className="p-4 sm:p-6 max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto bg-white shadow-2xl rounded-xl border border-blue-200 mt-8 mb-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.button
  onClick={() => navigate(-1)}
  className="mb-6 inline-flex items-center gap-2 text-blue-700 hover:text-blue-900 font-medium text-sm sm:text-base transition duration-200"
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  ← Back
</motion.button>

      <motion.h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-6 text-blue-900 text-center" variants={itemVariants}>
        Admin Room Booking
      </motion.h2>

      <AnimatePresence>
        {statusMessage.message && (
          <motion.div
            className={`p-3 sm:p-4 mb-5 rounded-lg flex flex-col sm:flex-row items-center justify-center text-sm sm:text-base font-medium ${statusMessage.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}
            initial={{ opacity: 0, y: -30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {statusMessage.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-5 sm:space-y-6">
        {/* Dropdowns and Inputs */}
        <motion.div variants={itemVariants}>
          <label htmlFor="roomId" className="block text-gray-700 text-sm font-bold mb-2">Room Type</label>
          <select
            id="roomId"
            className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out text-base sm:text-lg"
            name="roomId"
            value={formData.roomId}
            onChange={handleChange}
          >
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

        <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6" variants={itemVariants}>
          <div>
            <label htmlFor="adults" className="block text-gray-700 text-sm font-bold mb-2">Adults</label>
            <input
              type="number"
              id="adults"
              name="adults"
              value={formData.adults}
              onChange={handleChange}
              min="1"
              className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out text-base sm:text-lg"
            />
          </div>
          <div>
            <label htmlFor="children" className="block text-gray-700 text-sm font-bold mb-2">Children</label>
            <input
              type="number"
              id="children"
              name="children"
              value={formData.children}
              onChange={handleChange}
              min="0"
              className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out text-base sm:text-lg"
            />
          </div>
        </motion.div>

        <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6" variants={itemVariants}>
          <div>
            <label htmlFor="checkIn" className="block text-gray-700 text-sm font-bold mb-2">Check-In Date</label>
            <input
              type="date"
              id="checkIn"
              name="checkIn"
              value={formData.checkIn}
              min={today}
              onChange={handleChange}
              className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out text-base sm:text-lg"
            />
          </div>
          <div>
            <label htmlFor="checkOut" className="block text-gray-700 text-sm font-bold mb-2">Check-Out Date</label>
            <input
              type="date"
              id="checkOut"
              name="checkOut"
              value={formData.checkOut}
              min={formData.checkIn || today}
              onChange={handleChange}
              className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out text-base sm:text-lg"
            />
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Guest Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out text-base sm:text-lg"
            placeholder="e.g., example@email.com"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">Guest Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out text-base sm:text-lg"
            maxLength="10"
            placeholder="e.g., 9876543210"
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <label htmlFor="paymentMode" className="block text-gray-700 text-sm font-bold mb-2">Payment Mode</label>
          <select
            id="paymentMode"
            value={paymentMode}
            onChange={(e) => setPaymentMode(e.target.value)}
            className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out text-base sm:text-lg"
          >
            <option value="Online">Online (Razorpay)</option>
            <option value="Offline">Offline (Cash/Card)</option>
          </select>
        </motion.div>

        <motion.div variants={itemVariants} className="text-right pt-2">
          <p className="text-lg sm:text-xl font-extrabold text-blue-900">
            Total Amount: <span className="text-green-600">₹{totalAmount.toFixed(2)}</span>
          </p>
        </motion.div>

        <motion.button
          onClick={handleSubmit}
          className="bg-gradient-to-r from-blue-700 to-blue-900 text-white w-full py-3 sm:py-4 rounded-lg font-bold text-lg sm:text-xl tracking-wide hover:from-blue-800 hover:to-blue-950 focus:outline-none focus:ring-4 focus:ring-blue-300 active:bg-blue-700 transition duration-300 ease-in-out transform origin-center"
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

