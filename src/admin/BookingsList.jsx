import React, { useState, useEffect } from 'react';
import { fetchBookings } from '../utils/api'; // Make sure this path is correct
import { motion } from 'framer-motion';

const BookingsList = () => {
  const [search, setSearch] = useState('');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getBookings = async () => {
      setLoading(true);
      setError(null); // Clear previous errors
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
    const confirmDelete = window.confirm('Are you sure you want to delete this booking? This action cannot be undone.');
    if (!confirmDelete) return;

    try {
      setLoading(true); // Indicate loading state during deletion
      // Assuming your backend delete endpoint is correctly configured
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/bookings/${id}`, { method: 'DELETE' });
      // Re-fetch the bookings to update the list
      const updated = await fetchBookings();
      setBookings(updated);
      alert('Booking deleted successfully!');
    } catch (err) {
      console.error("Failed to delete booking:", err);
      alert('Failed to delete booking. Please try again.');
      setError("Failed to delete booking. Please try again.");
    } finally {
      setLoading(false); // End loading state
    }
  };

  const filtered = bookings.filter(b => {
    const q = search.toLowerCase();
    return (
      (b.email && b.email.toLowerCase().includes(q)) ||
      (b.phone && b.phone.includes(q)) ||
      (b._id && b._id.toLowerCase().includes(q)) || // Added .toLowerCase() for consistency
      (b.type && b.type.toLowerCase().includes(q)) ||
      (b.roomId && b.roomId.toLowerCase().includes(q)) ||
      (b.slot && b.slot.toLowerCase().includes(q))
    );
  });

  // Framer Motion Variants
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
      }
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 12 }
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
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
          onClick={() => window.location.reload()} // Simple reload to re-attempt fetch
          className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
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
      className="p-4 sm:p-6 md:p-8 lg:p-10 bg-white rounded-xl shadow-lg min-h-[400px]" // Added min-h for consistent initial layout
    >
      <motion.h2
        className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-center text-green-700 mb-6 sm:mb-8 pb-2 border-b-2 border-green-200"
        variants={itemVariants}
      >
        Manage Bookings
      </motion.h2>

      <motion.div className="mb-6 sm:mb-8" variants={itemVariants}>
        <input
          type="text"
          placeholder="Search by email, phone, ID, type (Room, Lawn, etc.)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-3 focus:ring-green-400 text-base placeholder-gray-500 transition duration-200 ease-in-out hover:border-green-400"
        />
      </motion.div>

      {/* Booking List Container - Fixed Height with Scroll */}
      <motion.div
        className="h-[calc(100vh-280px)] md:h-[calc(100vh-320px)] lg:h-[calc(100vh-280px)] overflow-y-auto relative shadow-inner rounded-lg border border-gray-100 bg-gray-50" // Adjusted height using calc() for responsiveness
        variants={itemVariants} // Apply animation to the container itself
      >
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-green-100 sticky top-0 z-10 shadow-sm">
            <motion.tr initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Type</th>
              <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Email</th>
              <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider hidden md:table-cell">Phone</th>
              <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Amount</th>
              <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider hidden sm:table-cell">Check-In</th>
              <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider hidden sm:table-cell">Check-Out</th>
              <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider hidden lg:table-cell">Payment ID</th>
              <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Action</th>
            </motion.tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {filtered.length > 0 ? (
              filtered.map((b, index) => (
                <motion.tr
                  key={b._id}
                  className="hover:bg-gray-50 transition duration-150 ease-in-out"
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  custom={index}
                  whileHover={{ scale: 1.01, backgroundColor: "#f3f4f6" }} // Subtle hover effect for rows
                >
                  <td className="px-3 py-2 sm:px-4 sm:py-3 text-sm text-gray-900 font-medium">{b.type}</td>
                  <td className="px-3 py-2 sm:px-4 sm:py-3 text-sm text-gray-700 truncate max-w-[100px] sm:max-w-none">{b.email}</td>
                  <td className="px-3 py-2 sm:px-4 sm:py-3 text-sm text-gray-700 hidden md:table-cell">{b.phone}</td>
                  <td className="px-3 py-2 sm:px-4 sm:py-3 text-sm text-green-700 font-bold">₹{b.amount}</td>
                  <td className="px-3 py-2 sm:px-4 sm:py-3 text-sm text-gray-700 hidden sm:table-cell">{b.checkIn}</td>
                  <td className="px-3 py-2 sm:px-4 sm:py-3 text-sm text-gray-700 hidden sm:table-cell">{b.checkOut}</td>
                  <td className="px-3 py-2 sm:px-4 sm:py-3 text-sm text-gray-700 hidden lg:table-cell truncate max-w-[80px]">{b.paymentId}</td>
                  <td className="px-3 py-2 sm:px-4 sm:py-3 text-right text-sm font-medium">
                    <button
                      onClick={() => handleDelete(b._id)}
                      className="text-red-600 hover:text-red-800 font-semibold hover:underline px-3 py-1 rounded-md transition-colors duration-200"
                    >
                      Delete
                    </button>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-8 text-gray-500 text-lg">
                  {search ? "No bookings match your search." : "No bookings found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </motion.div>
    </motion.div>
  );
};

export default BookingsList;



// import React, { useState, useEffect } from 'react';
// import { fetchBookings } from '../utils/api';

// const BookingsList = () => {
//   const [search, setSearch] = useState('');
//   const [bookings, setBookings] = useState([]);

//   useEffect(() => {
//     fetchBookings().then(setBookings);
//   }, []);

//   const filtered = bookings.filter(b =>
//     (b.email || '').includes(search) ||
//     (b.phone || '').includes(search) ||
//     (b._id || '').includes(search) ||
//     (b.type || '').toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <div className="max-w-7xl mx-auto p-6 bg-white mt-6 rounded-xl shadow-md animate-fade-in-down">
//       <h2 className="text-3xl font-bold text-center text-green-600 mb-6">Bookings List</h2>

//       <div className="mb-4">
//         <input
//           type="text"
//           placeholder="Search by email, phone, ID, type"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
//         />
//       </div>

//       <div className="overflow-x-auto">
//         <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
//           <thead className="bg-green-100">
//             <tr>
//               <th className="text-left px-4 py-2 border-b">Type</th>
//               <th className="text-left px-4 py-2 border-b">Email</th>
//               <th className="text-left px-4 py-2 border-b">Phone</th>
//               <th className="text-left px-4 py-2 border-b">Amount</th>
//               <th className="text-left px-4 py-2 border-b">Check-In</th>
//               <th className="text-left px-4 py-2 border-b">Check-Out</th>
//               <th className="text-left px-4 py-2 border-b">Payment ID</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filtered.map((b) => (
//               <tr key={b._id} className="hover:bg-gray-50 transition">
//                 <td className="px-4 py-2 border-b">{b.type}</td>
//                 <td className="px-4 py-2 border-b">{b.email}</td>
//                 <td className="px-4 py-2 border-b">{b.phone}</td>
//                 <td className="px-4 py-2 border-b text-green-700 font-semibold">₹{b.amount}</td>
//                 <td className="px-4 py-2 border-b">{b.checkIn}</td>
//                 <td className="px-4 py-2 border-b">{b.checkOut}</td>
//                 <td className="px-4 py-2 border-b">{b.paymentId}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default BookingsList;
