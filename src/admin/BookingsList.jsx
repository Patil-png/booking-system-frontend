
import React, { useState, useEffect } from "react";
import { fetchBookings } from "../utils/api";
import { motion } from "framer-motion";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const exportDeletedBookingsToExcel = (bookings) => {
  const worksheet = XLSX.utils.json_to_sheet(bookings);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "DeletedBookings");
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(blob, `deleted_bookings_${new Date().toISOString()}.xlsx`);
};

const BookingsList = () => {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [bookings, setBookings] = useState([]);
  const [selectedBookings, setSelectedBookings] = useState([]);
  const [deleteMode, setDeleteMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getBookings = async () => {
      setLoading(true);
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

  const handleApprove = async (id) => {
    if (!window.confirm("Approve this booking and send payment link?")) return;
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
      console.error(err);
      alert("Approval failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;
    try {
      setLoading(true);
      const booking = bookings.find((b) => b._id === id);
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/bookings/${id}`, { method: "DELETE" });
      exportDeletedBookingsToExcel([booking]);
      const updated = await fetchBookings();
      setBookings(updated);
      alert("Booking deleted and backup downloaded.");
    } catch (err) {
      console.error("Failed to delete booking:", err);
      alert("Failed to delete booking.");
    } finally {
      setLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Delete ${selectedBookings.length} selected bookings?`)) return;
    try {
      setLoading(true);
      const deleted = [];
      for (const id of selectedBookings) {
        const booking = bookings.find((b) => b._id === id);
        if (booking) deleted.push(booking);
        await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/bookings/${id}`, { method: "DELETE" });
      }
      exportDeletedBookingsToExcel(deleted);
      const updated = await fetchBookings();
      setBookings(updated);
      setSelectedBookings([]);
      setDeleteMode(false);
      alert("Selected bookings deleted. Backup downloaded.");
    } catch (err) {
      console.error(err);
      alert("Failed to delete selected bookings.");
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
      (b.roomId?.name && b.roomId.name.toLowerCase().includes(q)) ||
      (b.slot && b.slot.toLowerCase().includes(q));

    const matchTab =
      activeTab === "All" ||
      (activeTab === "Room" && b.type === "Room") ||
      (activeTab === "Lawn" && b.type === "Lawn");

    const statusMap = {
      "Awaiting Approval": !b.isApproved && !b.isPaid,
      "Awaiting Payment": b.isApproved && !b.isPaid,
      "Payment Done": b.isApproved && b.isPaid,
      "Paid From Hotel": !b.isApproved && b.isPaid,
    };

    const matchStatus = statusFilter === "All" || statusMap[statusFilter];

    return matchSearch && matchTab && matchStatus;
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
          className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
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
      className="p-2 sm:p-4 md:p-6 bg-white rounded-xl shadow-lg mx-auto max-w-7xl"
    >
      <motion.h2
        variants={itemVariants}
        className="text-xl sm:text-3xl font-bold text-center text-green-700 mb-4 sm:mb-6 border-b-2 pb-2 sm:pb-3"
      >
        Manage Bookings
      </motion.h2>

      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3 mb-3 sm:mb-4 flex-wrap"
      >
        {["All", "Room", "Lawn"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-full font-medium text-xs sm:text-sm border transition ${
              activeTab === tab
                ? "bg-green-600 text-white border-green-600 shadow"
                : "bg-white text-gray-700 border-gray-300 hover:bg-green-50"
            }`}
          >
            {tab} Bookings
          </button>
        ))}
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3 mb-4 sm:mb-6 flex-wrap"
      >
        {[
          "All",
          "Awaiting Approval",
          "Awaiting Payment",
          "Payment Done",
          "Paid From Hotel",
        ].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-2.5 py-1 rounded-md text-xs sm:text-sm font-medium border ${
              statusFilter === status
                ? "bg-green-600 text-white border-green-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-green-50"
            }`}
          >
            {status}
          </button>
        ))}
      </motion.div>

      <motion.div variants={itemVariants} className="mb-3 sm:mb-4">
        <input
          type="text"
          placeholder="Search by email, phone, ID, type, room or slot..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-400 focus:border-transparent text-xs sm:text-sm"
        />
      </motion.div>

      {!deleteMode ? (
        <motion.div variants={itemVariants} className="mb-3 sm:mb-4 text-right">
          <button
            onClick={() => setDeleteMode(true)}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md shadow-md text-xs sm:text-sm"
          >
            Enable Delete Mode
          </button>
        </motion.div>
      ) : (
        <motion.div
          variants={itemVariants}
          className="mb-3 sm:mb-4 text-right flex flex-col sm:flex-row justify-end items-center gap-2"
        >
          <button
            onClick={handleBulkDelete}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md shadow-md text-xs sm:text-sm"
          >
            Delete Selected ({selectedBookings.length})
          </button>
          <button
            onClick={() => {
              setDeleteMode(false);
              setSelectedBookings([]);
            }}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-1.5 rounded shadow text-xs sm:text-sm"
          >
            Cancel
          </button>
        </motion.div>
      )}

      <motion.div variants={itemVariants} className="relative shadow-md rounded-lg">
        <div className="overflow-x-auto max-h-[600px] rounded-lg text-xs sm:text-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-green-100 sticky top-0 z-10">
              <tr>
                {deleteMode && (
                  <th className="px-3 py-3">
                    <input
                      type="checkbox"
                      onChange={(e) =>
                        e.target.checked
                          ? setSelectedBookings(filtered.map((b) => b._id))
                          : setSelectedBookings([])
                      }
                      checked={
                        filtered.length > 0 &&
                        selectedBookings.length === filtered.length
                      }
                    />
                  </th>
                )}
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 uppercase">Room</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 uppercase">Email</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 uppercase hidden md:table-cell">Phone</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 uppercase">Amount</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 uppercase hidden sm:table-cell">Check-In</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 uppercase hidden sm:table-cell">Check-Out</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 uppercase hidden lg:table-cell">Payment ID</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 uppercase">Status</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="10" className="text-center py-6 text-gray-500">
                    No bookings found.
                  </td>
                </tr>
              ) : (
                filtered.map((b, i) => (
                  <motion.tr
                    key={b._id}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    custom={i}
                    className="hover:bg-gray-50"
                  >
                    {deleteMode && (
                      <td className="px-3 py-3">
                        <input
                          type="checkbox"
                          checked={selectedBookings.includes(b._id)}
                          onChange={() => {
                            setSelectedBookings((prev) =>
                              prev.includes(b._id)
                                ? prev.filter((id) => id !== b._id)
                                : [...prev, b._id]
                            );
                          }}
                        />
                      </td>
                    )}
                    <td className="px-3 py-3 text-sm">
                      {b.roomId?.name || b.slot || "N/A"}
                    </td>
                    <td className="px-3 py-3 text-sm truncate max-w-[120px]">
                      {b.email}
                    </td>
                    <td className="px-3 py-3 text-sm hidden md:table-cell">
                      {b.phone}
                    </td>
                    <td className="px-3 py-3 text-sm font-semibold text-green-700">
                      ₹{b.amount}
                    </td>
                    <td className="px-3 py-3 text-sm hidden sm:table-cell">
                      {b.checkIn}
                    </td>
                    <td className="px-3 py-3 text-sm hidden sm:table-cell">
                      {b.checkOut}
                    </td>
                    <td className="px-3 py-3 text-sm hidden lg:table-cell truncate max-w-[150px]">
                      {b.paymentId || "-"}
                    </td>
                    <td className="px-3 py-3 text-sm">
                      {!b.isApproved && !b.isPaid ? (
                        <span className="bg-yellow-100 text-yellow-800 px-2 rounded-full text-xs">
                          Awaiting Approval
                        </span>
                      ) : b.isApproved && !b.isPaid ? (
                        <span className="bg-blue-100 text-blue-800 px-2 rounded-full text-xs">
                          Awaiting Payment
                        </span>
                      ) : b.isApproved && b.isPaid ? (
                        <span className="bg-green-100 text-green-800 px-2 rounded-full text-xs">
                          Payment Done
                        </span>
                      ) : (
                        <span className="bg-purple-100 text-purple-800 px-2 rounded-full text-xs">
                          Paid From Hotel
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-sm">
                      <div className="flex flex-col sm:flex-row gap-2">
                        {!b.isApproved && !b.paymentId && (
                          <button
                            onClick={() => handleApprove(b._id)}
                            className="text-green-700 border border-green-700 px-2 py-1 rounded hover:bg-green-50"
                          >
                            Approve
                          </button>
                        )}
                        {b.paymentId && (
                          <button
                            onClick={() => handleDownloadInvoice(b._id)}
                            className="text-blue-700 border border-blue-700 px-2 py-1 rounded hover:bg-blue-50"
                          >
                            Invoice
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(b._id)}
                          className="text-red-600 border border-red-600 px-2 py-1 rounded hover:bg-red-50"
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
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BookingsList;



// import React, { useState, useEffect } from "react";
// import { fetchBookings } from "../utils/api";
// import { motion } from "framer-motion";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";

// const exportDeletedBookingsToExcel = (bookings) => {
//   const worksheet = XLSX.utils.json_to_sheet(bookings);
//   const workbook = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(workbook, worksheet, "DeletedBookings");
//   const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
//   const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
//   saveAs(blob, `deleted_bookings_${new Date().toISOString()}.xlsx`);
// };

// const BookingsList = () => {
//   const [search, setSearch] = useState("");
//   const [activeTab, setActiveTab] = useState("All");
//   const [statusFilter, setStatusFilter] = useState("All");
//   const [bookings, setBookings] = useState([]);
//   const [selectedBookings, setSelectedBookings] = useState([]);
//   const [deleteMode, setDeleteMode] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const getBookings = async () => {
//       setLoading(true);
//       try {
//         const data = await fetchBookings();
//         setBookings(data);
//       } catch (err) {
//         console.error("Failed to fetch bookings:", err);
//         setError("Failed to load bookings. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     getBookings();
//   }, []);

//   const handleApprove = async (id) => {
//     if (!window.confirm("Approve this booking and send payment link?")) return;
//     try {
//       setLoading(true);
//       const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/bookings/approve/${id}`, {
//         method: "PUT",
//       });
//       const result = await res.json();
//       if (result.success) {
//         alert("Booking approved and email sent!");
//         const updated = await fetchBookings();
//         setBookings(updated);
//       } else {
//         alert(result.error || "Approval failed.");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Approval failed.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this booking?")) return;
//     try {
//       setLoading(true);
//       const booking = bookings.find((b) => b._id === id);
//       await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/bookings/${id}`, { method: "DELETE" });
//       exportDeletedBookingsToExcel([booking]);
//       const updated = await fetchBookings();
//       setBookings(updated);
//       alert("Booking deleted and backup downloaded.");
//     } catch (err) {
//       console.error("Failed to delete booking:", err);
//       alert("Failed to delete booking.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleBulkDelete = async () => {
//     if (!window.confirm(`Delete ${selectedBookings.length} selected bookings?`)) return;
//     try {
//       setLoading(true);
//       const deleted = [];
//       for (const id of selectedBookings) {
//         const booking = bookings.find((b) => b._id === id);
//         if (booking) deleted.push(booking);
//         await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/bookings/${id}`, { method: "DELETE" });
//       }
//       exportDeletedBookingsToExcel(deleted);
//       const updated = await fetchBookings();
//       setBookings(updated);
//       setSelectedBookings([]);
//       setDeleteMode(false);
//       alert("Selected bookings deleted. Backup downloaded.");
//     } catch (err) {
//       console.error(err);
//       alert("Failed to delete selected bookings.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDownloadInvoice = (id) => {
//     window.open(`${import.meta.env.VITE_API_BASE_URL}/api/bookings/invoice/${id}`, "_blank");
//   };

//   const filtered = bookings.filter((b) => {
//     const q = search.toLowerCase();
//     const matchSearch =
//       (b.email && b.email.toLowerCase().includes(q)) ||
//       (b.phone && b.phone.includes(q)) ||
//       (b._id && b._id.toLowerCase().includes(q)) ||
//       (b.type && b.type.toLowerCase().includes(q)) ||
//       (b.roomId?.name && b.roomId.name.toLowerCase().includes(q)) ||
//       (b.slot && b.slot.toLowerCase().includes(q));

//     const matchTab =
//       activeTab === "All" ||
//       (activeTab === "Room" && b.type === "Room") ||
//       (activeTab === "Lawn" && b.type === "Lawn");

//     const statusMap = {
//       "Awaiting Approval": !b.isApproved && !b.isPaid,
//       "Awaiting Payment": b.isApproved && !b.isPaid,
//       "Payment Done": b.isApproved && b.isPaid,
//       "Paid From Hotel": !b.isApproved && b.isPaid,
//     };

//     const matchStatus = statusFilter === "All" || statusMap[statusFilter];

//     return matchSearch && matchTab && matchStatus;
//   });

//   const containerVariants = {
//     hidden: { opacity: 0, y: 50 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         type: "spring",
//         stiffness: 70,
//         damping: 15,
//         delay: 0.1,
//         when: "beforeChildren",
//         staggerChildren: 0.05,
//       },
//     },
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: { type: "spring", stiffness: 100, damping: 12 },
//     },
//   };

//   const rowVariants = {
//     hidden: { opacity: 0, x: -20 },
//     visible: {
//       opacity: 1,
//       x: 0,
//       transition: { duration: 0.3, ease: "easeOut" },
//     },
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64 bg-gray-50 rounded-lg shadow-md p-6">
//         <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-green-500"></div>
//         <p className="ml-4 text-xl text-gray-600 font-semibold">Loading bookings...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="text-center p-8 bg-red-100 rounded-xl shadow-md text-red-800 font-semibold max-w-xl mx-auto mt-6 border border-red-300">
//         <p className="mb-4 text-lg">{error}</p>
//         <button
//           onClick={() => window.location.reload()}
//           className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
//         >
//           Retry
//         </button>
//       </div>
//     );
//   }

//   return (
//     <motion.div
//       variants={containerVariants}
//       initial="hidden"
//       animate="visible"
//       className="p-4 sm:p-6 md:p-8 bg-white rounded-xl shadow-lg mx-auto max-w-7xl"
//     >
//       <motion.h2
//         variants={itemVariants}
//         className="text-3xl sm:text-4xl font-bold text-center text-green-700 mb-6 border-b-2 pb-3"
//       >
//         Manage Bookings
//       </motion.h2>

//       <motion.div
//         variants={itemVariants}
//         className="flex justify-center gap-3 mb-4 flex-wrap"
//       >
//         {["All", "Room", "Lawn"].map((tab) => (
//           <button
//             key={tab}
//             onClick={() => setActiveTab(tab)}
//             className={`px-4 py-2 rounded-full font-medium text-sm border transition ${
//               activeTab === tab
//                 ? "bg-green-600 text-white border-green-600 shadow"
//                 : "bg-white text-gray-700 border-gray-300 hover:bg-green-50"
//             }`}
//           >
//             {tab} Bookings
//           </button>
//         ))}
//       </motion.div>

//       <motion.div
//         variants={itemVariants}
//         className="flex justify-center gap-3 mb-6 flex-wrap"
//       >
//         {[
//           "All",
//           "Awaiting Approval",
//           "Awaiting Payment",
//           "Payment Done",
//           "Paid From Hotel",
//         ].map((status) => (
//           <button
//             key={status}
//             onClick={() => setStatusFilter(status)}
//             className={`px-3 py-1 rounded-md text-sm font-medium border ${
//               statusFilter === status
//                 ? "bg-green-600 text-white border-green-600"
//                 : "bg-white text-gray-700 border-gray-300 hover:bg-green-50"
//             }`}
//           >
//             {status}
//           </button>
//         ))}
//       </motion.div>

//       <motion.div variants={itemVariants} className="mb-4">
//         <input
//           type="text"
//           placeholder="Search by email, phone, ID, type, room or slot..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-400 focus:border-transparent"
//         />
//       </motion.div>

//       {!deleteMode ? (
//         <motion.div variants={itemVariants} className="mb-4 text-right">
//           <button
//             onClick={() => setDeleteMode(true)}
//             className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md shadow-md"
//           >
//             Enable Delete Mode
//           </button>
//         </motion.div>
//       ) : (
//         <motion.div
//           variants={itemVariants}
//           className="mb-4 text-right flex flex-col sm:flex-row justify-end items-center gap-2"
//         >
//           <button
//             onClick={handleBulkDelete}
//             className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md shadow-md"
//           >
//             Delete Selected ({selectedBookings.length})
//           </button>
//           <button
//             onClick={() => {
//               setDeleteMode(false);
//               setSelectedBookings([]);
//             }}
//             className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded shadow"
//           >
//             Cancel
//           </button>
//         </motion.div>
//       )}

//       <motion.div variants={itemVariants} className="relative shadow-md rounded-lg">
//         <div className="overflow-x-auto max-h-[600px] rounded-lg">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-green-100 sticky top-0 z-10">
//               <tr>
//                 {deleteMode && (
//                   <th className="px-3 py-3">
//                     <input
//                       type="checkbox"
//                       onChange={(e) =>
//                         e.target.checked
//                           ? setSelectedBookings(filtered.map((b) => b._id))
//                           : setSelectedBookings([])
//                       }
//                       checked={
//                         filtered.length > 0 &&
//                         selectedBookings.length === filtered.length
//                       }
//                     />
//                   </th>
//                 )}
//                 <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 uppercase">Room</th>
//                 <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 uppercase">Email</th>
//                 <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 uppercase hidden md:table-cell">Phone</th>
//                 <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 uppercase">Amount</th>
//                 <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 uppercase hidden sm:table-cell">Check-In</th>
//                 <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 uppercase hidden sm:table-cell">Check-Out</th>
//                 <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 uppercase hidden lg:table-cell">Payment ID</th>
//                 <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 uppercase">Status</th>
//                 <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 uppercase">Action</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {filtered.length === 0 ? (
//                 <tr>
//                   <td colSpan="10" className="text-center py-6 text-gray-500">
//                     No bookings found.
//                   </td>
//                 </tr>
//               ) : (
//                 filtered.map((b, i) => (
//                   <motion.tr
//                     key={b._id}
//                     variants={rowVariants}
//                     initial="hidden"
//                     animate="visible"
//                     custom={i}
//                     className="hover:bg-gray-50"
//                   >
//                     {deleteMode && (
//                       <td className="px-3 py-3">
//                         <input
//                           type="checkbox"
//                           checked={selectedBookings.includes(b._id)}
//                           onChange={() => {
//                             setSelectedBookings((prev) =>
//                               prev.includes(b._id)
//                                 ? prev.filter((id) => id !== b._id)
//                                 : [...prev, b._id]
//                             );
//                           }}
//                         />
//                       </td>
//                     )}
//                     <td className="px-3 py-3 text-sm">
//                       {b.roomId?.name || b.slot || "N/A"}
//                     </td>
//                     <td className="px-3 py-3 text-sm truncate max-w-[120px]">
//                       {b.email}
//                     </td>
//                     <td className="px-3 py-3 text-sm hidden md:table-cell">
//                       {b.phone}
//                     </td>
//                     <td className="px-3 py-3 text-sm font-semibold text-green-700">
//                       ₹{b.amount}
//                     </td>
//                     <td className="px-3 py-3 text-sm hidden sm:table-cell">
//                       {b.checkIn}
//                     </td>
//                     <td className="px-3 py-3 text-sm hidden sm:table-cell">
//                       {b.checkOut}
//                     </td>
//                     <td className="px-3 py-3 text-sm hidden lg:table-cell truncate max-w-[150px]">
//                       {b.paymentId || "-"}
//                     </td>
//                     <td className="px-3 py-3 text-sm">
//                       {!b.isApproved && !b.isPaid ? (
//                         <span className="bg-yellow-100 text-yellow-800 px-2 rounded-full text-xs">
//                           Awaiting Approval
//                         </span>
//                       ) : b.isApproved && !b.isPaid ? (
//                         <span className="bg-blue-100 text-blue-800 px-2 rounded-full text-xs">
//                           Awaiting Payment
//                         </span>
//                       ) : b.isApproved && b.isPaid ? (
//                         <span className="bg-green-100 text-green-800 px-2 rounded-full text-xs">
//                           Payment Done
//                         </span>
//                       ) : (
//                         <span className="bg-purple-100 text-purple-800 px-2 rounded-full text-xs">
//                           Paid From Hotel
//                         </span>
//                       )}
//                     </td>
//                     <td className="px-3 py-3 text-sm">
//                       <div className="flex flex-col sm:flex-row gap-2">
//                         {!b.isApproved && !b.paymentId && (
//                           <button
//                             onClick={() => handleApprove(b._id)}
//                             className="text-green-700 border border-green-700 px-2 py-1 rounded hover:bg-green-50"
//                           >
//                             Approve
//                           </button>
//                         )}
//                         {b.paymentId && (
//                           <button
//                             onClick={() => handleDownloadInvoice(b._id)}
//                             className="text-blue-700 border border-blue-700 px-2 py-1 rounded hover:bg-blue-50"
//                           >
//                             Invoice
//                           </button>
//                         )}
//                         <button
//                           onClick={() => handleDelete(b._id)}
//                           className="text-red-600 border border-red-600 px-2 py-1 rounded hover:bg-red-50"
//                         >
//                           Delete
//                         </button>
//                       </div>
//                     </td>
//                   </motion.tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </motion.div>
//     </motion.div>
//   );
// };

// export default BookingsList;


