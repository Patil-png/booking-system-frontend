import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CurrencyRupeeIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  HomeIcon,
  PencilSquareIcon,
  TrashIcon,
  PlusCircleIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  Cog6ToothIcon,
  TableCellsIcon,
} from '@heroicons/react/24/solid';
import axios from 'axios';

const OptionsPanel = () => {
  const [options, setOptions] = useState([]);
  const [form, setForm] = useState({ type: 'Room', name: '', price: '', members: '' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerPassword, setOwnerPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState('');

  const showAlertMessage = (message, type) => {
    setAlertMessage({ message, type });
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const fetchOptions = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/options`);
      const data = await res.json();
      console.log('Fetched options:', data); // ✅ Debug log
      setOptions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch options:', err);
      showAlertMessage('Failed to load pricing options', 'error');
    } finally {
      setLoading(false);
    }
  };

  const sendOtp = async () => {
    setOtpLoading(true);
    setOtpError('');
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/otp/send`, { email: ownerEmail });
      setOtpSent(true);
      showAlertMessage('OTP sent to owner email!', 'success');
    } catch (err) {
      setOtpError('Failed to send OTP.');
      showAlertMessage('Failed to send OTP', 'error');
    } finally {
      setOtpLoading(false);
    }
  };

  const verifyOtp = async () => {
    setOtpLoading(true);
    setOtpError('');
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/otp/verify`, {
        email: ownerEmail,
        otp,
        password: ownerPassword,
      });
      if (res.data.success) {
        setOtpVerified(true);
        showAlertMessage('OTP verified! You can now update the price.', 'success');
      } else {
        setOtpError('Invalid OTP or password.');
        setOtpVerified(false);
      }
    } catch (err) {
      setOtpError('Invalid OTP or password.');
      setOtpVerified(false);
      showAlertMessage('OTP verification failed', 'error');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (!form.name || !form.price || !form.members) {
      showAlertMessage('Please fill all required fields', 'error');
      return;
    }

    // If editing a Room price, require owner verification
    if (form.type === 'Room' && editingId) {
      if (!ownerEmail || !ownerPassword || !otp) {
        showAlertMessage('Owner email, password, and OTP are required', 'error');
        return;
      }
      if (!otpVerified) {
        showAlertMessage('Please verify OTP before updating price', 'error');
        return;
      }
    }

    const url = editingId
      ? `${import.meta.env.VITE_API_BASE_URL}/api/options/${editingId}`
      : `${import.meta.env.VITE_API_BASE_URL}/api/options`;
    const method = editingId ? 'PUT' : 'POST';

    // Convert to number
    const payload = {
      ...form,
      price: Number(form.price),
      members: Number(form.members),
    };

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save option');
      }

      setForm({ type: 'Room', name: '', price: '', members: '' });
      setEditingId(null);
      fetchOptions();
      showAlertMessage(
        editingId ? 'Option updated successfully!' : 'Option added successfully!',
        'success'
      );
    } catch (err) {
      console.error('Failed to save option:', err);
      showAlertMessage('Failed to save option', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this option?')) return;
    
    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/options/${id}`, { method: 'DELETE' });
      fetchOptions();
      showAlertMessage('Option deleted successfully!', 'success');
    } catch (err) {
      console.error('Delete failed:', err);
      showAlertMessage('Failed to delete option', 'error');
    }
  };

  const handleEdit = (opt) => {
    setForm({
      type: opt.type,
      name: opt.name,
      price: String(opt.price),
      members: opt.members !== undefined ? String(opt.members) : '',
    });
    setEditingId(opt._id);
  };

  const handleCancelEdit = () => {
    setForm({ type: 'Room', name: '', price: '', members: '' });
    setEditingId(null);
  };

  useEffect(() => {
    fetchOptions();
  }, []);

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
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: 20, transition: { duration: 0.2 } }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-green-50 flex justify-center items-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-teal-200 rounded-full animate-spin border-t-teal-600"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Cog6ToothIcon className="w-8 h-8 text-teal-600" />
            </div>
          </div>
          <p className="mt-4 text-lg font-medium text-gray-600">Loading pricing options...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-green-50 py-6 px-4 sm:px-6 lg:px-8">
      {/* Alert System */}
      <AnimatePresence>
        {showAlert && alertMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className={`fixed top-2 left-2 right-2 sm:top-6 sm:right-6 sm:left-auto z-50 p-2 sm:p-5 rounded-2xl shadow-2xl flex items-center space-x-2 sm:space-x-4 backdrop-blur-md border-2 max-w-md mx-auto sm:mx-0 text-xs sm:text-base ${
              alertMessage.type === "success"
                ? "bg-emerald-500/90 text-white border-emerald-300"
                : "bg-red-500/90 text-white border-red-300"
            }`}
          >
            <div className="flex-shrink-0">
              {alertMessage.type === "success" ? (
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <CheckCircleIcon className="h-5 w-5" />
                </div>
              ) : (
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <ExclamationCircleIcon className="h-5 w-5" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm sm:text-base">{alertMessage.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="max-w-6xl mx-auto text-xs sm:text-base"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div
          className="text-center mb-4 sm:mb-12"
          variants={itemVariants}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-teal-600 to-emerald-700 rounded-3xl mb-4 sm:mb-6 shadow-xl">
            <Cog6ToothIcon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <h1 className="text-xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-teal-600 via-emerald-600 to-green-600 bg-clip-text text-transparent mb-2 sm:mb-4">
            Pricing Management
          </h1>
          <p className="text-xs sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Manage room and lawn pricing options for your booking system
          </p>
        </motion.div>

        {/* Main Content Card */}
        <motion.div
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20 text-xs sm:text-base"
          variants={itemVariants}
        >
          {/* Form Section */}
          <div className="p-3 sm:p-8 bg-gradient-to-r from-teal-600 to-emerald-700">
            <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <PlusCircleIcon className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-base sm:text-2xl font-bold text-white">
                {editingId ? 'Edit Pricing Option' : 'Add New Pricing Option'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-6">
                {/* Type Selection */}
                <div className="space-y-1 sm:space-y-2">
                  <label className="block text-xs sm:text-sm font-semibold text-teal-100 flex items-center space-x-2">
                    <TableCellsIcon className="w-4 h-4" />
                    <span>Type</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <motion.button
                      type="button"
                      onClick={() => setForm({ ...form, type: 'Room' })}
                      className={`p-2 sm:p-3 rounded-xl border-2 transition-all duration-300 flex items-center justify-center space-x-2 font-medium text-xs sm:text-sm ${
                        form.type === 'Room'
                          ? 'bg-white/20 border-white/50 text-white'
                          : 'bg-white/10 border-white/20 text-teal-100 hover:border-white/30'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <BuildingOfficeIcon className="w-4 h-4" />
                      <span>Room</span>
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={() => setForm({ ...form, type: 'Lawn' })}
                      className={`p-2 sm:p-3 rounded-xl border-2 transition-all duration-300 flex items-center justify-center space-x-2 font-medium text-xs sm:text-sm ${
                        form.type === 'Lawn'
                          ? 'bg-white/20 border-white/50 text-white'
                          : 'bg-white/10 border-white/20 text-teal-100 hover:border-white/30'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <HomeIcon className="w-4 h-4" />
                      <span>Lawn</span>
                    </motion.button>
                  </div>
                </div>

                {/* Option Name */}
                <div className="space-y-1 sm:space-y-2">
                  <label className="block text-xs sm:text-sm font-semibold text-teal-100 flex items-center space-x-2">
                    <PencilSquareIcon className="w-4 h-4" />
                    <span>Option Name</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Option Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-2 sm:px-4 py-2 sm:py-3 border-2 border-white/20 rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder-teal-200 focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-300 text-xs sm:text-base"
                    required
                  />
                </div>

                {/* Price */}
                <div className="space-y-1 sm:space-y-2">
                  <label className="block text-xs sm:text-sm font-semibold text-teal-100 flex items-center space-x-2">
                    <CurrencyRupeeIcon className="w-4 h-4" />
                    <span>Price (₹)</span>
                  </label>
                  <input
                    type="number"
                    placeholder="Price"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full px-2 sm:px-4 py-2 sm:py-3 border-2 border-white/20 rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder-teal-200 focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-300 text-xs sm:text-base"
                    required
                  />
                </div>

                {/* Members */}
                <div className="space-y-1 sm:space-y-2">
                  <label className="block text-xs sm:text-sm font-semibold text-teal-100 flex items-center space-x-2">
                    <UserGroupIcon className="w-4 h-4" />
                    <span>Members</span>
                  </label>
                  <input
                    type="number"
                    placeholder="Members"
                    value={form.members}
                    onChange={(e) => setForm({ ...form, members: e.target.value })}
                    className="w-full px-2 sm:px-4 py-2 sm:py-3 border-2 border-white/20 rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder-teal-200 focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-300 text-xs sm:text-base"
                    required
                  />
                </div>
              </div>

              {/* Owner verification fields for Room price edit */}
              {form.type === 'Room' && editingId && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 bg-white/10 p-2 sm:p-4 rounded-xl mt-2 sm:mt-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-teal-100 mb-1">Owner Email</label>
                    <input
                      type="email"
                      value={ownerEmail}
                      onChange={e => setOwnerEmail(e.target.value)}
                      className="w-full px-2 sm:px-4 py-2 rounded bg-white/20 text-white placeholder-teal-200 focus:ring-2 focus:ring-white/50 focus:border-white/50 text-xs sm:text-base"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-teal-100 mb-1">Owner Password</label>
                    <input
                      type="password"
                      value={ownerPassword}
                      onChange={e => setOwnerPassword(e.target.value)}
                      className="w-full px-2 sm:px-4 py-2 rounded bg-white/20 text-white placeholder-teal-200 focus:ring-2 focus:ring-white/50 focus:border-white/50 text-xs sm:text-base"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1 sm:gap-2">
                    <label className="block text-xs sm:text-sm font-semibold text-teal-100 mb-1">OTP</label>
                    <div className="flex gap-1 sm:gap-2">
                      <input
                        type="text"
                        value={otp}
                        onChange={e => setOtp(e.target.value)}
                        className="w-full px-2 sm:px-4 py-2 rounded bg-white/20 text-white placeholder-teal-200 focus:ring-2 focus:ring-white/50 focus:border-white/50 text-xs sm:text-base"
                        required
                      />
                      <button
                        type="button"
                        onClick={sendOtp}
                        disabled={otpLoading || !ownerEmail}
                        className="px-2 sm:px-3 py-1 sm:py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg text-xs font-medium hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-60"
                      >
                        {otpLoading ? 'Sending...' : otpSent ? 'Resend OTP' : 'Send OTP'}
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={verifyOtp}
                      disabled={otpLoading || !otp || !ownerPassword}
                      className="mt-1 sm:mt-2 px-2 sm:px-3 py-1 sm:py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg text-xs font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-60"
                    >
                      {otpLoading ? 'Verifying...' : 'Verify OTP'}
                    </button>
                    {otpError && <div className="text-red-200 text-xs mt-1">{otpError}</div>}
                    {otpVerified && <div className="text-green-200 text-xs mt-1">OTP verified!</div>}
                  </div>
                </div>
              )}
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <motion.button
                  type="submit"
                  className="flex-1 sm:flex-none bg-gradient-to-r from-emerald-500 to-green-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl hover:from-emerald-600 hover:to-green-700 text-xs sm:text-base font-semibold transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {editingId ? (
                    <>
                      <CheckCircleIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Update Option</span>
                    </>
                  ) : (
                    <>
                      <PlusCircleIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Add Option</span>
                    </>
                  )}
                </motion.button>

                {editingId && (
                  <motion.button
                    type="button"
                    onClick={handleCancelEdit}
                    className="flex-1 sm:flex-none bg-gray-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl hover:bg-gray-600 text-xs sm:text-base font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <XMarkIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Cancel</span>
                  </motion.button>
                )}
              </div>
            </form>
          </div>

          {/* Table Section */}
          <div className="p-2 sm:p-8">
            <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <TableCellsIcon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-base sm:text-2xl font-bold text-gray-800">Current Pricing Options</h3>
            </div>

            {/* Mobile-Responsive Table */}
            <div className="overflow-x-auto text-xs sm:text-base">
              <div className="min-w-[400px] sm:min-w-[600px] lg:min-w-0">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-teal-600 to-emerald-700 text-white">
                    <tr>
                      <th className="px-4 py-4 text-left text-sm sm:text-base font-semibold">
                        <div className="flex items-center space-x-2">
                          <TableCellsIcon className="w-4 h-4" />
                          <span>Type</span>
                        </div>
                      </th>
                      <th className="px-4 py-4 text-left text-sm sm:text-base font-semibold">
                        <div className="flex items-center space-x-2">
                          <PencilSquareIcon className="w-4 h-4" />
                          <span>Name</span>
                        </div>
                      </th>
                      <th className="px-4 py-4 text-left text-sm sm:text-base font-semibold">
                        <div className="flex items-center space-x-2">
                          <CurrencyRupeeIcon className="w-4 h-4" />
                          <span>Price</span>
                        </div>
                      </th>
                      <th className="px-4 py-4 text-left text-sm sm:text-base font-semibold">
                        <div className="flex items-center space-x-2">
                          <UserGroupIcon className="w-4 h-4" />
                          <span>Members</span>
                        </div>
                      </th>
                      <th className="px-4 py-4 text-center text-sm sm:text-base font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <AnimatePresence>
                      {options.length === 0 ? (
                        <motion.tr
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          <td colSpan="5" className="py-12 text-center">
                            <div className="space-y-4">
                              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                                <TableCellsIcon className="w-10 h-10 text-gray-400" />
                              </div>
                              <div>
                                <p className="text-xl font-medium text-gray-500">No pricing options yet</p>
                                <p className="text-gray-400 mt-2">Add your first pricing option above</p>
                              </div>
                            </div>
                          </td>
                        </motion.tr>
                      ) : (
                        options.map((opt, index) => (
                          <motion.tr
                            key={opt._id}
                            className={`hover:bg-gradient-to-r hover:from-teal-50 hover:to-emerald-50 transition-all duration-200 ${
                              editingId === opt._id ? 'bg-gradient-to-r from-yellow-50 to-orange-50' : ''
                            }`}
                            variants={rowVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            custom={index}
                          >
                            <td className="px-4 py-4">
                              <div className="flex items-center space-x-2">
                                {opt.type === 'Room' ? (
                                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <BuildingOfficeIcon className="w-5 h-5 text-blue-600" />
                                  </div>
                                ) : (
                                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                    <HomeIcon className="w-5 h-5 text-green-600" />
                                  </div>
                                )}
                                <span className="font-medium text-gray-900">{opt.type}</span>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <span className="text-gray-900 font-medium">{opt.name}</span>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center space-x-1">
                                <CurrencyRupeeIcon className="w-4 h-4 text-green-600" />
                                <span className="text-lg font-bold text-green-700">{opt.price}</span>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center space-x-1">
                                <UserGroupIcon className="w-4 h-4 text-blue-600" />
                                <span className="font-medium text-gray-900">{opt.members ?? '-'}</span>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
                                <motion.button
                                  onClick={() => handleEdit(opt)}
                                  className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg text-xs sm:text-sm font-medium hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 flex items-center space-x-1 shadow-md hover:shadow-lg"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <PencilSquareIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                                  <span className="hidden sm:inline">Edit</span>
                                </motion.button>

                                <motion.button
                                  onClick={() => handleDelete(opt._id)}
                                  className="px-3 py-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg text-xs sm:text-sm font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center space-x-1 shadow-md hover:shadow-lg"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <TrashIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                                  <span className="hidden sm:inline">Delete</span>
                                </motion.button>
                              </div>
                            </td>
                          </motion.tr>
                        ))
                      )}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default OptionsPanel;


// import React, { useEffect, useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//   CurrencyRupeeIcon,
//   UserGroupIcon,
//   BuildingOfficeIcon,
//   HomeIcon,
//   PencilSquareIcon,
//   TrashIcon,
//   PlusCircleIcon,
//   XMarkIcon,
//   CheckCircleIcon,
//   ExclamationCircleIcon,
//   Cog6ToothIcon,
//   TableCellsIcon,
// } from '@heroicons/react/24/solid';

// const OptionsPanel = () => {
//   const [options, setOptions] = useState([]);
//   const [form, setForm] = useState({ type: 'Room', name: '', price: '', members: '' });
//   const [editingId, setEditingId] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [alertMessage, setAlertMessage] = useState(null);
//   const [showAlert, setShowAlert] = useState(false);

//   const showAlertMessage = (message, type) => {
//     setAlertMessage({ message, type });
//     setShowAlert(true);
//     setTimeout(() => setShowAlert(false), 3000);
//   };

//   const fetchOptions = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/options`);
//       const data = await res.json();
//       console.log('Fetched options:', data); // ✅ Debug log
//       setOptions(Array.isArray(data) ? data : []);
//     } catch (err) {
//       console.error('Failed to fetch options:', err);
//       showAlertMessage('Failed to load pricing options', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Validate inputs
//     if (!form.name || !form.price || !form.members) {
//       showAlertMessage('Please fill all required fields', 'error');
//       return;
//     }

//     const url = editingId
//       ? `${import.meta.env.VITE_API_BASE_URL}/api/options/${editingId}`
//       : `${import.meta.env.VITE_API_BASE_URL}/api/options`;
//     const method = editingId ? 'PUT' : 'POST';

//     // Convert to number
//     const payload = {
//       ...form,
//       price: Number(form.price),
//       members: Number(form.members),
//     };

//     try {
//       const response = await fetch(url, {
//         method,
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) {
//         const error = await response.json();
//         throw new Error(error.message || 'Failed to save option');
//       }

//       setForm({ type: 'Room', name: '', price: '', members: '' });
//       setEditingId(null);
//       fetchOptions();
//       showAlertMessage(
//         editingId ? 'Option updated successfully!' : 'Option added successfully!',
//         'success'
//       );
//     } catch (err) {
//       console.error('Failed to save option:', err);
//       showAlertMessage('Failed to save option', 'error');
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this option?')) return;
    
//     try {
//       await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/options/${id}`, { method: 'DELETE' });
//       fetchOptions();
//       showAlertMessage('Option deleted successfully!', 'success');
//     } catch (err) {
//       console.error('Delete failed:', err);
//       showAlertMessage('Failed to delete option', 'error');
//     }
//   };

//   const handleEdit = (opt) => {
//     setForm({
//       type: opt.type,
//       name: opt.name,
//       price: String(opt.price),
//       members: opt.members !== undefined ? String(opt.members) : '',
//     });
//     setEditingId(opt._id);
//   };

//   const handleCancelEdit = () => {
//     setForm({ type: 'Room', name: '', price: '', members: '' });
//     setEditingId(null);
//   };

//   useEffect(() => {
//     fetchOptions();
//   }, []);

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
//     hidden: { opacity: 0, y: 20, scale: 0.95 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       scale: 1,
//       transition: {
//         duration: 0.6,
//         ease: [0.25, 0.46, 0.45, 0.94]
//       }
//     }
//   };

//   const rowVariants = {
//     hidden: { opacity: 0, x: -20 },
//     visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
//     exit: { opacity: 0, x: 20, transition: { duration: 0.2 } }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-green-50 flex justify-center items-center">
//         <div className="text-center">
//           <div className="relative">
//             <div className="w-20 h-20 border-4 border-teal-200 rounded-full animate-spin border-t-teal-600"></div>
//             <div className="absolute inset-0 flex items-center justify-center">
//               <Cog6ToothIcon className="w-8 h-8 text-teal-600" />
//             </div>
//           </div>
//           <p className="mt-4 text-lg font-medium text-gray-600">Loading pricing options...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-green-50 py-6 px-4 sm:px-6 lg:px-8">
//       {/* Alert System */}
//       <AnimatePresence>
//         {showAlert && alertMessage && (
//           <motion.div
//             initial={{ opacity: 0, y: -50, scale: 0.95 }}
//             animate={{ opacity: 1, y: 0, scale: 1 }}
//             exit={{ opacity: 0, y: -50, scale: 0.95 }}
//             transition={{ duration: 0.3 }}
//             className={`fixed top-4 left-4 right-4 sm:top-6 sm:right-6 sm:left-auto z-50 p-4 sm:p-5 rounded-2xl shadow-2xl flex items-center space-x-3 sm:space-x-4 backdrop-blur-md border-2 max-w-md mx-auto sm:mx-0 ${
//               alertMessage.type === "success"
//                 ? "bg-emerald-500/90 text-white border-emerald-300"
//                 : "bg-red-500/90 text-white border-red-300"
//             }`}
//           >
//             <div className="flex-shrink-0">
//               {alertMessage.type === "success" ? (
//                 <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
//                   <CheckCircleIcon className="h-5 w-5" />
//                 </div>
//               ) : (
//                 <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
//                   <ExclamationCircleIcon className="h-5 w-5" />
//                 </div>
//               )}
//             </div>
//             <div className="flex-1">
//               <p className="font-semibold text-sm sm:text-base">{alertMessage.message}</p>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       <motion.div
//         className="max-w-6xl mx-auto"
//         variants={containerVariants}
//         initial="hidden"
//         animate="visible"
//       >
//         {/* Header */}
//         <motion.div
//           className="text-center mb-8 sm:mb-12"
//           variants={itemVariants}
//         >
//           <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-teal-600 to-emerald-700 rounded-3xl mb-6 shadow-xl">
//             <Cog6ToothIcon className="w-10 h-10 text-white" />
//           </div>
//           <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-teal-600 via-emerald-600 to-green-600 bg-clip-text text-transparent mb-4">
//             Pricing Management
//           </h1>
//           <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
//             Manage room and lawn pricing options for your booking system
//           </p>
//         </motion.div>

//         {/* Main Content Card */}
//         <motion.div
//           className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20"
//           variants={itemVariants}
//         >
//           {/* Form Section */}
//           <div className="p-6 sm:p-8 bg-gradient-to-r from-teal-600 to-emerald-700">
//             <div className="flex items-center space-x-3 mb-6">
//               <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
//                 <PlusCircleIcon className="w-5 h-5 text-white" />
//               </div>
//               <h2 className="text-xl sm:text-2xl font-bold text-white">
//                 {editingId ? 'Edit Pricing Option' : 'Add New Pricing Option'}
//               </h2>
//             </div>

//             <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
//                 {/* Type Selection */}
//                 <div className="space-y-2">
//                   <label className="block text-sm font-semibold text-teal-100 flex items-center space-x-2">
//                     <TableCellsIcon className="w-4 h-4" />
//                     <span>Type</span>
//                   </label>
//                   <div className="grid grid-cols-2 gap-2">
//                     <motion.button
//                       type="button"
//                       onClick={() => setForm({ ...form, type: 'Room' })}
//                       className={`p-3 rounded-xl border-2 transition-all duration-300 flex items-center justify-center space-x-2 font-medium text-sm ${
//                         form.type === 'Room'
//                           ? 'bg-white/20 border-white/50 text-white'
//                           : 'bg-white/10 border-white/20 text-teal-100 hover:border-white/30'
//                       }`}
//                       whileHover={{ scale: 1.02 }}
//                       whileTap={{ scale: 0.98 }}
//                     >
//                       <BuildingOfficeIcon className="w-4 h-4" />
//                       <span>Room</span>
//                     </motion.button>
//                     <motion.button
//                       type="button"
//                       onClick={() => setForm({ ...form, type: 'Lawn' })}
//                       className={`p-3 rounded-xl border-2 transition-all duration-300 flex items-center justify-center space-x-2 font-medium text-sm ${
//                         form.type === 'Lawn'
//                           ? 'bg-white/20 border-white/50 text-white'
//                           : 'bg-white/10 border-white/20 text-teal-100 hover:border-white/30'
//                       }`}
//                       whileHover={{ scale: 1.02 }}
//                       whileTap={{ scale: 0.98 }}
//                     >
//                       <HomeIcon className="w-4 h-4" />
//                       <span>Lawn</span>
//                     </motion.button>
//                   </div>
//                 </div>

//                 {/* Option Name */}
//                 <div className="space-y-2">
//                   <label className="block text-sm font-semibold text-teal-100 flex items-center space-x-2">
//                     <PencilSquareIcon className="w-4 h-4" />
//                     <span>Option Name</span>
//                   </label>
//                   <input
//                     type="text"
//                     placeholder="Option Name"
//                     value={form.name}
//                     onChange={(e) => setForm({ ...form, name: e.target.value })}
//                     className="w-full px-4 py-3 border-2 border-white/20 rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder-teal-200 focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-300 text-base"
//                     required
//                   />
//                 </div>

//                 {/* Price */}
//                 <div className="space-y-2">
//                   <label className="block text-sm font-semibold text-teal-100 flex items-center space-x-2">
//                     <CurrencyRupeeIcon className="w-4 h-4" />
//                     <span>Price (₹)</span>
//                   </label>
//                   <input
//                     type="number"
//                     placeholder="Price"
//                     value={form.price}
//                     onChange={(e) => setForm({ ...form, price: e.target.value })}
//                     className="w-full px-4 py-3 border-2 border-white/20 rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder-teal-200 focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-300 text-base"
//                     required
//                   />
//                 </div>

//                 {/* Members */}
//                 <div className="space-y-2">
//                   <label className="block text-sm font-semibold text-teal-100 flex items-center space-x-2">
//                     <UserGroupIcon className="w-4 h-4" />
//                     <span>Members</span>
//                   </label>
//                   <input
//                     type="number"
//                     placeholder="Members"
//                     value={form.members}
//                     onChange={(e) => setForm({ ...form, members: e.target.value })}
//                     className="w-full px-4 py-3 border-2 border-white/20 rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder-teal-200 focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-300 text-base"
//                     required
//                   />
//                 </div>
//               </div>

//               {/* Action Buttons */}
//               <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
//                 <motion.button
//                   type="submit"
//                   className="flex-1 sm:flex-none bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-3 rounded-xl hover:from-emerald-600 hover:to-green-700 text-base font-semibold transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
//                   whileHover={{ scale: 1.02, y: -2 }}
//                   whileTap={{ scale: 0.98 }}
//                 >
//                   {editingId ? (
//                     <>
//                       <CheckCircleIcon className="w-5 h-5" />
//                       <span>Update Option</span>
//                     </>
//                   ) : (
//                     <>
//                       <PlusCircleIcon className="w-5 h-5" />
//                       <span>Add Option</span>
//                     </>
//                   )}
//                 </motion.button>

//                 {editingId && (
//                   <motion.button
//                     type="button"
//                     onClick={handleCancelEdit}
//                     className="flex-1 sm:flex-none bg-gray-500 text-white px-6 py-3 rounded-xl hover:bg-gray-600 text-base font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
//                     whileHover={{ scale: 1.02, y: -2 }}
//                     whileTap={{ scale: 0.98 }}
//                   >
//                     <XMarkIcon className="w-5 h-5" />
//                     <span>Cancel</span>
//                   </motion.button>
//                 )}
//               </div>
//             </form>
//           </div>

//           {/* Table Section */}
//           <div className="p-6 sm:p-8">
//             <div className="flex items-center space-x-3 mb-6">
//               <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-lg flex items-center justify-center">
//                 <TableCellsIcon className="w-5 h-5 text-white" />
//               </div>
//               <h3 className="text-xl sm:text-2xl font-bold text-gray-800">Current Pricing Options</h3>
//             </div>

//             {/* Mobile-Responsive Table */}
//             <div className="overflow-x-auto">
//               <div className="min-w-[600px] lg:min-w-0">
//                 <table className="w-full">
//                   <thead className="bg-gradient-to-r from-teal-600 to-emerald-700 text-white">
//                     <tr>
//                       <th className="px-4 py-4 text-left text-sm sm:text-base font-semibold">
//                         <div className="flex items-center space-x-2">
//                           <TableCellsIcon className="w-4 h-4" />
//                           <span>Type</span>
//                         </div>
//                       </th>
//                       <th className="px-4 py-4 text-left text-sm sm:text-base font-semibold">
//                         <div className="flex items-center space-x-2">
//                           <PencilSquareIcon className="w-4 h-4" />
//                           <span>Name</span>
//                         </div>
//                       </th>
//                       <th className="px-4 py-4 text-left text-sm sm:text-base font-semibold">
//                         <div className="flex items-center space-x-2">
//                           <CurrencyRupeeIcon className="w-4 h-4" />
//                           <span>Price</span>
//                         </div>
//                       </th>
//                       <th className="px-4 py-4 text-left text-sm sm:text-base font-semibold">
//                         <div className="flex items-center space-x-2">
//                           <UserGroupIcon className="w-4 h-4" />
//                           <span>Members</span>
//                         </div>
//                       </th>
//                       <th className="px-4 py-4 text-center text-sm sm:text-base font-semibold">
//                         Actions
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-200">
//                     <AnimatePresence>
//                       {options.length === 0 ? (
//                         <motion.tr
//                           initial={{ opacity: 0 }}
//                           animate={{ opacity: 1 }}
//                           transition={{ delay: 0.3 }}
//                         >
//                           <td colSpan="5" className="py-12 text-center">
//                             <div className="space-y-4">
//                               <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
//                                 <TableCellsIcon className="w-10 h-10 text-gray-400" />
//                               </div>
//                               <div>
//                                 <p className="text-xl font-medium text-gray-500">No pricing options yet</p>
//                                 <p className="text-gray-400 mt-2">Add your first pricing option above</p>
//                               </div>
//                             </div>
//                           </td>
//                         </motion.tr>
//                       ) : (
//                         options.map((opt, index) => (
//                           <motion.tr
//                             key={opt._id}
//                             className={`hover:bg-gradient-to-r hover:from-teal-50 hover:to-emerald-50 transition-all duration-200 ${
//                               editingId === opt._id ? 'bg-gradient-to-r from-yellow-50 to-orange-50' : ''
//                             }`}
//                             variants={rowVariants}
//                             initial="hidden"
//                             animate="visible"
//                             exit="exit"
//                             custom={index}
//                           >
//                             <td className="px-4 py-4">
//                               <div className="flex items-center space-x-2">
//                                 {opt.type === 'Room' ? (
//                                   <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
//                                     <BuildingOfficeIcon className="w-5 h-5 text-blue-600" />
//                                   </div>
//                                 ) : (
//                                   <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
//                                     <HomeIcon className="w-5 h-5 text-green-600" />
//                                   </div>
//                                 )}
//                                 <span className="font-medium text-gray-900">{opt.type}</span>
//                               </div>
//                             </td>
//                             <td className="px-4 py-4">
//                               <span className="text-gray-900 font-medium">{opt.name}</span>
//                             </td>
//                             <td className="px-4 py-4">
//                               <div className="flex items-center space-x-1">
//                                 <CurrencyRupeeIcon className="w-4 h-4 text-green-600" />
//                                 <span className="text-lg font-bold text-green-700">{opt.price}</span>
//                               </div>
//                             </td>
//                             <td className="px-4 py-4">
//                               <div className="flex items-center space-x-1">
//                                 <UserGroupIcon className="w-4 h-4 text-blue-600" />
//                                 <span className="font-medium text-gray-900">{opt.members ?? '-'}</span>
//                               </div>
//                             </td>
//                             <td className="px-4 py-4">
//                               <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
//                                 <motion.button
//                                   onClick={() => handleEdit(opt)}
//                                   className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg text-xs sm:text-sm font-medium hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 flex items-center space-x-1 shadow-md hover:shadow-lg"
//                                   whileHover={{ scale: 1.05 }}
//                                   whileTap={{ scale: 0.95 }}
//                                 >
//                                   <PencilSquareIcon className="w-3 h-3 sm:w-4 sm:h-4" />
//                                   <span className="hidden sm:inline">Edit</span>
//                                 </motion.button>

//                                 <motion.button
//                                   onClick={() => handleDelete(opt._id)}
//                                   className="px-3 py-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg text-xs sm:text-sm font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center space-x-1 shadow-md hover:shadow-lg"
//                                   whileHover={{ scale: 1.05 }}
//                                   whileTap={{ scale: 0.95 }}
//                                 >
//                                   <TrashIcon className="w-3 h-3 sm:w-4 sm:h-4" />
//                                   <span className="hidden sm:inline">Delete</span>
//                                 </motion.button>
//                               </div>
//                             </td>
//                           </motion.tr>
//                         ))
//                       )}
//                     </AnimatePresence>
//                   </tbody>
//                 </table>
//               </div>
//             </div>

//             {/* Summary Stats */}
//             {options.length > 0 && (
//               <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
//                 <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
//                   <div className="flex items-center space-x-3">
//                     <BuildingOfficeIcon className="w-8 h-8 text-blue-600" />
//                     <div>
//                       <div className="text-2xl font-bold text-blue-700">
//                         {options.filter(opt => opt.type === 'Room').length}
//                       </div>
//                       <div className="text-sm text-blue-600">Room Options</div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
//                   <div className="flex items-center space-x-3">
//                     <HomeIcon className="w-8 h-8 text-green-600" />
//                     <div>
//                       <div className="text-2xl font-bold text-green-700">
//                         {options.filter(opt => opt.type === 'Lawn').length}
//                       </div>
//                       <div className="text-sm text-green-600">Lawn Options</div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="bg-gradient-to-r from-teal-50 to-teal-100 p-4 rounded-xl border border-teal-200">
//                   <div className="flex items-center space-x-3">
//                     <TableCellsIcon className="w-8 h-8 text-teal-600" />
//                     <div>
//                       <div className="text-2xl font-bold text-teal-700">
//                         {options.length}
//                       </div>
//                       <div className="text-sm text-teal-600">Total Options</div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </motion.div>
//       </motion.div>
//     </div>
//   );
// };

// export default OptionsPanel;
