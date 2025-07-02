import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaHotel, FaPagelines } from 'react-icons/fa';

const Navbar = ({ selectedTab, setSelectedTab }) => {
  const [isVisible, setIsVisible] = useState(true);
  let lastScroll = 0;

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      setIsVisible(current < lastScroll || current < 10);
      lastScroll = current;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : -100 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-green-600 to-teal-500 shadow-md"
    >
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between px-4 py-3 gap-2 sm:gap-0">
        <h1 className="text-white text-xl sm:text-2xl font-bold tracking-wide mb-1 sm:mb-0">
          Taj Style Booking
        </h1>
        <div className="flex flex-col sm:flex-row gap-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedTab('room')}
            className={`flex items-center justify-center gap-2 px-5 py-2 rounded-full text-sm font-semibold shadow transition-all duration-300 ${
              selectedTab === 'room'
                ? 'bg-white text-green-700'
                : 'bg-green-700 text-white hover:bg-green-800'
            }`}
          >
            <FaHotel className="text-base" />
            Room Booking
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedTab('lawn')}
            className={`flex items-center justify-center gap-2 px-5 py-2 rounded-full text-sm font-semibold shadow transition-all duration-300 ${
              selectedTab === 'lawn'
                ? 'bg-white text-green-700'
                : 'bg-green-700 text-white hover:bg-green-800'
            }`}
          >
            <FaPagelines className="text-base" />
            Lawn Booking
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;


// import React from 'react';
// import { motion } from 'framer-motion';
// import { FaHotel, FaPagelines } from 'react-icons/fa';

// const Navbar = ({ selectedTab, setSelectedTab }) => {
//   return (
//     <nav className="w-full bg-gradient-to-r from-green-600 to-teal-500 shadow-lg sticky top-0 z-50">
//       <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center sm:justify-between px-4 py-3">
//         <h1 className="text-white text-2xl font-bold tracking-wide mb-2 sm:mb-0">
//           Taj Style Booking
//         </h1>
//         <div className="flex gap-3">
//           <motion.button
//             whileTap={{ scale: 0.95 }}
//             onClick={() => setSelectedTab('room')}
//             className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 shadow-md
//               ${
//                 selectedTab === 'room'
//                   ? 'bg-white text-green-700'
//                   : 'bg-green-700 text-white hover:bg-green-800'
//               }`}
//           >
//             <FaHotel className="text-lg" />
//             Room Booking
//           </motion.button>
//           <motion.button
//             whileTap={{ scale: 0.95 }}
//             onClick={() => setSelectedTab('lawn')}
//             className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 shadow-md
//               ${
//                 selectedTab === 'lawn'
//                   ? 'bg-white text-green-700'
//                   : 'bg-green-700 text-white hover:bg-green-800'
//               }`}
//           >
//             <FaPagelines className="text-lg" />
//             Lawn Booking
//           </motion.button>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;



// import React from 'react';

// const Navbar = ({ selectedTab, setSelectedTab }) => {
//   return (
//     <nav className="flex justify-center gap-4 p-4 bg-gradient-to-r from-green-500 to-teal-500 shadow-md sticky top-0 z-50">
//       <button
//         onClick={() => setSelectedTab('room')}
//         className={`px-6 py-2 rounded-full text-white font-semibold transition-transform transform hover:scale-105 ${
//           selectedTab === 'room' ? 'bg-green-500 text-green-600 shadow' : 'bg-green-600 hover:bg-green-700'
//         }`}
//       >
//         Room Booking
//       </button>
//       <button
//         onClick={() => setSelectedTab('lawn')}
//         className={`px-6 py-2 rounded-full text-white font-semibold transition-transform transform hover:scale-105 ${
//           selectedTab === 'lawn' ? 'bg-green-500 text-green-600 shadow' : 'bg-green-600 hover:bg-green-700'
//         }`}
//       >
//         Lawn Booking
//       </button>
//     </nav>
//   );
// };

// export default Navbar;

