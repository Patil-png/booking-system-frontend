import React, { useState, useEffect } from "react";
import { fetchBookings } from "../utils/api";
import { motion } from "framer-motion";

const BookingsList = () => {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All"); // New: tab state
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getBookings = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchBookings();
        setBookings(data);
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
        setError("Failed to load bookings. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    getBookings();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this booking?");
    if (!confirmDelete) return;
    try {
      setLoading(true);
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/bookings/${id}`, { method: "DELETE" });
      const updated = await fetchBookings();
      setBookings(updated);
      alert("Booking deleted successfully!");
    } catch (err) {
      console.error("Failed to delete booking:", err);
      alert("Failed to delete booking.");
      setError("Failed to delete booking.");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    const confirm = window.confirm("Approve this booking and send payment link?");
    if (!confirm) return;
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/bookings/approve/${id}`, {
        method: "PUT",
      });
      const result = await res.json();
      if (result.success) {
        alert("Booking approved and email sent!");
        const updated = await fetchBookings();
        setBookings(updated);
      } else {
        alert(result.error || "Approval failed.");
      }
    } catch (err) {
      console.error("Approval error:", err);
      alert("Approval failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadInvoice = (id) => {
    window.open(`${import.meta.env.VITE_API_BASE_URL}/api/bookings/invoice/${id}`, "_blank");
  };

  const filtered = bookings.filter((b) => {
    const q = search.toLowerCase();
    const matchSearch =
      (b.email && b.email.toLowerCase().includes(q)) ||
      (b.phone && b.phone.includes(q)) ||
      (b._id && b._id.toLowerCase().includes(q)) ||
      (b.type && b.type.toLowerCase().includes(q)) ||
      (b.roomId && b.roomId.toLowerCase?.().includes(q)) ||
      (b.slot && b.slot.toLowerCase().includes(q));

    const matchTab =
      activeTab === "All" ||
      (activeTab === "Room" && b.type === "Room") ||
      (activeTab === "Lawn" && b.type === "Lawn");

    return matchSearch && matchTab;
  });

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
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 12 },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-gray-50 rounded-lg shadow-md p-6">
        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-green-500"></div>
        <p className="ml-4 text-xl text-gray-600 font-semibold">Loading bookings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 bg-red-100 rounded-xl shadow-md text-red-800 font-semibold max-w-xl mx-auto mt-6 border border-red-300">
        <p className="mb-4 text-lg">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300 ease-in-out"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-4 sm:p-6 md:p-8 bg-white rounded-xl shadow-lg mx-auto max-w-7xl"
    >
      <motion.h2
        className="text-3xl sm:text-4xl font-bold text-center text-green-700 mb-6 border-b-2 pb-3"
        variants={itemVariants}
      >
        Manage Bookings
      </motion.h2>

      {/* ✅ Tab Buttons */}
      <motion.div variants={itemVariants} className="flex justify-center gap-4 mb-6">
        {["All", "Room", "Lawn"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full font-medium text-sm transition duration-300 ease-in-out border ${
              activeTab === tab
                ? "bg-green-600 text-white border-green-600 shadow-md"
                : "bg-white text-gray-700 border-gray-300 hover:bg-green-50"
            }`}
          >
            {tab} Bookings
          </button>
        ))}
      </motion.div>

      {/* 🔍 Search */}
      <motion.div className="mb-6" variants={itemVariants}>
        <input
          type="text"
          placeholder="Search by email, phone, ID, type, room ID, or slot..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-400 focus:border-transparent transition duration-200 ease-in-out text-gray-700 placeholder-gray-400"
        />
      </motion.div>

      {/* 📋 Table */}
      <motion.div className="overflow-x-auto relative shadow-md rounded-lg" variants={itemVariants}>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-green-100">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Room</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Email</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider hidden md:table-cell">Phone</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Amount</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider hidden sm:table-cell">Check-In</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider hidden sm:table-cell">Check-Out</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider hidden lg:table-cell">Payment ID</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="9" className="px-6 py-4 text-center text-gray-500">No bookings found.</td>
              </tr>
            ) : (
              filtered.map((b, i) => (
                <motion.tr
                  key={b._id}
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  custom={i}
                  className="hover:bg-gray-50 transition-colors duration-200 ease-in-out"
                >
                  <td className="px-3 py-3 text-sm font-medium text-gray-900">{b.roomId?.name || b.slot || "N/A"}</td>
                  <td className="px-3 py-3 text-sm text-gray-700 truncate max-w-[120px] sm:max-w-none">{b.email}</td>
                  <td className="px-3 py-3 text-sm text-gray-700 hidden md:table-cell">{b.phone}</td>
                  <td className="px-3 py-3 text-sm font-semibold text-green-700">₹{b.amount}</td>
                  <td className="px-3 py-3 text-sm text-gray-700 hidden sm:table-cell">{b.checkIn}</td>
                  <td className="px-3 py-3 text-sm text-gray-700 hidden sm:table-cell">{b.checkOut}</td>
                  <td className="px-3 py-3 text-sm text-gray-700 hidden lg:table-cell truncate max-w-[150px]">{b.paymentId || "-"}</td>
                  <td className="px-3 py-3 text-sm font-medium">
  {(() => {
    if (!b.isApproved && !b.isPaid) {
      return (
        <span className="px-2 inline-flex text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
          Awaiting Approval
        </span>
      );
    }
    if (b.isApproved && !b.isPaid) {
      return (
        <span className="px-2 inline-flex text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
          Awaiting Payment
        </span>
      );
    }
    if (b.isApproved && b.isPaid) {
      return (
        <span className="px-2 inline-flex text-xs font-semibold rounded-full bg-green-100 text-green-800">
          Payment Done
        </span>
      );
    }
    if (!b.isApproved && b.isPaid) {
      return (
        <span className="px-2 inline-flex text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
          Paid From Hotel
        </span>
      );
    }
    return null;
  })()}
</td>

                  <td className="px-3 py-3 text-right text-sm font-medium">
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                      {!b.isApproved && !b.paymentId && (
                        <button
                          onClick={() => handleApprove(b._id)}
                          className="text-green-700 hover:text-green-900 transition duration-300 ease-in-out px-2 py-1 border border-green-700 rounded-md hover:bg-green-50"
                        >
                          Approve
                        </button>
                      )}
                      {b.paymentId && (
                        <button
                          onClick={() => handleDownloadInvoice(b._id)}
                          className="text-blue-600 hover:text-blue-900 transition duration-300 ease-in-out px-2 py-1 border border-blue-600 rounded-md hover:bg-blue-50"
                        >
                          Invoice
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(b._id)}
                        className="text-red-600 hover:text-red-900 transition duration-300 ease-in-out px-2 py-1 border border-red-600 rounded-md hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </motion.div>
    </motion.div>
  );
};

export default BookingsList;
