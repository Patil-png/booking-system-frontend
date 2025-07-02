import React, { useState, useEffect } from 'react';
import { fetchBookings } from '../utils/api';

const BookingsList = () => {
  const [search, setSearch] = useState('');
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings().then(setBookings);
  }, []);

  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this booking?');
    if (!confirm) return;

    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/bookings/${id}`, {
        method: 'DELETE',
      });
      // Refresh bookings list
      const updated = await fetchBookings();
      setBookings(updated);
    } catch (err) {
      alert('Failed to delete booking');
    }
  };

  const filtered = bookings.filter(b =>
    (b.email || '').includes(search) ||
    (b.phone || '').includes(search) ||
    (b._id || '').includes(search) ||
    (b.type || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white mt-6 rounded-xl shadow-md animate-fade-in-down">
      <h2 className="text-3xl font-bold text-center text-green-600 mb-6">Bookings List</h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by email, phone, ID, type"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
          <thead className="bg-green-100">
            <tr>
              <th className="text-left px-4 py-2 border-b">Type</th>
              <th className="text-left px-4 py-2 border-b">Email</th>
              <th className="text-left px-4 py-2 border-b">Phone</th>
              <th className="text-left px-4 py-2 border-b">Amount</th>
              <th className="text-left px-4 py-2 border-b">Check-In</th>
              <th className="text-left px-4 py-2 border-b">Check-Out</th>
              <th className="text-left px-4 py-2 border-b">Payment ID</th>
              <th className="text-left px-4 py-2 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((b) => (
              <tr key={b._id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-2 border-b">{b.type}</td>
                <td className="px-4 py-2 border-b">{b.email}</td>
                <td className="px-4 py-2 border-b">{b.phone}</td>
                <td className="px-4 py-2 border-b text-green-700 font-semibold">₹{b.amount}</td>
                <td className="px-4 py-2 border-b">{b.checkIn}</td>
                <td className="px-4 py-2 border-b">{b.checkOut}</td>
                <td className="px-4 py-2 border-b">{b.paymentId}</td>
                <td className="px-4 py-2 border-b">
                  <button
                    onClick={() => handleDelete(b._id)}
                    className="text-red-600 font-semibold hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center py-6 text-gray-500">
                  No bookings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
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
