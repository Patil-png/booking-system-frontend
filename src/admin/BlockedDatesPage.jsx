// 📁 src/pages/admin/BlockedDatesPage.jsx
import { motion } from "framer-motion"; // Import motion for animations
import AdminBlockedDates from "./AdminBlockedDates";

export default function BlockedDatesPage() {
  // Variants for the main heading
  const headingVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  // Variants for individual blocked date sections
  const sectionVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 30 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100, // Make it a bit springier
        damping: 15,
        duration: 0.5,
      },
    },
  };

  return (
    <div className="space-y-6 sm:space-y-8 p-4 sm:p-6 lg:p-8"> {/* Adjusted padding for responsiveness */}
      <motion.h2
        className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-center mb-4 sm:mb-6 text-green-700" // Responsive font size
        variants={headingVariants}
        initial="hidden"
        animate="visible"
      >
        Blocked Dates Management
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10"> {/* Responsive grid layout and gaps */}
        <motion.div
          className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-100 transform hover:scale-[1.01] transition-transform duration-200 ease-in-out" // Enhanced styling and hover effect
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
        >
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 text-center"> {/* Responsive font size */}
            Room Bookings
          </h3>
          <AdminBlockedDates type="Room" />
        </motion.div>

        <motion.div
          className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-100 transform hover:scale-[1.01] transition-transform duration-200 ease-in-out" // Enhanced styling and hover effect
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          transition={{ ...sectionVariants.visible.transition, delay: 0.1 }} // Slight delay for the second section
        >
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 text-center"> {/* Responsive font size */}
            Lawn Bookings
          </h3>
          <AdminBlockedDates type="Lawn" />
        </motion.div>
      </div>
    </div>
  );
}


// // 📁 src/pages/admin/BlockedDatesPage.jsx
// import { motion } from "framer-motion"; // Import motion for animations
// import AdminBlockedDates from "./AdminBlockedDates";

// export default function BlockedDatesPage() {
//   // Variants for the main heading
//   const headingVariants = {
//     hidden: { opacity: 0, y: -20 },
//     visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
//   };

//   // Variants for individual blocked date sections
//   const sectionVariants = {
//     hidden: { opacity: 0, scale: 0.9, y: 30 },
//     visible: {
//       opacity: 1,
//       scale: 1,
//       y: 0,
//       transition: {
//         type: "spring",
//         stiffness: 100, // Make it a bit springier
//         damping: 15,
//         duration: 0.5,
//       },
//     },
//   };

//   return (
//     <div className="space-y-6 sm:space-y-8 p-4 sm:p-6 lg:p-8"> {/* Adjusted padding for responsiveness */}
//       <motion.h2
//         className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-center mb-4 sm:mb-6 text-green-700" // Responsive font size
//         variants={headingVariants}
//         initial="hidden"
//         animate="visible"
//       >
//         Blocked Dates Management
//       </motion.h2>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10"> {/* Responsive grid layout and gaps */}
//         <motion.div
//           className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-100 transform hover:scale-[1.01] transition-transform duration-200 ease-in-out" // Enhanced styling and hover effect
//           variants={sectionVariants}
//           initial="hidden"
//           animate="visible"
//         >
//           <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 text-center"> {/* Responsive font size */}
//             Room Bookings
//           </h3>
//           <AdminBlockedDates type="Room" />
//         </motion.div>

//         <motion.div
//           className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-100 transform hover:scale-[1.01] transition-transform duration-200 ease-in-out" // Enhanced styling and hover effect
//           variants={sectionVariants}
//           initial="hidden"
//           animate="visible"
//           transition={{ ...sectionVariants.visible.transition, delay: 0.1 }} // Slight delay for the second section
//         >
//           <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 text-center"> {/* Responsive font size */}
//             Lawn Bookings
//           </h3>
//           <AdminBlockedDates type="Lawn" />
//         </motion.div>
//       </div>
//     </div>
//   );
// }
