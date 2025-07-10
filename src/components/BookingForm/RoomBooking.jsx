
import React, { useState, useEffect } from 'react';
import { generateInvoice } from '../../utils/invoiceGenerator';
import { createBooking } from '../../utils/api';
import ReCAPTCHA from 'react-google-recaptcha';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, Users, Mail, Phone, MapPin, CreditCard,
  CheckCircle, AlertCircle, Clock, Star, Menu, X,
  Bed, Wifi, Coffee, Car
} from 'lucide-react';

const RoomBooking = () => {
  // ... keep existing code (state variables and hooks)
  const [formData, setFormData] = useState({
    roomId: '',
    adults: 1,
    children: 0,
    checkIn: '',
    checkOut: '',
    email: '',
    phone: '',
  });

  const [paymentDone, setPaymentDone] = useState(false);
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [blockedDates, setBlockedDates] = useState([]);
  const [statusMessage, setStatusMessage] = useState({ type: '', message: '' });
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [bookingApproved, setBookingApproved] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
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

  // ... keep existing code (useEffect hooks)
  useEffect(() => {
    const fetchBlockedDates = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/blocked-dates?type=Room`);
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
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/options`);
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
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/bookings/${bookingId}`);
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

  // ... keep existing code (event handlers)
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
    setStatusMessage({ type: '', message: '' });
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

      setStatusMessage({
        type: 'success',
        message: '✅ Booking request submitted! Admin will approve it and you will get the email for Payment.',
      });

      setBookingSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
      const orderRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/razorpay/create-order`, {
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

          await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/bookings/payment-success`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              bookingId,
              paymentId: response.razorpay_payment_id,
              amount: totalAmount,
            }),
          });

          await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/bookings/send-confirmation-email`, {
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
          setPaymentDone(true);
        },
        prefill: {
          name: formData.email,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#3B82F6",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Payment error:', err);
      setStatusMessage({ type: 'error', message: 'Payment or update failed.' });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section - Ultra Mobile Optimized */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-6 sm:py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-2 xs:px-3 sm:px-4 md:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4 leading-tight px-1">
              Luxury Room Booking
            </h1>
            <p className="text-sm xs:text-base sm:text-lg md:text-xl opacity-90 px-2">
              Experience comfort and elegance in our premium accommodations
            </p>
          </motion.div>
        </div>
      </div>

      <motion.div
        className="max-w-7xl mx-auto px-2 xs:px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 lg:py-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Status Message - Ultra Mobile Optimized */}
        <AnimatePresence>
          {statusMessage.message && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mb-3 sm:mb-4 lg:mb-6 p-2 xs:p-3 sm:p-4 rounded-lg sm:rounded-xl border-l-4 flex items-start gap-2 text-xs xs:text-sm sm:text-base ${
                statusMessage.type === 'success' 
                  ? 'bg-green-50 border-green-400 text-green-800' 
                  : statusMessage.type === 'error' 
                  ? 'bg-red-50 border-red-400 text-red-800' 
                  : 'bg-blue-50 border-blue-400 text-blue-800'
              }`}
            >
              <div className="flex-shrink-0 mt-0.5">
                {statusMessage.type === 'success' && <CheckCircle className="h-3 w-3 xs:h-4 xs:w-4 sm:h-5 sm:w-5" />}
                {statusMessage.type === 'error' && <AlertCircle className="h-3 w-3 xs:h-4 xs:w-4 sm:h-5 sm:w-5" />}
                {statusMessage.type === 'info' && <Clock className="h-3 w-3 xs:h-4 xs:w-4 sm:h-5 sm:w-5" />}
              </div>
              <span className="font-medium leading-tight break-words">{statusMessage.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Main Form - Ultra Mobile First */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-lg xs:rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-3 xs:p-4 sm:p-6 lg:p-8"
            >
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 lg:mb-8">
                <div className="bg-blue-100 p-1.5 xs:p-2 sm:p-3 rounded-full flex-shrink-0">
                  <MapPin className="h-3 w-3 xs:h-4 xs:w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-blue-600" />
                </div>
                <h2 className="text-base xs:text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">Room Details</h2>
              </div>

              {isReadOnly && selectedRoom ? (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 xs:p-4 sm:p-6 rounded-lg sm:rounded-xl border border-green-200">
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <CheckCircle className="h-4 w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6 text-green-600 flex-shrink-0" />
                    <h3 className="text-base xs:text-lg sm:text-xl font-bold text-green-800">Booking Confirmed!</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-2 xs:gap-3 sm:gap-4 text-xs xs:text-sm sm:text-base">
                    <div className="break-words"><span className="font-semibold">Room:</span> {selectedRoom.name}</div>
                    <div><span className="font-semibold">Price:</span> ₹{selectedRoom.price}/night</div>
                    <div><span className="font-semibold">Check-in:</span> {formData.checkIn}</div>
                    <div><span className="font-semibold">Check-out:</span> {formData.checkOut}</div>
                    <div><span className="font-semibold">Guests:</span> {formData.adults} Adults, {formData.children} Children</div>
                    <div className="break-all"><span className="font-semibold">Contact:</span> {formData.phone}</div>
                  </div>
                  <div className="mt-3 xs:mt-4 pt-3 xs:pt-4 border-t border-green-200">
                    <div className="text-lg xs:text-xl sm:text-2xl font-bold text-green-800">Total: ₹{totalAmount}</div>
                  </div>
                  {!paymentDone && (
                    <motion.button
                      onClick={handlePayment}
                      disabled={!bookingApproved}
                      className="w-full mt-3 xs:mt-4 sm:mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2.5 xs:py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold text-sm xs:text-base sm:text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <CreditCard className="h-3 w-3 xs:h-4 xs:w-4 sm:h-5 sm:w-5" />
                      <span className="text-xs xs:text-sm sm:text-base">Complete Payment</span>
                    </motion.button>
                  )}
                </div>
              ) : !isReadOnly ? (
                <div className="space-y-3 xs:space-y-4 sm:space-y-6">
                  {/* Room Selection - Ultra Mobile Optimized */}
                  <div>
                    <label className="block text-xs xs:text-sm font-semibold text-gray-700 mb-1 xs:mb-2">
                      Choose Your Room
                    </label>
                    <select
                      name="roomId"
                      value={formData.roomId}
                      onChange={handleChange}
                      className="w-full p-2 xs:p-3 sm:p-4 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-xs xs:text-sm sm:text-base"
                      required
                    >
                      {availableRooms.length === 0 ? (
                        <option value="">Loading rooms...</option>
                      ) : (
                        availableRooms.map(room => (
                          <option key={room._id} value={room._id}>
                            {room.name} - ₹{room.price}/night (Max {room.members} guests)
                          </option>
                        ))
                      )}
                    </select>
                  </div>

                  {/* Guest Count - Ultra Mobile Grid */}
                  <div className="grid grid-cols-2 gap-2 xs:gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs xs:text-sm font-semibold text-gray-700 mb-1 xs:mb-2">
                        <Users className="inline h-2.5 w-2.5 xs:h-3 xs:w-3 sm:h-4 sm:w-4 mr-1" />
                        <span className="text-xs xs:text-sm">Adults</span>
                      </label>
                      <input
                        type="number"
                        name="adults"
                        min="1"
                        max="10"
                        value={formData.adults}
                        onChange={handleChange}
                        className="w-full p-2 xs:p-3 sm:p-4 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-xs xs:text-sm sm:text-base"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs xs:text-sm font-semibold text-gray-700 mb-1 xs:mb-2">
                        <Users className="inline h-2.5 w-2.5 xs:h-3 xs:w-3 sm:h-4 sm:w-4 mr-1" />
                        <span className="text-xs xs:text-sm">Children</span>
                      </label>
                      <input
                        type="number"
                        name="children"
                        min="0"
                        max="5"
                        value={formData.children}
                        onChange={handleChange}
                        className="w-full p-2 xs:p-3 sm:p-4 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-xs xs:text-sm sm:text-base"
                        required
                      />
                    </div>
                  </div>

                  {/* Dates - Ultra Mobile Stack */}
                  <div className="grid grid-cols-1 gap-2 xs:gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs xs:text-sm font-semibold text-gray-700 mb-1 xs:mb-2">
                        <Calendar className="inline h-2.5 w-2.5 xs:h-3 xs:w-3 sm:h-4 sm:w-4 mr-1" />
                        <span className="text-xs xs:text-sm">Check-in Date</span>
                      </label>
                      <input
                        type="date"
                        name="checkIn"
                        min={today}
                        value={formData.checkIn}
                        onChange={handleChange}
                        className="w-full p-2 xs:p-3 sm:p-4 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-xs xs:text-sm sm:text-base"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs xs:text-sm font-semibold text-gray-700 mb-1 xs:mb-2">
                        <Calendar className="inline h-2.5 w-2.5 xs:h-3 xs:w-3 sm:h-4 sm:w-4 mr-1" />
                        <span className="text-xs xs:text-sm">Check-out Date</span>
                      </label>
                      <input
                        type="date"
                        name="checkOut"
                        min={formData.checkIn || today}
                        value={formData.checkOut}
                        onChange={handleChange}
                        className="w-full p-2 xs:p-3 sm:p-4 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-xs xs:text-sm sm:text-base"
                        required
                      />
                    </div>
                  </div>

                  {/* Contact Information - Ultra Mobile Stack */}
                  <div className="grid grid-cols-1 gap-2 xs:gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs xs:text-sm font-semibold text-gray-700 mb-1 xs:mb-2">
                        <Mail className="inline h-2.5 w-2.5 xs:h-3 xs:w-3 sm:h-4 sm:w-4 mr-1" />
                        <span className="text-xs xs:text-sm">Email Address</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your.email@example.com"
                        className="w-full p-2 xs:p-3 sm:p-4 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-xs xs:text-sm sm:text-base"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs xs:text-sm font-semibold text-gray-700 mb-1 xs:mb-2">
                        <Phone className="inline h-2.5 w-2.5 xs:h-3 xs:w-3 sm:h-4 sm:w-4 mr-1" />
                        <span className="text-xs xs:text-sm">Phone Number</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="9876543210"
                        maxLength="10"
                        className="w-full p-2 xs:p-3 sm:p-4 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-xs xs:text-sm sm:text-base"
                        required
                      />
                    </div>
                  </div>

                  {/* reCAPTCHA - Ultra Mobile Responsive */}
                  <div className="flex justify-center pt-2 sm:pt-4">
                    <div className="transform scale-50 xs:scale-75 sm:scale-100 origin-center">
                      <ReCAPTCHA
                        sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                        onChange={() => setCaptchaVerified(true)}
                        onExpired={() => setCaptchaVerified(false)}
                        size="normal"
                      />
                    </div>
                  </div>

                  {/* Submit Button - Ultra Mobile Optimized */}
                  <motion.button
                    type="button"
                    onClick={handleSubmitBooking}
                    disabled={
                      bookingSubmitted || 
                      !captchaVerified || 
                      !formData.roomId || 
                      !formData.checkIn || 
                      !formData.checkOut || 
                      !formData.email || 
                      !formData.phone
                    }
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2.5 xs:py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold text-xs xs:text-sm sm:text-base lg:text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {bookingSubmitted ? (
                      <span className="flex items-center justify-center gap-1 xs:gap-2">
                        <CheckCircle className="h-3 w-3 xs:h-4 xs:w-4 sm:h-5 sm:w-5" />
                        <span className="text-xs xs:text-sm sm:text-base">Booking Submitted Successfully</span>
                      </span>
                    ) : (
                      <span className="text-xs xs:text-sm sm:text-base">Submit Booking Request</span>
                    )}
                  </motion.button>
                </div>
              ) : (
                <div className="text-center py-6 xs:py-8">
                  <div className="animate-spin rounded-full h-8 w-8 xs:h-10 xs:w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto mb-3 xs:mb-4"></div>
                  <p className="text-gray-600 text-xs xs:text-sm sm:text-base">Loading booking details...</p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Mobile Summary Toggle - Ultra Mobile */}
          <div className="lg:hidden order-1 lg:order-2">
            <motion.button
              onClick={() => setShowSummary(!showSummary)}
              className="w-full bg-white rounded-lg xs:rounded-xl shadow-lg p-3 xs:p-4 flex items-center justify-between text-left"
              variants={itemVariants}
            >
              <div className="flex items-center gap-2 xs:gap-3">
                <div className="bg-indigo-100 p-1.5 xs:p-2 rounded-full flex-shrink-0">
                  <Star className="h-3 w-3 xs:h-4 xs:w-4 sm:h-5 sm:w-5 text-indigo-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-gray-800 text-sm xs:text-base truncate">Booking Summary</h3>
                  {selectedRoom && totalAmount > 0 && (
                    <p className="text-xs xs:text-sm text-gray-600 truncate">Total: ₹{totalAmount}</p>
                  )}
                </div>
              </div>
              {showSummary ? <X className="h-4 w-4 xs:h-5 xs:w-5 flex-shrink-0" /> : <Menu className="h-4 w-4 xs:h-5 xs:w-5 flex-shrink-0" />}
            </motion.button>
          </div>

          {/* Booking Summary Sidebar - Ultra Mobile Responsive */}
          <div className={`lg:col-span-1 order-3 lg:order-2 ${showSummary ? 'block' : 'hidden lg:block'}`}>
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-lg xs:rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-3 xs:p-4 sm:p-6 lg:sticky lg:top-6"
            >
              <div className="lg:flex lg:items-center lg:gap-3 lg:mb-6 hidden">
                <div className="bg-indigo-100 p-2 rounded-full">
                  <Star className="h-5 w-5 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Booking Summary</h3>
              </div>

              {selectedRoom && formData.checkIn && formData.checkOut && formData.adults > 0 ? (
                <div className="space-y-3 xs:space-y-4">
                  <div className="bg-gray-50 p-2 xs:p-3 sm:p-4 rounded-lg sm:rounded-xl">
                    <h4 className="font-semibold text-gray-800 mb-1 xs:mb-2 text-xs xs:text-sm sm:text-base break-words leading-tight">{selectedRoom.name}</h4>
                    <p className="text-xs xs:text-sm text-gray-600 mb-1 xs:mb-2">₹{selectedRoom.price} per night</p>
                    <div className="text-xs xs:text-sm text-gray-600 space-y-0.5 xs:space-y-1">
                      <div className="break-words">Check-in: {formData.checkIn}</div>
                      <div className="break-words">Check-out: {formData.checkOut}</div>
                      <div>Duration: {calculateDays()} night(s)</div>
                      <div>Guests: {formData.adults + formData.children} total</div>
                    </div>
                  </div>

                  <div className="border-t pt-3 xs:pt-4">
                    <div className="flex justify-between items-center mb-1 xs:mb-2 text-xs xs:text-sm">
                      <span className="text-gray-600">Room Cost</span>
                      <span className="font-medium">₹{selectedRoomPrice} × {calculateDays()}</span>
                    </div>
                    <div className="flex justify-between items-center text-base xs:text-lg sm:text-xl font-bold text-gray-800 pt-1 xs:pt-2 border-t">
                      <span>Total Amount</span>
                      <span className="text-blue-600">₹{totalAmount}</span>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-2 xs:p-3 sm:p-4 rounded-lg sm:rounded-xl text-xs xs:text-sm text-blue-700">
                    <p className="font-medium mb-1">What's Included:</p>
                    <div className="grid grid-cols-2 gap-0.5 xs:gap-1 text-xs">
                      <div className="flex items-center gap-1">
                        <Wifi className="h-2.5 w-2.5 xs:h-3 xs:w-3 flex-shrink-0" />
                        <span className="truncate">Free WiFi</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Bed className="h-2.5 w-2.5 xs:h-3 xs:w-3 flex-shrink-0" />
                        <span className="truncate">Housekeeping</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Coffee className="h-2.5 w-2.5 xs:h-3 xs:w-3 flex-shrink-0" />
                        <span className="truncate">Room Service</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Car className="h-2.5 w-2.5 xs:h-3 xs:w-3 flex-shrink-0" />
                        <span className="truncate">Amenities</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-6 xs:py-8">
                  <p className="text-xs xs:text-sm">Complete the form to see your booking summary</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RoomBooking;



// import React, { useState, useEffect } from 'react';
// import { generateInvoice } from '../../utils/invoiceGenerator';
// import { createBooking } from '../../utils/api';
// import ReCAPTCHA from 'react-google-recaptcha';
// import { useSearchParams } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion'; // Import Framer Motion

// const RoomBooking = () => {
//   const [formData, setFormData] = useState({
//     roomId: '',
//     adults: 1,
//     children: 0,
//     checkIn: '',
//     checkOut: '',
//     email: '',
//     phone: '',
//   });

//   const [paymentDone, setPaymentDone] = useState(false);
//   const [bookingSubmitted, setBookingSubmitted] = useState(false);
//   const [availableRooms, setAvailableRooms] = useState([]);
//   const [blockedDates, setBlockedDates] = useState([]);
//   const [statusMessage, setStatusMessage] = useState({ type: '', message: '' }); // Changed to object for type
//   const [captchaVerified, setCaptchaVerified] = useState(false);
//   const [bookingApproved, setBookingApproved] = useState(false);
//   const [searchParams] = useSearchParams();

//   const isReadOnly = bookingApproved;
//   const selectedRoom = availableRooms.find((r) => r._id?.toString() === formData.roomId?.toString());
//   const selectedRoomPrice = selectedRoom?.price || 0;
//   const maxMembers = selectedRoom?.members || 5;
//   const today = new Date().toISOString().split('T')[0];

//   const calculateDays = () => {
//     const checkIn = new Date(formData.checkIn);
//     const checkOut = new Date(formData.checkOut);
//     const diff = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
//     return diff > 0 ? diff : 1;
//   };

//   const totalAmount = selectedRoomPrice * calculateDays();

//   useEffect(() => {
//     const fetchBlockedDates = async () => {
//       try {
//         const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/blocked-dates?type=Room`);
//         const data = await res.json();
//         setBlockedDates(data.map(d => new Date(d.date).toISOString().split('T')[0]));
//       } catch {
//         setStatusMessage({ type: 'error', message: 'Failed to load blocked dates.' });
//       }
//     };
//     fetchBlockedDates();
//   }, []);

//   useEffect(() => {
//     const fetchOptions = async () => {
//       try {
//         const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/options`);
//         const data = await res.json();
//         const rooms = data.filter(opt => opt.type === 'Room');
//         setAvailableRooms(rooms);
//         if (!formData.roomId && rooms.length > 0) {
//           setFormData(prev => ({ ...prev, roomId: rooms[0]._id }));
//         }
//       } catch {
//         setStatusMessage({ type: 'error', message: 'Failed to load room options.' });
//       }
//     };
//     fetchOptions();
//   }, [formData.roomId]);

//   useEffect(() => {
//     const bookingId = searchParams.get('bookingId');
//     if (!bookingId || availableRooms.length === 0) return;

//     const fetchBooking = async () => {
//       try {
//         const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/bookings/${bookingId}`);
//         const booking = await res.json();

//         setFormData({
//           roomId: booking.roomId,
//           adults: booking.adults,
//           children: booking.children,
//           checkIn: booking.checkIn.slice(0, 10),
//           checkOut: booking.checkOut.slice(0, 10),
//           email: booking.email,
//           phone: booking.phone,
//         });

//         if (booking.isApproved) {
//           setBookingApproved(true);
//         }
//       } catch (err) {
//         console.error(err);
//         setStatusMessage({ type: 'error', message: 'Failed to fetch booking from link.' });
//       }
//     };

//     fetchBooking();
//   }, [searchParams, availableRooms]);

//   const handleChange = (e) => {
//     if (isReadOnly) return;

//     const { name, value } = e.target;
//     if (name === 'phone') {
//       const phone = value.replace(/\D/g, '').slice(0, 10);
//       setFormData({ ...formData, phone });
//       return;
//     }

//     let newForm = { ...formData, [name]: value };

//     if (name === 'adults' || name === 'children') {
//       const num = parseInt(value) || 0;
//       newForm[name] = num;
//     }

//     if (['roomId', 'adults', 'children'].includes(name)) {
//       const room = availableRooms.find((r) => r._id?.toString() === newForm.roomId?.toString());
//       const max = room?.members || 5;
//       const newAdults = name === 'adults' ? parseInt(value) || 0 : formData.adults;
//       const newChildren = name === 'children' ? parseInt(value) || 0 : formData.children;
//       const total = newAdults + newChildren;

//       if (total > max) {
//         setStatusMessage({ type: 'error', message: `⚠️ Max ${max} guests allowed for ${room?.name || 'this room'}.` });
//         return;
//       }
//     }

//     if (name === 'checkIn' || name === 'checkOut') {
//       if (blockedDates.includes(value)) {
//         setStatusMessage({ type: 'error', message: `⚠️ ${value} is blocked.` });
//         return;
//       }
//     }

//     setFormData(newForm);
//     setStatusMessage({ type: '', message: '' }); // Clear status on valid input
//   };

//   const handleSubmitBooking = async () => {
//   if (!captchaVerified) {
//     setStatusMessage({ type: 'error', message: 'Please verify reCAPTCHA before booking.' });
//     return;
//   }

//   setStatusMessage({ type: 'info', message: 'Submitting booking request...' });

//   try {
//     const normalizedCheckIn = new Date(formData.checkIn).toISOString().split('T')[0];
//     const normalizedCheckOut = new Date(formData.checkOut).toISOString().split('T')[0];

//     await createBooking({
//       ...formData,
//       checkIn: normalizedCheckIn,
//       checkOut: normalizedCheckOut,
//       type: 'Room',
//       amount: totalAmount,
//       isApproved: false,
//     });

//     setStatusMessage({
//       type: 'success',
//       message: '✅ Booking request submitted! Admin will approve it and you will get the email for Payment.',
//     });

//     setBookingSubmitted(true); // 🔒 Prevent resubmission

//     // ✅ Scroll to top smoothly so user sees the message
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   } catch (err) {
//     console.error(err);
//     setStatusMessage({ type: 'error', message: 'Booking submission failed.' });
//   }
// };


//   const loadRazorpayScript = () => {
//     return new Promise((resolve) => {
//       if (window.Razorpay) return resolve(true);
//       const script = document.createElement('script');
//       script.src = 'https://checkout.razorpay.com/v1/checkout.js';
//       script.onload = () => resolve(true);
//       script.onerror = () => resolve(false);
//       document.body.appendChild(script);
//     });
//   };

//   const handlePayment = async () => {
//     if (!bookingApproved) {
//       setStatusMessage({ type: 'error', message: 'Your booking is not yet approved by admin.' });
//       return;
//     }

//     const bookingId = searchParams.get('bookingId');
//     if (!bookingId) {
//       setStatusMessage({ type: 'error', message: 'Booking ID missing in URL.' });
//       return;
//     }

//     setStatusMessage({ type: 'info', message: 'Processing payment...' });

//     const loaded = await loadRazorpayScript();
//     if (!loaded) {
//       setStatusMessage({ type: 'error', message: 'Failed to load Razorpay.' });
//       return;
//     }

//     try {
//       const orderRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/razorpay/create-order`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ amount: totalAmount }),
//       });

//       const { order } = await orderRes.json();

//       const options = {
//         key: import.meta.env.VITE_RAZORPAY_KEY_ID,
//         amount: order.amount,
//         currency: 'INR',
//         name: 'Hotel Booking',
//         description: 'Room Reservation',
//         order_id: order.id,
//         handler: async (response) => {
//           // 1. Generate invoice
//           const pdfBlob = await generateInvoice({
//             bookingType: 'Room',
//             formData,
//             price: totalAmount,
//             paymentId: response.razorpay_payment_id,
//           });

//           const url = window.URL.createObjectURL(pdfBlob);
//           const a = document.createElement('a');
//           a.href = url;
//           a.download = `Invoice_${response.razorpay_payment_id}.pdf`;
//           document.body.appendChild(a);
//           a.click();
//           a.remove();

//           // 2. Mark as paid
//           await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/bookings/payment-success`, {
//             method: 'PUT',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({
//               bookingId,
//               paymentId: response.razorpay_payment_id,
//               amount: totalAmount,
//             }),
//           });

//           // 3. Send confirmation email
//           await fetch('${import.meta.env.VITE_API_BASE_URL}/api/bookings/send-confirmation-email', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({
//               email: formData.email,
//               bookingType: 'Room',
//               amount: totalAmount,
//               paymentId: response.razorpay_payment_id,
//               checkIn: formData.checkIn,
//               checkOut: formData.checkOut,
//               phone: formData.phone,
//               adults: formData.adults,
//               children: formData.children,
//               roomId: formData.roomId,
//             }),
//           });

//           setStatusMessage({ type: 'success', message: '✅ Payment successful! Invoice downloaded and sent.' });
//           setPaymentDone(true);

//         },
//         prefill: {
//           name: formData.email,
//           email: formData.email,
//           contact: formData.phone,
//         },
//         theme: {
//           color: "#4db6ac", // Teal color for RoomBooking
//         },
//       };

//       const rzp = new window.Razorpay(options);
//       rzp.open();
//     } catch (err) {
//       console.error('Payment error:', err);
//       setStatusMessage({ type: 'error', message: 'Payment or update failed.' });
//     }
//   };

//   // Framer Motion Variants (Adapted from LawnBooking with teal adjustments)
//   const formContainerVariants = {
//     hidden: { opacity: 0, y: 40 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         duration: 0.6,
//         ease: "easeOut",
//         when: "beforeChildren",
//         staggerChildren: 0.1,
//       },
//     },
//   };

//   const itemVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: { y: 0, opacity: 1 },
//   };

//   const buttonVariants = {
//     hover: { scale: 1.03, boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)" },
//     tap: { scale: 0.97 },
//   };

//   const statusVariants = {
//     initial: { opacity: 0, y: -10 },
//     animate: { opacity: 1, y: 0 },
//     exit: { opacity: 0, y: -10 },
//   };


//   return (
//     <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
//       <motion.div
//         className="max-w-xl w-full mx-auto p-6 sm:p-8 bg-white border border-teal-300 rounded-3xl shadow-2xl overflow-hidden"
//         variants={formContainerVariants}
//         initial="hidden"
//         animate="visible"
//       >
//         <h2 className="text-2xl sm:text-3xl font-extrabold mb-6 text-center text-teal-700 drop-shadow-md">
//           Book Your Room
//         </h2>

//         {/* Status Message Display */}
//         <AnimatePresence>
//           {statusMessage.message && (
//             <motion.p
//               className={`text-center py-2 px-3 rounded-lg mb-4 text-base font-medium
//                 ${statusMessage.type === 'success' ? 'bg-green-100 text-green-700' : ''}
//                 ${statusMessage.type === 'error' ? 'bg-red-100 text-red-700' : ''}
//                 ${statusMessage.type === 'info' ? 'bg-blue-100 text-blue-700' : ''}
//               `}
//               variants={statusVariants}
//               initial="initial"
//               animate="animate"
//               exit="exit"
//             >
//               {statusMessage.message}
//             </motion.p>
//           )}
//         </AnimatePresence>

//         {isReadOnly && selectedRoom ? (
//           <motion.div
//             className="bg-blue-50 border border-blue-200 p-4 sm:p-6 rounded-xl shadow-inner-lg text-blue-800"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5, ease: "easeOut" }}
//           >
//             <h3 className="text-lg sm:text-xl font-bold mb-3 text-blue-700 flex items-center gap-2">
//               <span className="text-2xl">✅</span> Booking Approved!
//             </h3>
//             <p className="mb-1 text-sm sm:text-base"><strong>Room:</strong> {selectedRoom.name} - ₹{selectedRoom.price}</p>
//             <p className="mb-1 text-sm sm:text-base"><strong>Check-In:</strong> {formData.checkIn}</p>
//             <p className="mb-1 text-sm sm:text-base"><strong>Check-Out:</strong> {formData.checkOut}</p>
//             <p className="mb-1 text-sm sm:text-base"><strong>Guests:</strong> {formData.adults} Adult(s), {formData.children} Child(ren)</p>
//             <p className="mb-1 text-sm sm:text-base"><strong>Email:</strong> {formData.email}</p>
//             <p className="mb-3 text-sm sm:text-base"><strong>Phone:</strong> {formData.phone}</p>
//             <p className="mt-2 text-xl sm:text-2xl font-extrabold text-teal-900 text-right">
//               Total: ₹{totalAmount}
//             </p>
//             {!paymentDone && (
//   <motion.button
//     type="button"
//     onClick={handlePayment}
//     disabled={!captchaVerified && !bookingApproved}
//     className="w-full mt-4 bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-xl font-bold text-lg shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
//     whileHover="hover"
//     whileTap="tap"
//     variants={buttonVariants}
//   >
//     Pay Now
//   </motion.button>
// )}

//           </motion.div>
//         ) : (
//           isReadOnly && <p className="text-center text-gray-600 italic py-4">Loading booking summary...</p>
//         )}

//         {!isReadOnly && (
//           <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
//             {/* Room Select */}
//             <motion.div variants={itemVariants}>
//               <label htmlFor="roomId" className="block text-base font-semibold text-gray-700 mb-1">
//                 Select Room:
//               </label>
//               <div className="relative">
//                 <select
//                   id="roomId"
//                   name="roomId"
//                   value={formData.roomId}
//                   onChange={handleChange}
//                   className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 appearance-none bg-white pr-10 text-gray-800 text-base"
//                   required
//                 >
//                   {availableRooms.length === 0 ? (
//                     <option value="">Loading rooms...</option>
//                   ) : (
//                     availableRooms.map(room => (
//                       <option key={room._id} value={room._id}>
//                         {room.name} - ₹{room.price} (Max {room.members} guests)
//                       </option>
//                     ))
//                   )}
//                 </select>
//                 <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
//                   <svg className="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.757 7.586 5.343 9z" /></svg>
//                 </div>
//               </div>
//             </motion.div>

//             {/* Adults and Children */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <motion.div variants={itemVariants}>
//                 <label htmlFor="adults" className="block text-base font-semibold text-gray-700 mb-1">
//                   Adults:
//                 </label>
//                 <input
//                   type="number"
//                   id="adults"
//                   name="adults"
//                   min="1"
//                   value={formData.adults}
//                   onChange={handleChange}
//                   className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 text-gray-800 text-base"
//                   required
//                 />
//               </motion.div>
//               <motion.div variants={itemVariants}>
//                 <label htmlFor="children" className="block text-base font-semibold text-gray-700 mb-1">
//                   Children:
//                 </label>
//                 <input
//                   type="number"
//                   id="children"
//                   name="children"
//                   min="0"
//                   value={formData.children}
//                   onChange={handleChange}
//                   className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 text-gray-800 text-base"
//                   required
//                 />
//               </motion.div>
//             </div>

//             {/* Check-in and Check-out */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <motion.div variants={itemVariants}>
//                 <label htmlFor="checkIn" className="block text-base font-semibold text-gray-700 mb-1">
//                   Check-In Date:
//                 </label>
//                 <input
//                   type="date"
//                   id="checkIn"
//                   name="checkIn"
//                   min={today}
//                   value={formData.checkIn}
//                   onChange={handleChange}
//                   className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 text-gray-800 text-base"
//                   required
//                 />
//               </motion.div>
//               <motion.div variants={itemVariants}>
//                 <label htmlFor="checkOut" className="block text-base font-semibold text-gray-700 mb-1">
//                   Check-Out Date:
//                 </label>
//                 <input
//                   type="date"
//                   id="checkOut"
//                   name="checkOut"
//                   min={formData.checkIn || today}
//                   value={formData.checkOut}
//                   onChange={handleChange}
//                   className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 text-gray-800 text-base"
//                   required
//                 />
//               </motion.div>
//             </div>

//             {/* Email */}
//             <motion.div variants={itemVariants}>
//               <label htmlFor="email" className="block text-base font-semibold text-gray-700 mb-1">
//                 Email:
//               </label>
//               <input
//                 type="email"
//                 id="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 text-gray-800 placeholder-gray-500 text-base"
//                 placeholder="your.email@example.com"
//                 required
//               />
//             </motion.div>

//             {/* Phone No. */}
//             <motion.div variants={itemVariants}>
//               <label htmlFor="phone" className="block text-base font-semibold text-gray-700 mb-1">
//                 Phone Number:
//               </label>
//               <input
//                 type="tel"
//                 id="phone"
//                 name="phone"
//                 value={formData.phone}
//                 onChange={handleChange}
//                 className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 text-gray-800 placeholder-gray-500 text-base"
//                 placeholder="e.g., 9876543210"
//                 maxLength="10"
//                 pattern="[6-9]{1}[0-9]{9}"
//                 title="Please enter a valid 10-digit Indian phone number (starts with 6-9)"
//                 required
//               />
//             </motion.div>

//             {/* Booking Summary */}
//             {(formData.roomId && formData.adults > 0 && formData.checkIn && formData.checkOut && formData.email && formData.phone) && (
//               <motion.div
//                 className="bg-teal-50 border border-teal-200 p-4 rounded-xl shadow-inner-lg text-teal-800"
//                 initial={{ opacity: 0, height: 0 }}
//                 animate={{ opacity: 1, height: 'auto' }}
//                 transition={{ duration: 0.5, ease: "easeOut" }}
//               >
//                 <h3 className="text-lg font-bold mb-2 text-teal-700">Your Booking Summary</h3>
//                 {selectedRoom && <p className="mb-0.5 text-sm"><strong>Room:</strong> {selectedRoom.name}</p>}
//                 <p className="mb-0.5 text-sm"><strong>Guests:</strong> {formData.adults} Adult(s){formData.children > 0 ? `, ${formData.children} Child(ren)` : ''}</p>
//                 <p className="mb-0.5 text-sm"><strong>Check-In:</strong> {formData.checkIn}</p>
//                 <p className="mb-0.5 text-sm"><strong>Check-Out:</strong> {formData.checkOut}</p>
//                 <p className="mb-0.5 text-sm"><strong>Email:</strong> {formData.email}</p>
//                 <p className="mb-2 text-sm"><strong>Phone:</strong> {formData.phone}</p>
//                 {selectedRoom && (
//                   <p className="mt-1 text-xl font-extrabold text-teal-900">
//                     Total: ₹{selectedRoomPrice} x {calculateDays()} day(s) = ₹{totalAmount}
//                   </p>
//                 )}
//               </motion.div>
//             )}

//             {/* ReCAPTCHA */}
//             <motion.div variants={itemVariants} className="flex justify-center mt-6">
//               <ReCAPTCHA
//                 sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
//                 onChange={() => setCaptchaVerified(true)}
//                 onExpired={() => setCaptchaVerified(false)}
//               />
//             </motion.div>

//             {/* Submit Button */}
//             <motion.button
//   type="button"
//   onClick={handleSubmitBooking}
//   disabled={
//     bookingSubmitted || 
//     !captchaVerified || 
//     !formData.roomId || 
//     !formData.checkIn || 
//     !formData.checkOut || 
//     !formData.email || 
//     !formData.phone
//   }
//   className="w-full mt-4 bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-xl font-bold text-lg shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
//   whileHover="hover"
//   whileTap="tap"
//   variants={buttonVariants}
// >
//   {bookingSubmitted ? 'Booking Submitted ✅' : 'Submit Booking for Approval'}
// </motion.button>

//           </form>
//         )}
//       </motion.div>
//     </div>
//   );
// };

// export default RoomBooking;
