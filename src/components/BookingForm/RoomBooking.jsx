import React, { useState, useEffect } from 'react';
import { generateInvoice } from '../../utils/invoiceGenerator';
import { createBooking } from '../../utils/api';
import ReCAPTCHA from 'react-google-recaptcha';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // Import Framer Motion

const RoomBooking = () => {
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
  const [statusMessage, setStatusMessage] = useState({ type: '', message: '' }); // Changed to object for type
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [bookingApproved, setBookingApproved] = useState(false);
  const [searchParams] = useSearchParams();

  const isReadOnly = bookingApproved;
  const selectedRoom = availableRooms.find((r) => r._id?.toString() === formData.roomId?.toString());
  const selectedRoomPrice = selectedRoom?.price || 0;
  const maxMembers = selectedRoom?.members || 5;
  const today = new Date().toISOString().split('T')[0];

  const calculateDays = () => {
    const checkIn = new Date(formData.checkIn);
    const checkOut = new Date(formData.checkOut);
    const diff = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  };

  const totalAmount = selectedRoomPrice * calculateDays();

  useEffect(() => {
    const fetchBlockedDates = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/blocked-dates?type=Room');
        const data = await res.json();
        setBlockedDates(data.map(d => new Date(d.date).toISOString().split('T')[0]));
      } catch {
        setStatusMessage({ type: 'error', message: 'Failed to load blocked dates.' });
      }
    };
    fetchBlockedDates();
  }, []);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/options');
        const data = await res.json();
        const rooms = data.filter(opt => opt.type === 'Room');
        setAvailableRooms(rooms);
        if (!formData.roomId && rooms.length > 0) {
          setFormData(prev => ({ ...prev, roomId: rooms[0]._id }));
        }
      } catch {
        setStatusMessage({ type: 'error', message: 'Failed to load room options.' });
      }
    };
    fetchOptions();
  }, [formData.roomId]);

  useEffect(() => {
    const bookingId = searchParams.get('bookingId');
    if (!bookingId || availableRooms.length === 0) return;

    const fetchBooking = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/bookings/${bookingId}`);
        const booking = await res.json();

        setFormData({
          roomId: booking.roomId,
          adults: booking.adults,
          children: booking.children,
          checkIn: booking.checkIn.slice(0, 10),
          checkOut: booking.checkOut.slice(0, 10),
          email: booking.email,
          phone: booking.phone,
        });

        if (booking.isApproved) {
          setBookingApproved(true);
        }
      } catch (err) {
        console.error(err);
        setStatusMessage({ type: 'error', message: 'Failed to fetch booking from link.' });
      }
    };

    fetchBooking();
  }, [searchParams, availableRooms]);

  const handleChange = (e) => {
    if (isReadOnly) return;

    const { name, value } = e.target;
    if (name === 'phone') {
      const phone = value.replace(/\D/g, '').slice(0, 10);
      setFormData({ ...formData, phone });
      return;
    }

    let newForm = { ...formData, [name]: value };

    if (name === 'adults' || name === 'children') {
      const num = parseInt(value) || 0;
      newForm[name] = num;
    }

    if (['roomId', 'adults', 'children'].includes(name)) {
      const room = availableRooms.find((r) => r._id?.toString() === newForm.roomId?.toString());
      const max = room?.members || 5;
      const newAdults = name === 'adults' ? parseInt(value) || 0 : formData.adults;
      const newChildren = name === 'children' ? parseInt(value) || 0 : formData.children;
      const total = newAdults + newChildren;

      if (total > max) {
        setStatusMessage({ type: 'error', message: `⚠️ Max ${max} guests allowed for ${room?.name || 'this room'}.` });
        return;
      }
    }

    if (name === 'checkIn' || name === 'checkOut') {
      if (blockedDates.includes(value)) {
        setStatusMessage({ type: 'error', message: `⚠️ ${value} is blocked.` });
        return;
      }
    }

    setFormData(newForm);
    setStatusMessage({ type: '', message: '' }); // Clear status on valid input
  };

  const handleSubmitBooking = async () => {
    if (!captchaVerified) {
      setStatusMessage({ type: 'error', message: 'Please verify reCAPTCHA before booking.' });
      return;
    }
    setStatusMessage({ type: 'info', message: 'Submitting booking request...' });

    try {
      const normalizedCheckIn = new Date(formData.checkIn).toISOString().split('T')[0];
      const normalizedCheckOut = new Date(formData.checkOut).toISOString().split('T')[0];

      await createBooking({
        ...formData,
        checkIn: normalizedCheckIn,
        checkOut: normalizedCheckOut,
        type: 'Room',
        amount: totalAmount,
        isApproved: false,
      });

      setStatusMessage({ type: 'success', message: '✅ Booking request submitted! Admin will approve it shortly.' });
    } catch (err) {
      console.error(err);
      setStatusMessage({ type: 'error', message: 'Booking submission failed.' });
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!bookingApproved) {
      setStatusMessage({ type: 'error', message: 'Your booking is not yet approved by admin.' });
      return;
    }

    const bookingId = searchParams.get('bookingId');
    if (!bookingId) {
      setStatusMessage({ type: 'error', message: 'Booking ID missing in URL.' });
      return;
    }

    setStatusMessage({ type: 'info', message: 'Processing payment...' });

    const loaded = await loadRazorpayScript();
    if (!loaded) {
      setStatusMessage({ type: 'error', message: 'Failed to load Razorpay.' });
      return;
    }

    try {
      const orderRes = await fetch('http://localhost:5000/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: totalAmount }),
      });

      const { order } = await orderRes.json();

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: 'INR',
        name: 'Hotel Booking',
        description: 'Room Reservation',
        order_id: order.id,
        handler: async (response) => {
          // 1. Generate invoice
          const pdfBlob = await generateInvoice({
            bookingType: 'Room',
            formData,
            price: totalAmount,
            paymentId: response.razorpay_payment_id,
          });

          const url = window.URL.createObjectURL(pdfBlob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `Invoice_${response.razorpay_payment_id}.pdf`;
          document.body.appendChild(a);
          a.click();
          a.remove();

          // 2. Mark as paid
          await fetch(`http://localhost:5000/api/bookings/payment-success`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              bookingId,
              paymentId: response.razorpay_payment_id,
              amount: totalAmount,
            }),
          });

          // 3. Send confirmation email
          await fetch('http://localhost:5000/api/bookings/send-confirmation-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: formData.email,
              bookingType: 'Room',
              amount: totalAmount,
              paymentId: response.razorpay_payment_id,
              checkIn: formData.checkIn,
              checkOut: formData.checkOut,
              phone: formData.phone,
              adults: formData.adults,
              children: formData.children,
              roomId: formData.roomId,
            }),
          });

          setStatusMessage({ type: 'success', message: '✅ Payment successful! Invoice downloaded and sent.' });
        },
        prefill: {
          name: formData.email,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#4db6ac", // Teal color for RoomBooking
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Payment error:', err);
      setStatusMessage({ type: 'error', message: 'Payment or update failed.' });
    }
  };

  // Framer Motion Variants (Adapted from LawnBooking with teal adjustments)
  const formContainerVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  const buttonVariants = {
    hover: { scale: 1.03, boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)" },
    tap: { scale: 0.97 },
  };

  const statusVariants = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <motion.div
        className="max-w-xl w-full mx-auto p-6 sm:p-8 bg-white border border-teal-300 rounded-3xl shadow-2xl overflow-hidden"
        variants={formContainerVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-6 text-center text-teal-700 drop-shadow-md">
          Book Your Room
        </h2>

        {/* Status Message Display */}
        <AnimatePresence>
          {statusMessage.message && (
            <motion.p
              className={`text-center py-2 px-3 rounded-lg mb-4 text-base font-medium
                ${statusMessage.type === 'success' ? 'bg-green-100 text-green-700' : ''}
                ${statusMessage.type === 'error' ? 'bg-red-100 text-red-700' : ''}
                ${statusMessage.type === 'info' ? 'bg-blue-100 text-blue-700' : ''}
              `}
              variants={statusVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {statusMessage.message}
            </motion.p>
          )}
        </AnimatePresence>

        {isReadOnly && selectedRoom ? (
          <motion.div
            className="bg-blue-50 border border-blue-200 p-4 sm:p-6 rounded-xl shadow-inner-lg text-blue-800"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <h3 className="text-lg sm:text-xl font-bold mb-3 text-blue-700 flex items-center gap-2">
              <span className="text-2xl">✅</span> Booking Approved!
            </h3>
            <p className="mb-1 text-sm sm:text-base"><strong>Room:</strong> {selectedRoom.name} - ₹{selectedRoom.price}</p>
            <p className="mb-1 text-sm sm:text-base"><strong>Check-In:</strong> {formData.checkIn}</p>
            <p className="mb-1 text-sm sm:text-base"><strong>Check-Out:</strong> {formData.checkOut}</p>
            <p className="mb-1 text-sm sm:text-base"><strong>Guests:</strong> {formData.adults} Adult(s), {formData.children} Child(ren)</p>
            <p className="mb-1 text-sm sm:text-base"><strong>Email:</strong> {formData.email}</p>
            <p className="mb-3 text-sm sm:text-base"><strong>Phone:</strong> {formData.phone}</p>
            <p className="mt-2 text-xl sm:text-2xl font-extrabold text-teal-900 text-right">
              Total: ₹{totalAmount}
            </p>
            <motion.button
              type="button"
              onClick={handlePayment}
              disabled={!captchaVerified && !bookingApproved}
              className="w-full mt-4 bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-xl font-bold text-lg shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover="hover"
              whileTap="tap"
              variants={buttonVariants}
            >
              Pay Now
            </motion.button>
          </motion.div>
        ) : (
          isReadOnly && <p className="text-center text-gray-600 italic py-4">Loading booking summary...</p>
        )}

        {!isReadOnly && (
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            {/* Room Select */}
            <motion.div variants={itemVariants}>
              <label htmlFor="roomId" className="block text-base font-semibold text-gray-700 mb-1">
                Select Room:
              </label>
              <div className="relative">
                <select
                  id="roomId"
                  name="roomId"
                  value={formData.roomId}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 appearance-none bg-white pr-10 text-gray-800 text-base"
                  required
                >
                  {availableRooms.length === 0 ? (
                    <option value="">Loading rooms...</option>
                  ) : (
                    availableRooms.map(room => (
                      <option key={room._id} value={room._id}>
                        {room.name} - ₹{room.price} (Max {room.members} guests)
                      </option>
                    ))
                  )}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                  <svg className="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.757 7.586 5.343 9z" /></svg>
                </div>
              </div>
            </motion.div>

            {/* Adults and Children */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <motion.div variants={itemVariants}>
                <label htmlFor="adults" className="block text-base font-semibold text-gray-700 mb-1">
                  Adults:
                </label>
                <input
                  type="number"
                  id="adults"
                  name="adults"
                  min="1"
                  value={formData.adults}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 text-gray-800 text-base"
                  required
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <label htmlFor="children" className="block text-base font-semibold text-gray-700 mb-1">
                  Children:
                </label>
                <input
                  type="number"
                  id="children"
                  name="children"
                  min="0"
                  value={formData.children}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 text-gray-800 text-base"
                  required
                />
              </motion.div>
            </div>

            {/* Check-in and Check-out */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <motion.div variants={itemVariants}>
                <label htmlFor="checkIn" className="block text-base font-semibold text-gray-700 mb-1">
                  Check-In Date:
                </label>
                <input
                  type="date"
                  id="checkIn"
                  name="checkIn"
                  min={today}
                  value={formData.checkIn}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 text-gray-800 text-base"
                  required
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <label htmlFor="checkOut" className="block text-base font-semibold text-gray-700 mb-1">
                  Check-Out Date:
                </label>
                <input
                  type="date"
                  id="checkOut"
                  name="checkOut"
                  min={formData.checkIn || today}
                  value={formData.checkOut}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 text-gray-800 text-base"
                  required
                />
              </motion.div>
            </div>

            {/* Email */}
            <motion.div variants={itemVariants}>
              <label htmlFor="email" className="block text-base font-semibold text-gray-700 mb-1">
                Email:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 text-gray-800 placeholder-gray-500 text-base"
                placeholder="your.email@example.com"
                required
              />
            </motion.div>

            {/* Phone No. */}
            <motion.div variants={itemVariants}>
              <label htmlFor="phone" className="block text-base font-semibold text-gray-700 mb-1">
                Phone Number:
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 text-gray-800 placeholder-gray-500 text-base"
                placeholder="e.g., 9876543210"
                maxLength="10"
                pattern="[6-9]{1}[0-9]{9}"
                title="Please enter a valid 10-digit Indian phone number (starts with 6-9)"
                required
              />
            </motion.div>

            {/* Booking Summary */}
            {(formData.roomId && formData.adults > 0 && formData.checkIn && formData.checkOut && formData.email && formData.phone) && (
              <motion.div
                className="bg-teal-50 border border-teal-200 p-4 rounded-xl shadow-inner-lg text-teal-800"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <h3 className="text-lg font-bold mb-2 text-teal-700">Your Booking Summary</h3>
                {selectedRoom && <p className="mb-0.5 text-sm"><strong>Room:</strong> {selectedRoom.name}</p>}
                <p className="mb-0.5 text-sm"><strong>Guests:</strong> {formData.adults} Adult(s){formData.children > 0 ? `, ${formData.children} Child(ren)` : ''}</p>
                <p className="mb-0.5 text-sm"><strong>Check-In:</strong> {formData.checkIn}</p>
                <p className="mb-0.5 text-sm"><strong>Check-Out:</strong> {formData.checkOut}</p>
                <p className="mb-0.5 text-sm"><strong>Email:</strong> {formData.email}</p>
                <p className="mb-2 text-sm"><strong>Phone:</strong> {formData.phone}</p>
                {selectedRoom && (
                  <p className="mt-1 text-xl font-extrabold text-teal-900">
                    Total: ₹{selectedRoomPrice} x {calculateDays()} day(s) = ₹{totalAmount}
                  </p>
                )}
              </motion.div>
            )}

            {/* ReCAPTCHA */}
            <motion.div variants={itemVariants} className="flex justify-center mt-6">
              <ReCAPTCHA
                sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                onChange={() => setCaptchaVerified(true)}
                onExpired={() => setCaptchaVerified(false)}
              />
            </motion.div>

            {/* Submit Button */}
            <motion.button
              type="button"
              onClick={handleSubmitBooking}
              disabled={!captchaVerified || !formData.roomId || !formData.checkIn || !formData.checkOut || !formData.email || !formData.phone}
              className="w-full mt-4 bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-xl font-bold text-lg shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover="hover"
              whileTap="tap"
              variants={buttonVariants}
            >
              Submit Booking for Approval
            </motion.button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default RoomBooking;
