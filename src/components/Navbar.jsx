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


// import React, { useEffect, useState } from 'react';
// import { motion } from 'framer-motion';
// import { FaHotel, FaPagelines } from 'react-icons/fa';

// const Navbar = ({ selectedTab, setSelectedTab }) => {
//   const [isVisible, setIsVisible] = useState(true);
//   let lastScroll = 0;

//   useEffect(() => {
//     const handleScroll = () => {
//       const current = window.scrollY;
//       setIsVisible(current < lastScroll || current < 10);
//       lastScroll = current;
//     };

//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   return (
//     <motion.nav
//       initial={{ y: 0 }}
//       animate={{ y: isVisible ? 0 : -100 }}
//       transition={{ duration: 0.3 }}
//       className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-green-600 to-teal-500 shadow-md"
//     >
//       <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between px-4 py-3 gap-2 sm:gap-0">
//         <h1 className="text-white text-xl sm:text-2xl font-bold tracking-wide mb-1 sm:mb-0">
//           Taj Style Booking
//         </h1>
//         <div className="flex flex-col sm:flex-row gap-2">
//           <motion.button
//             whileTap={{ scale: 0.95 }}
//             onClick={() => setSelectedTab('room')}
//             className={`flex items-center justify-center gap-2 px-5 py-2 rounded-full text-sm font-semibold shadow transition-all duration-300 ${
//               selectedTab === 'room'
//                 ? 'bg-white text-green-700'
//                 : 'bg-green-700 text-white hover:bg-green-800'
//             }`}
//           >
//             <FaHotel className="text-base" />
//             Room Booking
//           </motion.button>
//           <motion.button
//             whileTap={{ scale: 0.95 }}
//             onClick={() => setSelectedTab('lawn')}
//             className={`flex items-center justify-center gap-2 px-5 py-2 rounded-full text-sm font-semibold shadow transition-all duration-300 ${
//               selectedTab === 'lawn'
//                 ? 'bg-white text-green-700'
//                 : 'bg-green-700 text-white hover:bg-green-800'
//             }`}
//           >
//             <FaPagelines className="text-base" />
//             Lawn Booking
//           </motion.button>
//         </div>
//       </div>
//     </motion.nav>
//   );
// };

// export default Navbar;

