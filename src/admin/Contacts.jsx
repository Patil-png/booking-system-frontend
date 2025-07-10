import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeftIcon,
  EnvelopeIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  TrashIcon,
  PaperAirplaneIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  UserIcon,
  CalendarDaysIcon,
  InformationCircleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
} from "@heroicons/react/24/solid";

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [replyStatus, setReplyStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchContacts = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/contacts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setContacts(res.data);
    } catch (err) {
      console.error("Failed to fetch contacts", err.response?.data || err);
      setError("Failed to load contact messages. Please try again.");
      if (err.response?.status === 401 || err.response?.status === 403) {
        alert("Session expired. Please log in again.");
        navigate("/admin/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this message?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/admin/contacts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setContacts((prev) => prev.filter((c) => c._id !== id));
      alert("Message deleted successfully!");
    } catch (err) {
      console.error("Failed to delete contact", err.response?.data || err);
      alert("Failed to delete. Please try again.");
    }
  };

  const handleReply = async (email, contactId) => {
    if (!replyMessage.trim()) {
      setReplyStatus("Message cannot be empty.");
      return;
    }

    setReplyStatus("Sending reply...");
    try {
      const token = localStorage.getItem("adminToken");
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/contacts/reply`,
        {
          to: email,
          subject: "Reply from Gouri Inn",
          message: replyMessage,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setReplyStatus("✅ Reply sent!");
      setTimeout(() => {
        setReplyingTo(null);
        setReplyMessage("");
        setReplyStatus("");
      }, 2000);
    } catch (err) {
      console.error("Failed to send reply:", err);
      setReplyStatus("❌ Failed to send reply. Please try again.");
    }
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
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: 20, transition: { duration: 0.2 } },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 flex justify-center items-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-purple-200 rounded-full animate-spin border-t-purple-600"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <ChatBubbleLeftRightIcon className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          <p className="mt-4 text-lg font-medium text-gray-600">Loading messages...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 flex justify-center items-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-red-200 max-w-md mx-auto"
        >
          <ExclamationCircleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-red-700 font-semibold text-lg mb-6">{error}</p>
          <button
            onClick={fetchContacts}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
          >
            Retry Loading
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 py-6 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Section */}
        <motion.div
          className="mb-8"
          variants={itemVariants}
        >
          <motion.button
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center space-x-2 text-purple-700 hover:text-purple-900 font-medium text-sm sm:text-base transition-colors duration-200 group"
            whileHover={{ x: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeftIcon className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-[-2px] transition-transform duration-200" />
            <span>Back to Dashboard</span>
          </motion.button>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-3xl mb-6 shadow-xl">
              <ChatBubbleLeftRightIcon className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent mb-4">
              Contact Messages
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Manage and respond to customer inquiries and messages
            </p>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20"
          variants={itemVariants}
        >
          {/* Mobile-Responsive Table */}
          <div className="overflow-x-auto">
            <div className="min-w-[800px] lg:min-w-0">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white">
                  <motion.tr
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <th className="px-4 py-4 text-left text-sm sm:text-base font-semibold">
                      <div className="flex items-center space-x-2">
                        <UserIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>Contact</span>
                      </div>
                    </th>
                    <th className="px-4 py-4 text-left text-sm sm:text-base font-semibold hidden md:table-cell">
                      <div className="flex items-center space-x-2">
                        <InformationCircleIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>Details</span>
                      </div>
                    </th>
                    <th className="px-4 py-4 text-left text-sm sm:text-base font-semibold">
                      <div className="flex items-center space-x-2">
                        <ChatBubbleLeftRightIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>Message</span>
                      </div>
                    </th>
                    <th className="px-4 py-4 text-left text-sm sm:text-base font-semibold hidden lg:table-cell">
                      <div className="flex items-center space-x-2">
                        <CalendarDaysIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>Date</span>
                      </div>
                    </th>
                    <th className="px-4 py-4 text-center text-sm sm:text-base font-semibold">
                      Actions
                    </th>
                  </motion.tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <AnimatePresence>
                    {contacts.length > 0 ? (
                      contacts.map((c, index) => (
                        <motion.tr
                          key={c._id}
                          className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 transition-all duration-200"
                          variants={rowVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          custom={index}
                        >
                          {/* Contact Info */}
                          <td className="px-4 py-4">
                            <div className="space-y-1">
                              <div className="font-semibold text-gray-900 text-sm sm:text-base">
                                {c.name}
                              </div>
                              <div className="flex items-center space-x-1 text-xs sm:text-sm text-gray-600">
                                <EnvelopeIcon className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500" />
                                <span className="truncate max-w-[120px] sm:max-w-[180px]">{c.email}</span>
                              </div>
                              <div className="md:hidden">
                                {c.phone && (
                                  <div className="flex items-center space-x-1 text-xs text-gray-600">
                                    <PhoneIcon className="w-3 h-3 text-purple-500" />
                                    <span>{c.phone}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Details (Hidden on mobile) */}
                          <td className="px-4 py-4 hidden md:table-cell">
                            <div className="space-y-1">
                              {c.phone && (
                                <div className="flex items-center space-x-1 text-sm text-gray-600">
                                  <PhoneIcon className="w-4 h-4 text-purple-500" />
                                  <span>{c.phone}</span>
                                </div>
                              )}
                              {c.inquiryType && (
                                <div className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                                  {c.inquiryType}
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Message */}
                          <td className="px-4 py-4">
                            <div className="max-w-[200px] sm:max-w-[300px]">
                              <p className="text-sm sm:text-base text-gray-900 line-clamp-2">
                                {c.message}
                              </p>
                            </div>
                          </td>

                          {/* Date (Hidden on mobile) */}
                          <td className="px-4 py-4 hidden lg:table-cell">
                            <div className="text-sm text-gray-600">
                              {new Date(c.createdAt).toLocaleDateString()}
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(c.createdAt).toLocaleTimeString()}
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="px-4 py-4">
                            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
                              <motion.button
                                onClick={() =>
                                  setReplyingTo(replyingTo === c._id ? null : c._id)
                                }
                                className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 flex items-center space-x-1 ${
                                  replyingTo === c._id
                                    ? 'bg-gray-500 text-white hover:bg-gray-600'
                                    : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700'
                                } shadow-md hover:shadow-lg`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                {replyingTo === c._id ? (
                                  <>
                                    <XMarkIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                                    <span className="hidden sm:inline">Close</span>
                                  </>
                                ) : (
                                  <>
                                    <ChatBubbleLeftRightIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                                    <span className="hidden sm:inline">Reply</span>
                                  </>
                                )}
                              </motion.button>

                              <motion.button
                                onClick={() => handleDelete(c._id)}
                                className="px-3 py-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg text-xs sm:text-sm font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center space-x-1 shadow-md hover:shadow-lg"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <TrashIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="hidden sm:inline">Delete</span>
                              </motion.button>
                            </div>

                            {/* Reply Section */}
                            <AnimatePresence>
                              {replyingTo === c._id && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                  animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-inner border border-blue-200 overflow-hidden"
                                >
                                  <div className="p-4 space-y-3">
                                    <div className="flex items-center space-x-2 text-sm font-medium text-blue-700">
                                      <PaperAirplaneIcon className="w-4 h-4" />
                                      <span>Reply to {c.name}</span>
                                    </div>
                                    <textarea
                                      rows={3}
                                      className="w-full border-2 border-blue-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all duration-200"
                                      placeholder="Type your reply..."
                                      value={replyMessage}
                                      onChange={(e) => {
                                        setReplyMessage(e.target.value);
                                        setReplyStatus("");
                                      }}
                                    />
                                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                                      <motion.button
                                        onClick={() => handleReply(c.email, c._id)}
                                        className="flex-1 sm:flex-none bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-4 py-2 rounded-xl hover:from-blue-700 hover:to-indigo-800 text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                      >
                                        <PaperAirplaneIcon className="w-4 h-4" />
                                        <span>Send Reply</span>
                                      </motion.button>
                                      <motion.button
                                        onClick={() => {
                                          setReplyingTo(null);
                                          setReplyMessage("");
                                          setReplyStatus("");
                                        }}
                                        className="flex-1 sm:flex-none bg-gray-400 text-white px-4 py-2 rounded-xl hover:bg-gray-500 text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-2"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                      >
                                        <XMarkIcon className="w-4 h-4" />
                                        <span>Cancel</span>
                                      </motion.button>
                                    </div>
                                    {replyStatus && (
                                      <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className={`text-sm font-semibold p-2 rounded-lg flex items-center space-x-2 ${
                                          replyStatus.startsWith("✅")
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                        }`}
                                      >
                                        {replyStatus.startsWith("✅") ? (
                                          <CheckCircleIcon className="w-4 h-4" />
                                        ) : (
                                          <ExclamationCircleIcon className="w-4 h-4" />
                                        )}
                                        <span>{replyStatus}</span>
                                      </motion.div>
                                    )}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <motion.tr
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        <td colSpan="5" className="py-12 text-center">
                          <div className="space-y-4">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                              <ChatBubbleLeftRightIcon className="w-10 h-10 text-gray-400" />
                            </div>
                            <div>
                              <p className="text-xl font-medium text-gray-500">No messages yet</p>
                              <p className="text-gray-400 mt-2">Contact messages will appear here</p>
                            </div>
                          </div>
                        </td>
                      </motion.tr>
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Contacts;
