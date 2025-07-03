import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

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
        type: "spring",
        stiffness: 70,
        damping: 15,
        delay: 0.1,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
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
        damping: 12,
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
      <div className="flex justify-center items-center h-screen-minus-header">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
        <p className="ml-4 text-lg text-gray-600">Loading messages...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 bg-red-100 rounded-xl shadow-md text-red-800 font-semibold max-w-xl mx-auto mt-6">
        <p>{error}</p>
        <button
          onClick={fetchContacts}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <motion.div
      className="max-w-7xl mx-auto  p-2 sm:p-6 lg:p-8 bg-white mt-6 mb-10 rounded-2xl shadow-xl overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.button
        onClick={() => navigate(-1)}
        className="mb-4 px-3 py-1.5 sm:px-4 sm:py-2 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 transition duration-200 ease-in-out text-sm sm:text-base"
        variants={itemVariants}
      >
        ← Back
      </motion.button>

      <motion.h1
        className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-center text-green-600 mb-6 sm:mb-8"
        variants={itemVariants}
      >
        Contact Messages
      </motion.h1>

      <motion.div
        className="overflow-x-auto relative bg-white shadow-xl rounded-2xl p-2 sm:p-4 border border-gray-200"
        variants={itemVariants}
      >
        <div className="min-w-[700px]">
          <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
            <thead className="bg-green-100 sticky top-0 z-10">
              <motion.tr
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2 hidden md:table-cell">Phone</th>
                <th className="px-3 py-2 hidden lg:table-cell">Inquiry</th>
                <th className="px-3 py-2">Message</th>
                <th className="px-3 py-2 hidden sm:table-cell">Date</th>
                <th className="px-3 py-2">Actions</th>
              </motion.tr>
            </thead>
            <AnimatePresence>
              <tbody className="bg-white divide-y divide-gray-200">
                {contacts.length > 0 ? (
                  contacts.map((c, index) => (
                    <motion.tr
                      key={c._id}
                      className="hover:bg-gray-50 transition"
                      variants={rowVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      custom={index}
                    >
                      <td className="px-3 py-2">{c.name}</td>
                      <td className="px-3 py-2 max-w-[120px] truncate">{c.email}</td>
                      <td className="px-3 py-2 hidden md:table-cell">{c.phone || "N/A"}</td>
                      <td className="px-3 py-2 hidden lg:table-cell">{c.inquiryType || "N/A"}</td>
                      <td className="px-3 py-2 max-w-[160px] truncate">{c.message}</td>
                      <td className="px-3 py-2 hidden sm:table-cell">
                        {new Date(c.createdAt).toLocaleString()}
                      </td>
                      <td className="px-3 py-2 text-right">
                        <button
                          onClick={() =>
                            setReplyingTo(replyingTo === c._id ? null : c._id)
                          }
                          className="bg-green-500 text-white px-2 py-1 text-xs rounded-md hover:bg-green-600 mr-2"
                        >
                          {replyingTo === c._id ? "Close" : "Reply"}
                        </button>
                        <button
                          onClick={() => handleDelete(c._id)}
                          className="bg-red-500 text-white px-2 py-1 text-xs rounded-md hover:bg-red-600"
                        >
                          Delete
                        </button>

                        <AnimatePresence>
                          {replyingTo === c._id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="mt-3 p-3 bg-gray-50 rounded-lg shadow-inner border border-gray-200 flex flex-col items-start"
                            >
                              <textarea
                                rows={3}
                                className="w-full max-h-40 overflow-y-auto border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-y"
                                placeholder="Type your reply..."
                                value={replyMessage}
                                onChange={(e) => {
                                  setReplyMessage(e.target.value);
                                  setReplyStatus("");
                                }}
                              />
                              <div className="flex mt-3 gap-2 w-full justify-end">
                                <button
                                  onClick={() => handleReply(c.email, c._id)}
                                  className="bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 text-sm"
                                >
                                  Send Reply
                                </button>
                                <button
                                  onClick={() => {
                                    setReplyingTo(null);
                                    setReplyMessage("");
                                    setReplyStatus("");
                                  }}
                                  className="bg-gray-400 text-white px-3 py-1.5 rounded-md hover:bg-gray-500 text-sm"
                                >
                                  Cancel
                                </button>
                              </div>
                              {replyStatus && (
                                <motion.p
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className={`text-sm mt-2 font-semibold ${
                                    replyStatus.startsWith("✅")
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }`}
                                >
                                  {replyStatus}
                                </motion.p>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-6 text-gray-500 text-lg">
                      No contact messages found.
                    </td>
                  </tr>
                )}
              </tbody>
            </AnimatePresence>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Contacts;
