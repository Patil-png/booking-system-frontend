import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Import AnimatePresence for exit animations
import { createBooking } from '../../src/utils/api';
import { generateInvoice } from '../../src/utils/invoiceGenerator';
import { useNavigate } from 'react-router-dom'; // ✅ CORRECT PLACE

const AdminCustomLawnBooking = () => {
    const navigate = useNavigate();
  
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
        const res = await fetch('http://localhost:5000/api/options');
        if (!res.ok) throw new Error(`Server responded with status ${res.status}`);
        const data = await res.json();
        const lawns = Array.isArray(data) ? data.filter(item => item.type === 'Lawn') : data.lawns || [];
        setLawnSlots(lawns);
        if (lawns.length > 0) {
          setFormData(prev => ({ ...prev, slot: lawns[0].name }));
        }
      } catch (err) {
        console.error('Failed to fetch slots', err);
        setStatusMessage('Failed to load lawn slots. Please try again later.');
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
    if (!/^\d{10}$/.test(formData.phone)) {
      setStatusMessage('❌ Enter a valid 10-digit phone number.');
      return;
    }
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
     if (new Date(formData.checkIn) < new Date(new Date().setHours(0,0,0,0))) { // Check if check-in is in the past
        setStatusMessage('❌ Check-in date cannot be in the past.');
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
        const orderRes = await fetch('http://localhost:5000/api/razorpay/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: totalAmount }),
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
            name: formData.email,
            email: formData.email,
            contact: formData.phone,
          },
          theme: { color: "#10b981" },
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
      slot: lawnSlots[0]?.name || '',
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
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 18,
        staggerChildren: 0.07, // Slightly faster stagger for children
        delayChildren: 0.15 // Slight delay before children start animating
      }
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 120, // Slightly more springy
        damping: 15,
        duration: 0.4
      }
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.02,
      boxShadow: "0px 12px 25px rgba(0, 0, 0, 0.3)", // More pronounced shadow
      transition: { duration: 0.2, ease: "easeOut" }
    },
    tap: {
      scale: 0.98,
      boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.1)", // Smaller shadow on tap
      transition: { duration: 0.1, ease: "easeIn" }
    },
  };

  const statusMessageVariants = {
    hidden: { opacity: 0, y: -30, scale: 0.85 },
    visible: {
      opacity: 1, y: 0, scale: 1,
      transition: {
        type: "spring", stiffness: 250, damping: 20 // More energetic bounce
      }
    },
    exit: {
      opacity: 0, y: -30, scale: 0.85,
      transition: { ease: "easeOut", duration: 0.3 }
    }
  };


  return (
    <motion.div
      className="p-4 sm:p-6 md:p-8 max-w-xl mx-auto bg-white shadow-2xl rounded-xl border border-green-100 mt-8 mb-10 overflow-hidden"
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

      <motion.h2 className="text-2xl sm:text-3xl font-extrabold text-center mb-6 sm:mb-8 text-green-800" variants={itemVariants}>
        Admin Lawn Booking
      </motion.h2>

      <AnimatePresence>
        {statusMessage && (
          <motion.div
            className={`p-3 sm:p-4 mb-5 rounded-lg font-medium text-center shadow-md text-sm sm:text-base ${statusMessage.includes('✅') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}
            variants={statusMessageVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {statusMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4 sm:space-y-6">
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <label htmlFor="bookingType" className="font-semibold text-gray-700 text-base sm:text-lg flex-shrink-0 mb-1 sm:mb-0">Booking Type:</label>
          <select
            id="bookingType"
            value={bookingType}
            onChange={e => setBookingType(e.target.value)}
            className="flex-grow border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-2.5 bg-white text-gray-800 shadow-sm focus:border-green-500 focus:ring-green-500 transition duration-200 ease-in-out cursor-pointer text-base sm:text-lg"
          >
            <option value="slot">Slot Booking (per day)</option>
            <option value="perPlate">Per Plate Booking (catering)</option>
          </select>
        </motion.div>

        {bookingType === 'slot' ? (
          <motion.div variants={itemVariants} key="slot-booking-fields"> {/* Added key for AnimatePresence */}
            <label htmlFor="slot" className="block text-gray-700 text-sm font-bold mb-2">Select Lawn Slot</label>
            <select
              id="slot"
              name="slot"
              value={formData.slot}
              onChange={handleChange}
              className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 transition duration-200 ease-in-out bg-white text-base sm:text-lg"
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
          <AnimatePresence mode="wait"> {/* Use AnimatePresence for smooth transition between booking types */}
            <motion.div variants={itemVariants} key="per-plate-booking-fields"> {/* Added key for AnimatePresence */}
              <motion.div variants={itemVariants} className="mb-4 sm:mb-6">
                <label htmlFor="plates" className="block text-gray-700 text-sm font-bold mb-2">Number of Plates</label>
                <input
                  type="number"
                  id="plates"
                  name="plates"
                  value={formData.plates}
                  onChange={handleChange}
                  min="0"
                  className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 transition duration-200 ease-in-out text-base sm:text-lg"
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
                  className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 transition duration-200 ease-in-out text-base sm:text-lg"
                  placeholder="e.g., 500.00"
                />
              </motion.div>
            </motion.div>
          </AnimatePresence>
        )}

        <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6" variants={itemVariants}>
          <div>
            <label htmlFor="checkIn" className="block text-gray-700 text-sm font-bold mb-2">Check-In Date</label>
            <input
              type="date"
              id="checkIn"
              name="checkIn"
              value={formData.checkIn}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]} // Min date is today
              className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 transition duration-200 ease-in-out text-base sm:text-lg"
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
              min={formData.checkIn || new Date().toISOString().split('T')[0]}
              className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 transition duration-200 ease-in-out text-base sm:text-lg"
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
            className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 transition duration-200 ease-in-out text-base sm:text-lg"
            placeholder="e.g., guest@example.com"
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">Guest Phone Number</label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 transition duration-200 ease-in-out text-base sm:text-lg"
            placeholder="Enter 10-digit phone number"
            maxLength="10"
          />
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <label htmlFor="paymentMethod" className="font-semibold text-gray-700 text-base sm:text-lg flex-shrink-0 mb-1 sm:mb-0">Payment Method:</label>
          <select
            id="paymentMethod"
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            className="flex-grow border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-2.5 bg-white text-gray-800 shadow-sm focus:border-green-500 focus:ring-green-500 transition duration-200 ease-in-out cursor-pointer text-base sm:text-lg"
          >
            <option value="online">Online (Razorpay)</option>
            <option value="offline">Offline (Cash/Other)</option>
          </select>
        </motion.div>

        <motion.div variants={itemVariants} className="text-right pt-2">
          <p className="text-xl sm:text-2xl font-extrabold text-green-800">
            Total Amount: <span className="text-green-600">₹{totalAmount.toFixed(2)}</span>
          </p>
        </motion.div>

        <motion.button
          onClick={handleBooking}
          className="w-full bg-gradient-to-r from-green-600 to-green-800 text-white px-5 py-3 sm:py-4 rounded-lg font-bold text-lg sm:text-xl shadow-lg hover:from-green-700 hover:to-green-900 focus:outline-none focus:ring-4 focus:ring-green-300 active:bg-green-700 transition duration-300 ease-in-out transform origin-center"
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
