import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createBooking } from '../../src/utils/api';
import { generateInvoice } from '../../src/utils/invoiceGenerator';
import { useNavigate } from 'react-router-dom';

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

  return (
    <motion.div className="p-6 max-w-xl mx-auto bg-white shadow-xl rounded-xl mt-10 mb-12 border border-green-100"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <motion.button onClick={() => navigate(-1)} className="text-blue-700 hover:text-blue-900 mb-4 font-medium">
        ← Back
      </motion.button>

      <h2 className="text-2xl font-bold text-green-800 mb-6 text-center">
        Lawn Catering Booking (Per Plate)
      </h2>

      <AnimatePresence>
        {statusMessage && (
          <motion.div
            className={`mb-4 p-3 rounded-md text-sm font-medium text-center ${
              statusMessage.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {statusMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        <div>
          <label className="font-semibold">Number of Plates</label>
          <input
            type="number"
            name="plates"
            value={formData.plates}
            onChange={handleChange}
            className="w-full border p-2 rounded mt-1"
            placeholder="e.g., 100"
          />
        </div>

        <div>
          <label className="font-semibold">Price per Plate (₹)</label>
          <input
            type="number"
            name="pricePerPlate"
            value={formData.pricePerPlate}
            onChange={handleChange}
            className="w-full border p-2 rounded mt-1"
            placeholder="e.g., 500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="font-semibold">Check-In Date</label>
            <input
              type="date"
              name="checkIn"
              value={formData.checkIn}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1"
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
          <div>
            <label className="font-semibold">Check-Out Date</label>
            <input
              type="date"
              name="checkOut"
              value={formData.checkOut}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1"
              min={formData.checkIn || new Date().toISOString().split("T")[0]}
            />
          </div>
        </div>

        <div>
          <label className="font-semibold">Guest Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border p-2 rounded mt-1"
            placeholder="guest@example.com"
          />
        </div>

        <div>
          <label className="font-semibold">Phone Number</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border p-2 rounded mt-1"
            placeholder="10-digit number"
            maxLength={10}
          />
        </div>

        <div>
          <label className="font-semibold">Payment Method</label>
          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            className="w-full border p-2 rounded mt-1"
          >
            <option value="online">Online (Razorpay)</option>
            <option value="offline">Offline (Cash/Other)</option>
          </select>
        </div>

        <div className="text-right text-lg font-bold text-green-700">
          Total: ₹{totalAmount.toFixed(2)}
        </div>

        <button
          onClick={handleBooking}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded font-semibold transition"
        >
          {formData.paymentMethod === 'offline'
            ? 'Confirm Offline Booking'
            : 'Proceed to Online Payment'}
        </button>
      </div>
    </motion.div>
  );
};

export default AdminCustomLawnBooking;
