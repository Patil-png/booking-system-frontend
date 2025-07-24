// 📁 LawnBooking.jsx

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Added AnimatePresence
import { sendOTP, verifyOTP } from '../../utils/otpService';
import { generateInvoice } from '../../utils/invoiceGenerator';
import { createBooking } from '../../utils/api';

const LawnBooking = () => {
  const [formData, setFormData] = useState({
    slot: '',
    checkIn: '',
    checkOut: '',
    email: '',
    phone: '',
  });

  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [blockedDates, setBlockedDates] = useState([]);
  const [lawnSlots, setLawnSlots] = useState([]);
  const [statusMessage, setStatusMessage] = useState({ type: '', message: '' }); // Changed to object

  const selectedSlot = lawnSlots.find(slot => slot.name === formData.slot);
  const selectedSlotPrice = selectedSlot?.price || 0; // Consistent naming

  const calculateDays = () => {
    const checkIn = new Date(formData.checkIn);
    const checkOut = new Date(formData.checkOut);
    if (checkOut <= checkIn) return 1; // Ensure at least 1 day
    const diffTime = checkOut - checkIn;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const totalAmount = selectedSlotPrice * calculateDays(); // Use selectedSlotPrice

  useEffect(() => {
    const fetchBlockedDates = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/blocked-dates?type=Lawn`);
        const data = await res.json();
        const converted = data.map(item => new Date(item.date).toISOString().split('T')[0]); // Standardize date format
        setBlockedDates(converted);
      } catch (err) {
        setStatusMessage({ type: 'error', message: 'Failed to load blocked dates.' }); // Consistent status message
      }
    };
    fetchBlockedDates();
  }, []);

  useEffect(() => {
    const fetchLawnSlots = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/options`);
        const data = await res.json();
        const lawns = Array.isArray(data) ? data.filter(item => item.type === 'Lawn') : data.lawns || [];
        setLawnSlots(lawns);
        if (lawns.length > 0 && !formData.slot) {
          setFormData(prev => ({ ...prev, slot: lawns[0].name }));
        }
      } catch (err) {
        setStatusMessage({ type: 'error', message: 'Failed to load lawn slot options.' }); // Consistent status message
      }
    };
    fetchLawnSlots();
  }, [formData.slot]); // Dependency updated

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      const onlyNums = value.replace(/\D/g, '');
      setFormData({ ...formData, [name]: onlyNums.slice(0, 10) });
      return;
    }

    if (name === "checkIn" || name === "checkOut") {
      if (blockedDates.includes(value)) {
        setStatusMessage({ type: 'error', message: `⚠️ ${value} is blocked.` });
        setFormData({ ...formData, [name]: '' }); // Clear the invalid date
      } else {
        setFormData({ ...formData, [name]: value });
        setStatusMessage({ type: '', message: '' }); // Clear status on valid input
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSendOtp = async () => {
    setStatusMessage({ type: 'info', message: 'Sending OTP...' });
    if (!formData.email || !formData.phone) {
      setStatusMessage({ type: 'error', message: "⚠️ Please enter both email and phone." });
      return;
    }

    try {
      await sendOTP(formData.email, formData.phone);
      setStatusMessage({ type: 'success', message: "✅ OTP sent to your email." });
      setOtpSent(true);
    } catch (err) {
      console.error("Send OTP error:", err);
      setStatusMessage({ type: 'error', message: "❌ Failed to send OTP. Please try again." });
    }
  };

  const handleVerifyOtp = async () => {
    setStatusMessage({ type: 'info', message: 'Verifying OTP...' });
    if (!otpInput) {
      setStatusMessage({ type: 'error', message: 'Please enter the OTP.' });
      return;
    }
    try {
      const success = await verifyOTP(formData.email, otpInput);
      if (success) {
        setStatusMessage({ type: 'success', message: "✅ OTP Verified!" });
        setIsVerified(true);
      } else {
        setStatusMessage({ type: 'error', message: "❌ Invalid OTP. Please try again." });
      }
    } catch (err) {
      console.error("Verify OTP error:", err);
      setStatusMessage({ type: 'error', message: "❌ OTP verification failed. Server error." });
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

  const handlePayment = async () => {
    setStatusMessage({ type: 'info', message: 'Processing payment...' });

    const res = await loadRazorpayScript();
    if (!res) {
      setStatusMessage({ type: 'error', message: 'Razorpay SDK failed to load.' });
      return;
    }

    // Double-check blocked dates at the final step
    const normalizedCheckIn = new Date(formData.checkIn).toISOString().split('T')[0];
    const normalizedCheckOut = new Date(formData.checkOut).toISOString().split('T')[0];

    if (blockedDates.includes(normalizedCheckIn) || blockedDates.includes(normalizedCheckOut)) {
      setStatusMessage({ type: 'error', message: "⚠️ One of the selected dates is blocked. Please choose different dates." });
      return;
    }

    try {
      const orderRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/razorpay/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: totalAmount }),
      });

      const data = await orderRes.json();
      const order = data.order;

      if (!order?.id) {
        setStatusMessage({ type: 'error', message: 'Failed to initiate payment.' });
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "Hotel Booking",
        description: "Lawn Slot Reservation",
        order_id: order.id,
        handler: async (response) => {
          // Generate invoice
          generateInvoice({
            bookingType: 'Lawn',
            formData: { ...formData, checkIn: normalizedCheckIn, checkOut: normalizedCheckOut },
            price: totalAmount,
            paymentId: response.razorpay_payment_id,
          });

          // Create booking in backend
          await createBooking({
            ...formData,
            checkIn: normalizedCheckIn,
            checkOut: normalizedCheckOut,
            type: 'Lawn',
            amount: totalAmount,
            paymentId: response.razorpay_payment_id,
          });

          setStatusMessage({ type: 'success', message: "✅ Booking successful! Invoice sent to your email." });

          // Reset form and UI after successful booking
          setFormData({
            slot: '',
            checkIn: '',
            checkOut: '',
            email: '',
            phone: '',
          });
          setOtpSent(false);
          setOtpInput('');
          setIsVerified(false);

          // Reload blocked dates to reflect the new booking (or re-fetch)
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        },
        prefill: {
          name: formData.email,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#22c55e", // Green color for LawnBooking
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("❌ Razorpay error:", err);
      setStatusMessage({ type: 'error', message: "⚠️ Payment failed or booking could not be confirmed. Please contact support if payment was deducted." });
    }
  };


  // Framer Motion Variants (Copied from RoomBooking with green adjustments)
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

  // Get current date for min attribute on date inputs
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-lime-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <motion.div
        className="max-w-xl w-full mx-auto p-6 sm:p-8 bg-white border border-green-300 rounded-3xl shadow-2xl overflow-hidden"
        variants={formContainerVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-6 text-center text-green-700 drop-shadow-md">
          Book Lawn Slot
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

        <form className="space-y-4">
          {/* Select Slot Type */}
          <motion.div variants={itemVariants}>
            <label htmlFor="slot" className="block text-base font-semibold text-gray-700 mb-1">
              Select Lawn Slot:
            </label>
            <div className="relative">
              <select
                id="slot"
                name="slot"
                value={formData.slot}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 appearance-none bg-white pr-10 text-gray-800 text-base"
                required
                autoComplete="off"
              >
                <option value="" disabled>Choose a Lawn Slot</option>
                {lawnSlots.length > 0 ? (
                  lawnSlots.map(slot => (
                    <option key={slot.name} value={slot.name}>
                      {slot.name} - ₹{slot.price} per day
                    </option>
                  ))
                ) : (
                  <option value="" disabled>Loading slots...</option>
                )}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                <svg className="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.757 7.586 5.343 9z" /></svg>
              </div>
            </div>
          </motion.div>

          {/* Check-In Date */}
          <motion.div variants={itemVariants}>
            <label htmlFor="checkIn" className="block text-base font-semibold text-gray-700 mb-1">
              Check-In Date:
            </label>
            <input
              id="checkIn"
              name="checkIn"
              type="date"
              value={formData.checkIn}
              onChange={handleChange}
              min={today}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-gray-800 text-base"
              required
              autoComplete="off"
            />
          </motion.div>

          {/* Check-Out Date */}
          <motion.div variants={itemVariants}>
            <label htmlFor="checkOut" className="block text-base font-semibold text-gray-700 mb-1">
              Check-Out Date:
            </label>
            <input
              id="checkOut"
              name="checkOut"
              type="date"
              value={formData.checkOut}
              onChange={handleChange}
              min={formData.checkIn || today}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-gray-800 text-base"
              required
              autoComplete="off"
            />
          </motion.div>

          {/* Email */}
          <motion.div variants={itemVariants}>
            <label htmlFor="email" className="block text-base font-semibold text-gray-700 mb-1">
              Email:
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-gray-800 placeholder-gray-500 text-base"
              placeholder="your.email@example.com"
              required
              autoComplete="email"
            />
          </motion.div>

          {/* Phone No. */}
          <motion.div variants={itemVariants}>
            <label htmlFor="phone" className="block text-base font-semibold text-gray-700 mb-1">
              Phone Number:
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-gray-800 placeholder-gray-500 text-base"
              placeholder="e.g., 9876543210"
              maxLength="10"
              pattern="[6-9]{1}[0-9]{9}"
              title="Please enter a valid 10-digit Indian phone number (starts with 6-9)"
              required
              autoComplete="tel"
            />
          </motion.div>

          {/* Booking Summary */}
          {(formData.slot && formData.checkIn && formData.checkOut && formData.email && formData.phone) && (
            <motion.div
              className="bg-green-50 border border-green-200 p-4 rounded-xl shadow-inner-lg text-green-800"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <h3 className="text-lg font-bold mb-2 text-green-700">Your Booking Summary</h3>
              {selectedSlot && <p className="mb-0.5 text-sm"><strong>Slot:</strong> {selectedSlot.name}</p>}
              <p className="mb-0.5 text-sm"><strong>Check-In:</strong> {formData.checkIn}</p>
              <p className="mb-0.5 text-sm"><strong>Check-Out:</strong> {formData.checkOut}</p>
              <p className="mb-0.5 text-sm"><strong>Email:</strong> {formData.email}</p>
              <p className="mb-2 text-sm"><strong>Phone:</strong> {formData.phone}</p>
              {selectedSlot && (
                <p className="mt-1 text-xl font-extrabold text-green-900">
                  Total: ₹{selectedSlotPrice} x {calculateDays()} day(s) = ₹{totalAmount}
                </p>
              )}
            </motion.div>
          )}

          {/* OTP Section */}
          <AnimatePresence mode="wait">
            {!otpSent && !isVerified && (
              <motion.div
                key="send-otp-btn"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <motion.button
                  type="button"
                  onClick={handleSendOtp}
                  whileHover="hover"
                  whileTap="tap"
                  variants={buttonVariants}
                  disabled={!formData.slot || !formData.checkIn || !formData.checkOut || !formData.email || !formData.phone}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold text-lg shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send OTP for Verification
                </motion.button>
              </motion.div>
            )}

            {otpSent && !isVerified && (
              <motion.div
                key="verify-otp-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="mt-3 flex flex-col gap-3"
              >
                <input
                  type="text"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-gray-800 placeholder-gray-500 text-base"
                  placeholder="Enter 6-digit OTP"
                  maxLength="6"
                  required
                />
                <motion.button
                  type="button"
                  onClick={handleVerifyOtp}
                  whileHover="hover"
                  whileTap="tap"
                  variants={buttonVariants}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold text-lg shadow-md transition-all duration-300"
                >
                  Verify OTP
                </motion.button>
              </motion.div>
            )}

            {isVerified && (
              <motion.div
                key="book-now-btn"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <motion.button
                  type="button"
                  onClick={handlePayment}
                  whileHover="hover"
                  whileTap="tap"
                  variants={buttonVariants}
                  className="w-full mt-4 bg-green-800 hover:bg-green-900 text-white py-3 rounded-xl font-bold text-xl shadow-xl transition-all duration-300 transform hover:scale-102 active:scale-98"
                >
                  Confirm Booking (Pay ₹{totalAmount})
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </motion.div>
    </div>
  );
};

export default LawnBooking;
