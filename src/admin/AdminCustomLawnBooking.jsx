import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createBooking } from '../../src/utils/api';
import { generateInvoice } from '../../src/utils/invoiceGenerator';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  XCircleIcon,
  CalendarDaysIcon,
  EnvelopeIcon,
  PhoneIcon,
  CreditCardIcon,
  BanknotesIcon,
  UserGroupIcon,
  CurrencyRupeeIcon,
  ClockIcon,
  SparklesIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/solid';

const AdminCustomLawnBooking = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    checkIn: '',
    checkOut: '',
    plates: '',
    pricePerPlate: '',
    email: '',
    phone: '',
    paymentMethod: 'online',
  });

  const [statusMessage, setStatusMessage] = useState('');

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

  const calculateTotal = () => {
    const plates = Number(formData.plates || 0);
    const price = Number(formData.pricePerPlate || 0);
    if (plates <= 0 || price <= 0) return 0;
    return plates * price * calculateDays();
  };

  const totalAmount = calculateTotal();

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
    if (!/^\d{10}$/.test(formData.phone)) {
      setStatusMessage('❌ Enter a valid 10-digit phone number.');
      return;
    }
    if (!formData.email || !formData.phone || !formData.checkIn || !formData.checkOut || !formData.plates || !formData.pricePerPlate) {
      setStatusMessage('❌ Please fill in all required fields.');
      return;
    }
    if (new Date(formData.checkOut) < new Date(formData.checkIn)) {
      setStatusMessage('❌ Check-out date cannot be before check-in.');
      return;
    }
    if (new Date(formData.checkIn) < new Date(new Date().setHours(0, 0, 0, 0))) {
      setStatusMessage('❌ Check-in date cannot be in the past.');
      return;
    }
    if (totalAmount <= 0) {
      setStatusMessage('❌ Total amount must be greater than zero.');
      return;
    }

    const bookingDetails = {
      type: 'Lawn',
      bookingType: 'PerPlate',
      email: formData.email,
      phone: formData.phone,
      paymentMethod: formData.paymentMethod,
      amount: totalAmount,
      plates: formData.plates,
      pricePerPlate: formData.pricePerPlate,
      checkIn: formData.checkIn,
      checkOut: formData.checkOut,
    };

    if (formData.paymentMethod === 'offline') {
      try {
        await createBooking({ ...bookingDetails, paymentId: 'OFFLINE', isPaid: true });
        generateInvoice({
          bookingType: 'Lawn-PerPlate',
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
    } else {
      const res = await loadRazorpayScript();
      if (!res) {
        setStatusMessage('❌ Razorpay SDK failed to load.');
        return;
      }

      try {
        const orderRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/razorpay/create-order`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: totalAmount }),
        });

        const { order } = await orderRes.json();
        if (!order || !order.id) {
          setStatusMessage('❌ Failed to create Razorpay order.');
          return;
        }

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: order.amount,
          currency: "INR",
          name: "Lawn Booking",
          description: "Admin Catering Booking",
          order_id: order.id,
          handler: async (response) => {
            const paymentId = response.razorpay_payment_id;
            try {
              await createBooking({ ...bookingDetails, paymentId, isPaid: true });
              generateInvoice({
                bookingType: 'Lawn-PerPlate',
                formData,
                price: totalAmount,
                paymentId,
              });
              setStatusMessage('✅ Online booking completed and invoice sent.');
              resetForm();
            } catch (err) {
              console.error(err);
              setStatusMessage('❌ Booking failed after payment.');
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
        setStatusMessage('❌ Online payment failed.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      checkIn: '',
      checkOut: '',
      plates: '',
      pricePerPlate: '',
      email: '',
      phone: '',
      paymentMethod: 'online',
    });
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-6 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-2xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Back Button */}
        {/* Remove the back button section */}

        {/* Main Card */}
        <motion.div
          className="bg-white/90 backdrop-blur-sm shadow-2xl rounded-3xl overflow-hidden border border-white/20"
          variants={itemVariants}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 px-4 sm:px-6 py-4 sm:py-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-2xl mb-2 sm:mb-4 backdrop-blur-sm">
                <BuildingOfficeIcon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-2">
                Lawn Catering Booking
              </h1>
              <p className="text-emerald-100 text-xs sm:text-sm">
                Per Plate Administration Panel
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-8">
            {/* Status Message */}
            <AnimatePresence>
              {statusMessage && (
                <motion.div
                  className={`mb-4 sm:mb-6 p-2 sm:p-4 rounded-2xl text-xs sm:text-base font-medium text-center border-2 ${
                    statusMessage.includes('✅')
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-red-50 text-red-800 border-red-200'
                  }`}
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center justify-center space-x-2">
                    {statusMessage.includes('✅') ? (
                      <CheckCircleIcon className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
                    ) : (
                      <XCircleIcon className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
                    )}
                    <span>{statusMessage}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <div className="space-y-4 sm:space-y-6">
              {/* Plates and Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
                <motion.div variants={itemVariants}>
                  <label className="block text-xs sm:text-base font-semibold text-gray-700 mb-1 sm:mb-2 flex items-center space-x-2">
                    <UserGroupIcon className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
                    <span>Number of Plates</span>
                  </label>
                  <input
                    type="number"
                    name="plates"
                    value={formData.plates}
                    onChange={handleChange}
                    className="w-full px-2 py-2 sm:px-4 sm:py-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 text-xs sm:text-lg bg-white hover:shadow-md"
                    placeholder="e.g., 100"
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label className="block text-xs sm:text-base font-semibold text-gray-700 mb-1 sm:mb-2 flex items-center space-x-2">
                    <CurrencyRupeeIcon className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
                    <span>Price per Plate (₹)</span>
                  </label>
                  <input
                    type="number"
                    name="pricePerPlate"
                    value={formData.pricePerPlate}
                    onChange={handleChange}
                    className="w-full px-2 py-2 sm:px-4 sm:py-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 text-xs sm:text-lg bg-white hover:shadow-md"
                    placeholder="e.g., 500"
                  />
                </motion.div>
              </div>

              {/* Date Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
                <motion.div variants={itemVariants}>
                  <label className="block text-xs sm:text-base font-semibold text-gray-700 mb-1 sm:mb-2 flex items-center space-x-2">
                    <CalendarDaysIcon className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
                    <span>Check-In Date</span>
                  </label>
                  <input
                    type="date"
                    name="checkIn"
                    value={formData.checkIn}
                    onChange={handleChange}
                    className="w-full px-2 py-2 sm:px-4 sm:py-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 text-xs sm:text-lg bg-white hover:shadow-md"
                    min={new Date().toISOString().split("T")[0]}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label className="block text-xs sm:text-base font-semibold text-gray-700 mb-1 sm:mb-2 flex items-center space-x-2">
                    <ClockIcon className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
                    <span>Check-Out Date</span>
                  </label>
                  <input
                    type="date"
                    name="checkOut"
                    value={formData.checkOut}
                    onChange={handleChange}
                    className="w-full px-2 py-2 sm:px-4 sm:py-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 text-xs sm:text-lg bg-white hover:shadow-md"
                    min={formData.checkIn || new Date().toISOString().split("T")[0]}
                  />
                </motion.div>
              </div>

              {/* Guest Information */}
              <motion.div variants={itemVariants}>
                <label className="block text-xs sm:text-base font-semibold text-gray-700 mb-1 sm:mb-2 flex items-center space-x-2">
                  <EnvelopeIcon className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
                  <span>Guest Email</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-2 py-2 sm:px-4 sm:py-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 text-xs sm:text-lg bg-white hover:shadow-md"
                  placeholder="guest@example.com"
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-xs sm:text-base font-semibold text-gray-700 mb-1 sm:mb-2 flex items-center space-x-2">
                  <PhoneIcon className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
                  <span>Phone Number</span>
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-2 py-2 sm:px-4 sm:py-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 text-xs sm:text-lg bg-white hover:shadow-md"
                  placeholder="10-digit number"
                  maxLength={10}
                />
              </motion.div>

              {/* Payment Method */}
              <motion.div variants={itemVariants}>
                <label className="block text-xs sm:text-base font-semibold text-gray-700 mb-1 sm:mb-2 flex items-center space-x-2">
                  <CreditCardIcon className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
                  <span>Payment Method</span>
                </label>
                <div className="grid grid-cols-2 gap-2 sm:gap-4">
                  <motion.button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'online' })}
                    className={`p-2 sm:p-4 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 flex items-center justify-center space-x-2 font-medium text-xs sm:text-base ${
                      formData.paymentMethod === 'online'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <CreditCardIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span>Online</span>
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'offline' })}
                    className={`p-2 sm:p-4 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 flex items-center justify-center space-x-2 font-medium text-xs sm:text-base ${
                      formData.paymentMethod === 'offline'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <BanknotesIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span>Offline</span>
                  </motion.button>
                </div>
              </motion.div>

              {/* Total Amount */}
              <motion.div
                className="bg-gradient-to-r from-emerald-50 to-teal-50 p-3 sm:p-6 rounded-2xl border-2 border-emerald-200"
                variants={itemVariants}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <SparklesIcon className="h-4 w-4 sm:h-6 sm:w-6 text-emerald-600" />
                    <span className="text-xs sm:text-lg font-semibold text-emerald-800">Total Amount</span>
                  </div>
                  <div className="text-lg sm:text-3xl font-bold text-emerald-700">
                    ₹{totalAmount.toLocaleString('en-IN')}
                  </div>
                </div>
                {formData.plates && formData.pricePerPlate && (
                  <div className="mt-1 sm:mt-2 text-xs sm:text-sm text-emerald-600">
                    {formData.plates} plates × ₹{formData.pricePerPlate} × {calculateDays()} day{calculateDays() > 1 ? 's' : ''}
                  </div>
                )}
              </motion.div>

              {/* Submit Button */}
              <motion.button
                onClick={handleBooking}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white py-3 sm:py-5 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-lg transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center justify-center space-x-2 sm:space-x-3"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                variants={itemVariants}
              >
                {formData.paymentMethod === 'offline' ? (
                  <>
                    <CheckCircleIcon className="h-4 w-4 sm:h-6 sm:w-6" />
                    <span>Confirm Offline Booking</span>
                  </>
                ) : (
                  <>
                    <CreditCardIcon className="h-4 w-4 sm:h-6 sm:w-6" />
                    <span>Proceed to Online Payment</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AdminCustomLawnBooking;



// import React, { useEffect, useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { createBooking } from '../../src/utils/api';
// import { generateInvoice } from '../../src/utils/invoiceGenerator';
// import { useNavigate } from 'react-router-dom';
// import {
//   ArrowLeftIcon,
//   CheckCircleIcon,
//   XCircleIcon,
//   CalendarDaysIcon,
//   EnvelopeIcon,
//   PhoneIcon,
//   CreditCardIcon,
//   BanknotesIcon,
//   UserGroupIcon,
//   CurrencyRupeeIcon,
//   ClockIcon,
//   SparklesIcon,
//   BuildingOfficeIcon,
// } from '@heroicons/react/24/solid';

// const AdminCustomLawnBooking = () => {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     checkIn: '',
//     checkOut: '',
//     plates: '',
//     pricePerPlate: '',
//     email: '',
//     phone: '',
//     paymentMethod: 'online',
//   });

//   const [statusMessage, setStatusMessage] = useState('');

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     if (name === 'phone') {
//       const cleaned = value.replace(/\D/g, '').slice(0, 10);
//       setFormData({ ...formData, [name]: cleaned });
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const calculateDays = () => {
//     const checkIn = new Date(formData.checkIn);
//     const checkOut = new Date(formData.checkOut);
//     if (checkOut <= checkIn) return 1;
//     const days = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
//     return days > 0 ? days : 1;
//   };

//   const calculateTotal = () => {
//     const plates = Number(formData.plates || 0);
//     const price = Number(formData.pricePerPlate || 0);
//     if (plates <= 0 || price <= 0) return 0;
//     return plates * price * calculateDays();
//   };

//   const totalAmount = calculateTotal();

//   const loadRazorpayScript = () => {
//     return new Promise((resolve) => {
//       const script = document.createElement('script');
//       script.src = 'https://checkout.razorpay.com/v1/checkout.js';
//       script.onload = () => resolve(true);
//       script.onerror = () => resolve(false);
//       document.body.appendChild(script);
//     });
//   };

//   const handleBooking = async () => {
//     if (!/^\d{10}$/.test(formData.phone)) {
//       setStatusMessage('❌ Enter a valid 10-digit phone number.');
//       return;
//     }
//     if (!formData.email || !formData.phone || !formData.checkIn || !formData.checkOut || !formData.plates || !formData.pricePerPlate) {
//       setStatusMessage('❌ Please fill in all required fields.');
//       return;
//     }
//     if (new Date(formData.checkOut) < new Date(formData.checkIn)) {
//       setStatusMessage('❌ Check-out date cannot be before check-in.');
//       return;
//     }
//     if (new Date(formData.checkIn) < new Date(new Date().setHours(0, 0, 0, 0))) {
//       setStatusMessage('❌ Check-in date cannot be in the past.');
//       return;
//     }
//     if (totalAmount <= 0) {
//       setStatusMessage('❌ Total amount must be greater than zero.');
//       return;
//     }

//     const bookingDetails = {
//       type: 'Lawn',
//       bookingType: 'PerPlate',
//       email: formData.email,
//       phone: formData.phone,
//       paymentMethod: formData.paymentMethod,
//       amount: totalAmount,
//       plates: formData.plates,
//       pricePerPlate: formData.pricePerPlate,
//       checkIn: formData.checkIn,
//       checkOut: formData.checkOut,
//     };

//     if (formData.paymentMethod === 'offline') {
//       try {
//         await createBooking({ ...bookingDetails, paymentId: 'OFFLINE', isPaid: true });
//         generateInvoice({
//           bookingType: 'Lawn-PerPlate',
//           formData,
//           price: totalAmount,
//           paymentId: 'OFFLINE',
//         });
//         setStatusMessage('✅ Offline booking successful.');
//         resetForm();
//       } catch (err) {
//         console.error(err);
//         setStatusMessage('❌ Booking failed. Please try again.');
//       }
//     } else {
//       const res = await loadRazorpayScript();
//       if (!res) {
//         setStatusMessage('❌ Razorpay SDK failed to load.');
//         return;
//       }

//       try {
//         const orderRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/razorpay/create-order`, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ amount: totalAmount }),
//         });

//         const { order } = await orderRes.json();
//         if (!order || !order.id) {
//           setStatusMessage('❌ Failed to create Razorpay order.');
//           return;
//         }

//         const options = {
//           key: import.meta.env.VITE_RAZORPAY_KEY_ID,
//           amount: order.amount,
//           currency: "INR",
//           name: "Lawn Booking",
//           description: "Admin Catering Booking",
//           order_id: order.id,
//           handler: async (response) => {
//             const paymentId = response.razorpay_payment_id;
//             try {
//               await createBooking({ ...bookingDetails, paymentId, isPaid: true });
//               generateInvoice({
//                 bookingType: 'Lawn-PerPlate',
//                 formData,
//                 price: totalAmount,
//                 paymentId,
//               });
//               setStatusMessage('✅ Online booking completed and invoice sent.');
//               resetForm();
//             } catch (err) {
//               console.error(err);
//               setStatusMessage('❌ Booking failed after payment.');
//             }
//           },
//           prefill: {
//             name: formData.email,
//             email: formData.email,
//             contact: formData.phone,
//           },
//           theme: { color: "#10b981" },
//         };

//         const rzp = new window.Razorpay(options);
//         rzp.open();
//       } catch (err) {
//         console.error(err);
//         setStatusMessage('❌ Online payment failed.');
//       }
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       checkIn: '',
//       checkOut: '',
//       plates: '',
//       pricePerPlate: '',
//       email: '',
//       phone: '',
//       paymentMethod: 'online',
//     });
//   };

//   const containerVariants = {
//     hidden: { opacity: 0, y: 50 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         duration: 0.8,
//         ease: [0.25, 0.46, 0.45, 0.94],
//         when: "beforeChildren",
//         staggerChildren: 0.1
//       }
//     }
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         duration: 0.5,
//         ease: [0.25, 0.46, 0.45, 0.94]
//       }
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-6 px-4 sm:px-6 lg:px-8">
//       <motion.div
//         className="max-w-2xl mx-auto"
//         variants={containerVariants}
//         initial="hidden"
//         animate="visible"
//       >
//         {/* Back Button */}
//         <motion.button
//           onClick={() => navigate(-1)}
//           className="mb-6 flex items-center space-x-2 text-emerald-700 hover:text-emerald-900 font-medium text-sm sm:text-base transition-colors duration-200 group"
//           whileHover={{ x: -5 }}
//           whileTap={{ scale: 0.95 }}
//           variants={itemVariants}
//         >
//           <ArrowLeftIcon className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-[-2px] transition-transform duration-200" />
//           <span>Back to Dashboard</span>
//         </motion.button>

//         {/* Main Card */}
//         <motion.div
//           className="bg-white/90 backdrop-blur-sm shadow-2xl rounded-3xl overflow-hidden border border-white/20"
//           variants={itemVariants}
//         >
//           {/* Header */}
//           <div className="bg-gradient-to-r from-emerald-600 to-teal-700 px-6 sm:px-8 py-6 sm:py-8 relative overflow-hidden">
//             <div className="absolute inset-0 bg-black/10"></div>
//             <div className="relative z-10 text-center">
//               <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white/20 rounded-2xl mb-4 backdrop-blur-sm">
//                 <BuildingOfficeIcon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
//               </div>
//               <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
//                 Lawn Catering Booking
//               </h1>
//               <p className="text-emerald-100 text-sm sm:text-base">
//                 Per Plate Administration Panel
//               </p>
//             </div>
//           </div>

//           {/* Content */}
//           <div className="p-6 sm:p-8">
//             {/* Status Message */}
//             <AnimatePresence>
//               {statusMessage && (
//                 <motion.div
//                   className={`mb-6 p-4 rounded-2xl text-sm sm:text-base font-medium text-center border-2 ${
//                     statusMessage.includes('✅')
//                       ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
//                       : 'bg-red-50 text-red-800 border-red-200'
//                   }`}
//                   initial={{ opacity: 0, y: -20, scale: 0.95 }}
//                   animate={{ opacity: 1, y: 0, scale: 1 }}
//                   exit={{ opacity: 0, y: -20, scale: 0.95 }}
//                   transition={{ duration: 0.3 }}
//                 >
//                   <div className="flex items-center justify-center space-x-2">
//                     {statusMessage.includes('✅') ? (
//                       <CheckCircleIcon className="h-5 w-5 text-emerald-600" />
//                     ) : (
//                       <XCircleIcon className="h-5 w-5 text-red-600" />
//                     )}
//                     <span>{statusMessage}</span>
//                   </div>
//                 </motion.div>
//               )}
//             </AnimatePresence>

//             {/* Form */}
//             <div className="space-y-6">
//               {/* Plates and Price */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
//                 <motion.div variants={itemVariants}>
//                   <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2 flex items-center space-x-2">
//                     <UserGroupIcon className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
//                     <span>Number of Plates</span>
//                   </label>
//                   <input
//                     type="number"
//                     name="plates"
//                     value={formData.plates}
//                     onChange={handleChange}
//                     className="w-full px-4 py-3 sm:py-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 text-base sm:text-lg bg-white hover:shadow-md"
//                     placeholder="e.g., 100"
//                   />
//                 </motion.div>

//                 <motion.div variants={itemVariants}>
//                   <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2 flex items-center space-x-2">
//                     <CurrencyRupeeIcon className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
//                     <span>Price per Plate (₹)</span>
//                   </label>
//                   <input
//                     type="number"
//                     name="pricePerPlate"
//                     value={formData.pricePerPlate}
//                     onChange={handleChange}
//                     className="w-full px-4 py-3 sm:py-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 text-base sm:text-lg bg-white hover:shadow-md"
//                     placeholder="e.g., 500"
//                   />
//                 </motion.div>
//               </div>

//               {/* Date Selection */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
//                 <motion.div variants={itemVariants}>
//                   <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2 flex items-center space-x-2">
//                     <CalendarDaysIcon className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
//                     <span>Check-In Date</span>
//                   </label>
//                   <input
//                     type="date"
//                     name="checkIn"
//                     value={formData.checkIn}
//                     onChange={handleChange}
//                     className="w-full px-4 py-3 sm:py-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 text-base sm:text-lg bg-white hover:shadow-md"
//                     min={new Date().toISOString().split("T")[0]}
//                   />
//                 </motion.div>

//                 <motion.div variants={itemVariants}>
//                   <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2 flex items-center space-x-2">
//                     <ClockIcon className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
//                     <span>Check-Out Date</span>
//                   </label>
//                   <input
//                     type="date"
//                     name="checkOut"
//                     value={formData.checkOut}
//                     onChange={handleChange}
//                     className="w-full px-4 py-3 sm:py-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 text-base sm:text-lg bg-white hover:shadow-md"
//                     min={formData.checkIn || new Date().toISOString().split("T")[0]}
//                   />
//                 </motion.div>
//               </div>

//               {/* Guest Information */}
//               <motion.div variants={itemVariants}>
//                 <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2 flex items-center space-x-2">
//                   <EnvelopeIcon className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
//                   <span>Guest Email</span>
//                 </label>
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   className="w-full px-4 py-3 sm:py-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 text-base sm:text-lg bg-white hover:shadow-md"
//                   placeholder="guest@example.com"
//                 />
//               </motion.div>

//               <motion.div variants={itemVariants}>
//                 <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2 flex items-center space-x-2">
//                   <PhoneIcon className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
//                   <span>Phone Number</span>
//                 </label>
//                 <input
//                   type="text"
//                   name="phone"
//                   value={formData.phone}
//                   onChange={handleChange}
//                   className="w-full px-4 py-3 sm:py-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 text-base sm:text-lg bg-white hover:shadow-md"
//                   placeholder="10-digit number"
//                   maxLength={10}
//                 />
//               </motion.div>

//               {/* Payment Method */}
//               <motion.div variants={itemVariants}>
//                 <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2 flex items-center space-x-2">
//                   <CreditCardIcon className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
//                   <span>Payment Method</span>
//                 </label>
//                 <div className="grid grid-cols-2 gap-3 sm:gap-4">
//                   <motion.button
//                     type="button"
//                     onClick={() => setFormData({ ...formData, paymentMethod: 'online' })}
//                     className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 flex items-center justify-center space-x-2 font-medium text-sm sm:text-base ${
//                       formData.paymentMethod === 'online'
//                         ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
//                         : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300'
//                     }`}
//                     whileHover={{ scale: 1.02 }}
//                     whileTap={{ scale: 0.98 }}
//                   >
//                     <CreditCardIcon className="h-4 w-4 sm:h-5 sm:w-5" />
//                     <span>Online</span>
//                   </motion.button>
//                   <motion.button
//                     type="button"
//                     onClick={() => setFormData({ ...formData, paymentMethod: 'offline' })}
//                     className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 flex items-center justify-center space-x-2 font-medium text-sm sm:text-base ${
//                       formData.paymentMethod === 'offline'
//                         ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
//                         : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300'
//                     }`}
//                     whileHover={{ scale: 1.02 }}
//                     whileTap={{ scale: 0.98 }}
//                   >
//                     <BanknotesIcon className="h-4 w-4 sm:h-5 sm:w-5" />
//                     <span>Offline</span>
//                   </motion.button>
//                 </div>
//               </motion.div>

//               {/* Total Amount */}
//               <motion.div
//                 className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 sm:p-6 rounded-2xl border-2 border-emerald-200"
//                 variants={itemVariants}
//               >
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center space-x-2">
//                     <SparklesIcon className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600" />
//                     <span className="text-base sm:text-lg font-semibold text-emerald-800">Total Amount</span>
//                   </div>
//                   <div className="text-2xl sm:text-3xl font-bold text-emerald-700">
//                     ₹{totalAmount.toLocaleString('en-IN')}
//                   </div>
//                 </div>
//                 {formData.plates && formData.pricePerPlate && (
//                   <div className="mt-2 text-xs sm:text-sm text-emerald-600">
//                     {formData.plates} plates × ₹{formData.pricePerPlate} × {calculateDays()} day{calculateDays() > 1 ? 's' : ''}
//                   </div>
//                 )}
//               </motion.div>

//               {/* Submit Button */}
//               <motion.button
//                 onClick={handleBooking}
//                 className="w-full bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white py-4 sm:py-5 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center justify-center space-x-3"
//                 whileHover={{ scale: 1.02, y: -2 }}
//                 whileTap={{ scale: 0.98 }}
//                 variants={itemVariants}
//               >
//                 {formData.paymentMethod === 'offline' ? (
//                   <>
//                     <CheckCircleIcon className="h-5 w-5 sm:h-6 sm:w-6" />
//                     <span>Confirm Offline Booking</span>
//                   </>
//                 ) : (
//                   <>
//                     <CreditCardIcon className="h-5 w-5 sm:h-6 sm:w-6" />
//                     <span>Proceed to Online Payment</span>
//                   </>
//                 )}
//               </motion.button>
//             </div>
//           </div>
//         </motion.div>
//       </motion.div>
//     </div>
//   );
// };

// export default AdminCustomLawnBooking;
