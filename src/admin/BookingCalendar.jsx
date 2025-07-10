import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import axios from 'axios';
import { motion } from 'framer-motion';

const DashboardHome = () => {
  const [events, setEvents] = useState([]);
  const [showCalendar, setShowCalendar] = useState(window.innerWidth >= 700);

  const fetchBookings = async () => {
    try {
      const res = await axios.get('/api/bookings');
      const mapped = res.data.map((b) => ({
        title: `${b.type}: ${b.type === 'Room' ? b.roomId : b.slot}`,
        start: b.checkIn,
        end: b.checkOut,
        backgroundColor:
          b.status === 'confirmed' ? '#10B981' :
          b.status === 'pending' ? '#F59E0B' :
          '#EF4444',
        borderColor: 'black',
        textColor: '#FFFFFF',
      }));
      setEvents(mapped);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    }
  };

  useEffect(() => {
    fetchBookings();

    const handleResize = () => {
      setShowCalendar(window.innerWidth >= 700);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 12 },
    },
  };

  return (
    <>
      <motion.h1
        className="text-4xl font-extrabold text-center text-gray-800 mb-8 mt-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Admin Dashboard Overview
      </motion.h1>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 px-4 sm:px-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 0.1 },
          },
        }}
      >
        <motion.div
          className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex flex-col items-center justify-center text-center"
          variants={sectionVariants}
        >
          <span className="text-5xl mb-3 text-blue-500">📊</span>
          <h2 className="text-xl font-semibold mb-2">Total Bookings</h2>
          <p className="text-3xl font-bold text-gray-700">125</p>
        </motion.div>

        <motion.div
          className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex flex-col items-center justify-center text-center"
          variants={sectionVariants}
        >
          <span className="text-5xl mb-3 text-purple-500">✉️</span>
          <h2 className="text-xl font-semibold mb-2">New Contacts</h2>
          <p className="text-3xl font-bold text-gray-700">15</p>
        </motion.div>

        <motion.div
          className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex flex-col items-center justify-center text-center"
          variants={sectionVariants}
        >
          <span className="text-5xl mb-3 text-yellow-500">🗓️</span>
          <h2 className="text-xl font-semibold mb-2">Upcoming Events</h2>
          <p className="text-3xl font-bold text-gray-700">7</p>
        </motion.div>
      </motion.div>

      {showCalendar ? (
        <motion.div
          className="mt-10 px-4 sm:px-6"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            events={events}
            height="auto"
          />
        </motion.div>
      ) : (
        <motion.div
          className="text-center p-8 mt-10 mx-4 sm:mx-6 bg-blue-100 rounded-xl shadow-md text-blue-800 font-semibold"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <p>
            Calendar view is optimized for wider screens. Please widen your
            browser or use a desktop device.
          </p>
        </motion.div>
      )}
    </>
  );
};

export default DashboardHome;


// import React, { useEffect, useState } from 'react';
// import FullCalendar from '@fullcalendar/react';
// import dayGridPlugin from '@fullcalendar/daygrid';
// import axios from 'axios';
// import { motion } from 'framer-motion';

// const DashboardHome = () => {
//   const [events, setEvents] = useState([]);
//   const [showCalendar, setShowCalendar] = useState(window.innerWidth >= 700);

//   const fetchBookings = async () => {
//     try {
//       const res = await axios.get('/api/bookings');
//       const mapped = res.data.map((b) => ({
//         title: `${b.type}: ${b.type === 'Room' ? b.roomId : b.slot}`,
//         start: b.checkIn,
//         end: b.checkOut,
//         backgroundColor:
//           b.status === 'confirmed' ? '#10B981' :
//           b.status === 'pending' ? '#F59E0B' :
//           '#EF4444',
//         borderColor: 'black',
//         textColor: '#FFFFFF',
//       }));
//       setEvents(mapped);
//     } catch (err) {
//       console.error('Error fetching bookings:', err);
//     }
//   };

//   useEffect(() => {
//     fetchBookings();

//     const handleResize = () => {
//       setShowCalendar(window.innerWidth >= 700);
//     };
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   const sectionVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: { type: 'spring', stiffness: 100, damping: 12 },
//     },
//   };

//   return (
//     <>
//       <motion.h1
//         className="text-4xl font-extrabold text-center text-gray-800 mb-8 mt-4"
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//       >
//         Admin Dashboard Overview
//       </motion.h1>

//       <motion.div
//         className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 px-4 sm:px-6"
//         initial="hidden"
//         animate="visible"
//         variants={{
//           hidden: { opacity: 0 },
//           visible: {
//             opacity: 1,
//             transition: { staggerChildren: 0.15, delayChildren: 0.1 },
//           },
//         }}
//       >
//         <motion.div
//           className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex flex-col items-center justify-center text-center"
//           variants={sectionVariants}
//         >
//           <span className="text-5xl mb-3 text-blue-500">📊</span>
//           <h2 className="text-xl font-semibold mb-2">Total Bookings</h2>
//           <p className="text-3xl font-bold text-gray-700">125</p>
//         </motion.div>

//         <motion.div
//           className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex flex-col items-center justify-center text-center"
//           variants={sectionVariants}
//         >
//           <span className="text-5xl mb-3 text-purple-500">✉️</span>
//           <h2 className="text-xl font-semibold mb-2">New Contacts</h2>
//           <p className="text-3xl font-bold text-gray-700">15</p>
//         </motion.div>

//         <motion.div
//           className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex flex-col items-center justify-center text-center"
//           variants={sectionVariants}
//         >
//           <span className="text-5xl mb-3 text-yellow-500">🗓️</span>
//           <h2 className="text-xl font-semibold mb-2">Upcoming Events</h2>
//           <p className="text-3xl font-bold text-gray-700">7</p>
//         </motion.div>
//       </motion.div>

//       {showCalendar ? (
//         <motion.div
//           className="mt-10 px-4 sm:px-6"
//           initial={{ opacity: 0, y: 50 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.3 }}
//         >
//           <FullCalendar
//             plugins={[dayGridPlugin]}
//             initialView="dayGridMonth"
//             events={events}
//             height="auto"
//           />
//         </motion.div>
//       ) : (
//         <motion.div
//           className="text-center p-8 mt-10 mx-4 sm:mx-6 bg-blue-100 rounded-xl shadow-md text-blue-800 font-semibold"
//           initial={{ opacity: 0, scale: 0.8 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.5, delay: 0.1 }}
//         >
//           <p>
//             Calendar view is optimized for wider screens. Please widen your
//             browser or use a desktop device.
//           </p>
//         </motion.div>
//       )}
//     </>
//   );
// };

// export default DashboardHome;
