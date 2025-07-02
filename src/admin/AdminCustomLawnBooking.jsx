import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Import AnimatePresence for exit animations
import { createBooking } from '../../src/utils/api';
import { generateInvoice } from '../../src/utils/invoiceGenerator';

const AdminCustomLawnBooking = () => {
  const [bookingType, setBookingType] = useState('slot');
  const [formData, setFormData] = useState({
    slot: '',
    checkIn: '',
    checkOut: '',
    plates: '',
    pricePerPlate: '',
    email: '',
    phone: '',
    paymentMethod: 'online',
  });

  const [lawnSlots, setLawnSlots] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    const fetchLawnSlots = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/options`);
        const data = await res.json();
        const lawns = Array.isArray(data) ? data.filter(item => item.type === 'Lawn') : data.lawns || [];
        setLawnSlots(lawns);
        if (lawns.length > 0) {
          setFormData(prev => ({ ...prev, slot: lawns[0].name }));
        }
      } catch (err) {
        console.error('Failed to fetch slots', err); // Added error logging
        setStatusMessage('Failed to load lawn slots. Please try again later.'); // User-friendly message
      }
    };
    fetchLawnSlots();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      const cleaned = value.replace(/\D/g, '').slice(0, 10);
      setFormData({ ...formData, [name]: cleaned });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const calculateDays = () => {
    const checkIn = new Date(formData.checkIn);
    const checkOut = new Date(formData.checkOut);
    // Ensure check-out is after check-in, otherwise default to 1 day
    if (checkOut <= checkIn) return 1;
    const days = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 1;
  };

  const calculateSlotTotal = () => {
    const days = calculateDays();
    const slot = lawnSlots.find(s => s.name === formData.slot);
    const price = slot?.price || 0;
    return price * days;
  };

  const calculatePlateTotal = () => {
    const plates = Number(formData.plates || 0);
    const price = Number(formData.pricePerPlate || 0);
    // Ensure plates and price are positive before multiplying
    if (plates <= 0 || price <= 0) return 0;
    return plates * price * calculateDays();
  };

  const totalAmount = bookingType === 'slot' ? calculateSlotTotal() : calculatePlateTotal();

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleBooking = async () => {
    // --- Input Validation (Existing Functionality - Unchanged) ---
    // Phone validation
    if (!/^\d{10}$/.test(formData.phone)) {
      setStatusMessage('❌ Enter a valid 10-digit phone number.');
      return;
    }
    // Basic form field validation
    if (!formData.email || !formData.phone || !formData.checkIn || !formData.checkOut ||
        (bookingType === 'slot' && !formData.slot) ||
        (bookingType === 'perPlate' && (!formData.plates || !formData.pricePerPlate))) {
      setStatusMessage('❌ Please fill in all required booking details.');
      return;
    }
    if (new Date(formData.checkOut) < new Date(formData.checkIn)) {
      setStatusMessage('❌ Check-out date cannot be before check-in date.');
      return;
    }
    if (totalAmount <= 0) {
      setStatusMessage('❌ Total amount must be greater than zero. Check your selections.');
      return;
    }
    // --- End Input Validation ---


    const bookingDetails = {
      type: 'Lawn',
      email: formData.email,
      phone: formData.phone,
      paymentMethod: formData.paymentMethod,
      amount: totalAmount,
      ...(bookingType === 'slot'
        ? {
            bookingType: 'Slot',
            slot: formData.slot,
            checkIn: formData.checkIn,
            checkOut: formData.checkOut,
          }
        : {
            bookingType: 'PerPlate',
            plates: formData.plates,
            pricePerPlate: formData.pricePerPlate,
            checkIn: formData.checkIn,
            checkOut: formData.checkOut,
          }),
    };

    if (formData.paymentMethod === 'offline') {
      try {
        await createBooking({ ...bookingDetails, paymentId: 'OFFLINE' });
        generateInvoice({
          bookingType: 'Lawn-' + bookingType,
          formData,
          price: totalAmount,
          paymentId: 'OFFLINE',
        });
        setStatusMessage('✅ Offline booking successful.');
        resetForm();
      } catch (err) {
        console.error(err);
        setStatusMessage('❌ Booking failed. Please try again.');
      }
    } else { // Online Payment
      const res = await loadRazorpayScript();
      if (!res) {
        setStatusMessage('❌ Razorpay SDK failed to load. Please check your internet connection.');
        return;
      }

      try {
        const orderRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/razorpay/create-order`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: totalAmount }), // Removed * 100 as per user request
        });

        const { order } = await orderRes.json();
        if (!order || !order.id) {
          setStatusMessage('❌ Failed to create Razorpay order. Please try again.');
          return;
        }

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: order.amount,
          currency: "INR",
          name: "Lawn Booking",
          description: "Admin Initiated Booking",
          order_id: order.id,
          handler: async (response) => {
            const paymentId = response.razorpay_payment_id;
            try {
              await createBooking({ ...bookingDetails, paymentId });

              generateInvoice({
                bookingType: 'Lawn-' + bookingType,
                formData,
                price: totalAmount,
                paymentId,
              });

              setStatusMessage('✅ Online booking completed and invoice sent.');
              resetForm();
            } catch (err) {
              console.error(err);
              setStatusMessage('❌ Booking failed after successful payment. Please contact support.');
            }
          },
          prefill: {
            name: formData.email, // Using email as name for prefill
            email: formData.email,
            contact: formData.phone,
          },
          theme: { color: "#10b981" }, // Green theme for Razorpay
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (err) {
        console.error(err);
        setStatusMessage('❌ Online payment initiation failed. Server error or invalid amount.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      slot: lawnSlots[0]?.name || '', // Reset to first slot if available
      checkIn: '',
      checkOut: '',
      plates: '',
      pricePerPlate: '',
      email: '',
      phone: '',
      paymentMethod: 'online',
    });
  };

  // Framer Motion Variants
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 70,
        damping: 15,
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    },
  };

  const buttonVariants = {
    hover: { scale: 1.03, boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)" },
    tap: { scale: 0.97 },
  };

  const statusMessageVariants = {
    hidden: { opacity: 0, y: -20, scale: 0.8 },
    visible: {
      opacity: 1, y: 0, scale: 1,
      transition: {
        type: "spring", stiffness: 200, damping: 15
      }
    },
    exit: {
      opacity: 0, y: -20, scale: 0.8,
      transition: { ease: "easeOut", duration: 0.3 }
    }
  };


  return (
    <motion.div
      className="p-8 max-w-3xl mx-auto bg-white shadow-2xl rounded-xl border border-green-100 mt-10"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h2 className="text-3xl font-extrabold text-center mb-8 text-green-800" variants={itemVariants}>
        Admin Lawn Booking
      </motion.h2>

      <AnimatePresence>
        {statusMessage && (
          <motion.div
            className={`p-4 mb-6 rounded-lg font-medium text-center shadow-md ${statusMessage.includes('✅') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}
            variants={statusMessageVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {statusMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-6">
        <motion.div variants={itemVariants} className="flex items-center gap-4">
          <label htmlFor="bookingType" className="font-semibold text-gray-700 text-lg flex-shrink-0">Booking Type:</label>
          <select
            id="bookingType"
            value={bookingType}
            onChange={e => setBookingType(e.target.value)}
            className="flex-grow border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-800 shadow-sm focus:border-green-500 focus:ring-green-500 transition duration-200 ease-in-out cursor-pointer"
          >
            <option value="slot">Slot Booking (per day)</option>
            <option value="perPlate">Per Plate Booking (catering)</option>
          </select>
        </motion.div>

        {bookingType === 'slot' ? (
          <motion.div variants={itemVariants}>
            <label htmlFor="slot" className="block text-gray-700 text-sm font-bold mb-2">Select Lawn Slot</label>
            <select
              id="slot"
              name="slot"
              value={formData.slot}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 transition duration-200 ease-in-out bg-white"
            >
              {lawnSlots.length > 0 ? (
                lawnSlots.map(slot => (
                  <option key={slot.name} value={slot.name}>
                    {slot.name} - ₹{slot.price}/day
                  </option>
                ))
              ) : (
                <option value="">Loading Lawn Slots...</option>
              )}
            </select>
          </motion.div>
        ) : (
          <>
            <motion.div variants={itemVariants}>
              <label htmlFor="plates" className="block text-gray-700 text-sm font-bold mb-2">Number of Plates</label>
              <input
                type="number"
                id="plates"
                name="plates"
                value={formData.plates}
                onChange={handleChange}
                min="0"
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 transition duration-200 ease-in-out"
                placeholder="e.g., 100"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <label htmlFor="pricePerPlate" className="block text-gray-700 text-sm font-bold mb-2">Price per Plate (₹)</label>
              <input
                type="number"
                id="pricePerPlate"
                name="pricePerPlate"
                value={formData.pricePerPlate}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 transition duration-200 ease-in-out"
                placeholder="e.g., 500.00"
              />
            </motion.div>
          </>
        )}

        <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6" variants={itemVariants}>
          <div>
            <label htmlFor="checkIn" className="block text-gray-700 text-sm font-bold mb-2">Check-In Date</label>
            <input
              type="date"
              id="checkIn"
              name="checkIn"
              value={formData.checkIn}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 transition duration-200 ease-in-out"
            />
          </div>
          <div>
            <label htmlFor="checkOut" className="block text-gray-700 text-sm font-bold mb-2">Check-Out Date</label>
            <input
              type="date"
              id="checkOut"
              name="checkOut"
              value={formData.checkOut}
              onChange={handleChange}
              min={formData.checkIn || new Date().toISOString().split('T')[0]} // Ensure check-out is not before today or check-in
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 transition duration-200 ease-in-out"
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
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 transition duration-200 ease-in-out"
            placeholder="e.g., guest@example.com"
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">Guest Phone Number</label>
          <input
            type="text" // Keep as text to allow flexible input but validate with regex
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 transition duration-200 ease-in-out"
            placeholder="Enter 10-digit phone number"
            maxLength="10"
          />
        </motion.div>

        <motion.div variants={itemVariants} className="flex items-center gap-4">
          <label htmlFor="paymentMethod" className="font-semibold text-gray-700 text-lg flex-shrink-0">Payment Method:</label>
          <select
            id="paymentMethod"
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            className="flex-grow border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-800 shadow-sm focus:border-green-500 focus:ring-green-500 transition duration-200 ease-in-out cursor-pointer"
          >
            <option value="online">Online (Razorpay)</option>
            <option value="offline">Offline (Cash/Other)</option>
          </select>
        </motion.div>

        <motion.div variants={itemVariants} className="text-right pt-2">
          <p className="text-2xl font-extrabold text-green-800">
            Total Amount: <span className="text-green-600">₹{totalAmount.toFixed(2)}</span>
          </p>
        </motion.div>

        <motion.button
          onClick={handleBooking}
          className="w-full bg-gradient-to-r from-green-600 to-green-800 text-white px-6 py-3 rounded-lg font-bold text-xl shadow-lg hover:from-green-700 hover:to-green-900 focus:outline-none focus:ring-4 focus:ring-green-300 active:bg-green-700 transition duration-300 ease-in-out transform origin-center"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          {formData.paymentMethod === 'offline' ? 'Confirm Offline Booking' : 'Proceed to Online Payment'}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default AdminCustomLawnBooking;