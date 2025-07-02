// src/components/Navbar/BookingNavbar.jsx

import React from 'react';

const BookingNavbar = ({ selectedTab, setSelectedTab }) => {
  return (
    <nav className="flex justify-center gap-4 p-4 bg-gradient-to-r from-green-500 to-teal-500 shadow-md sticky top-0 z-50">
      <button
        onClick={() => setSelectedTab('room')}
        className={`px-6 py-2 rounded-full font-semibold transition-transform transform hover:scale-105 ${
          selectedTab === 'room'
            ? 'bg-white text-green-600 shadow-md'
            : 'bg-green-600 text-white hover:bg-green-700'
        }`}
      >
        Room Booking
      </button>
      <button
        onClick={() => setSelectedTab('lawn')}
        className={`px-6 py-2 rounded-full font-semibold transition-transform transform hover:scale-105 ${
          selectedTab === 'lawn'
            ? 'bg-white text-green-600 shadow-md'
            : 'bg-green-600 text-white hover:bg-green-700'
        }`}
      >
        Lawn Booking
      </button>
    </nav>
  );
};

export default BookingNavbar;
