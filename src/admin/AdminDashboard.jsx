import { Routes, Route, Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import DashboardHome from "./DashboardHome";
import AdminBlockedDates from "./AdminBlockedDates";
import ContactList from "./ContactList";
import AdminCustomBooking from "./AdminCustomBooking";
import AdminCustomLawnBooking from "./AdminCustomLawnBooking";
import GalleryAdmin from "./GalleryAdmin";
import AdminRoomManager from "./AdminRoomManager";



export default function AdminDashboard() {
  const location = useLocation();

  // ✅ Hide navbar for these routes
  const hideNavbarPaths = ['/admin/lawn-booking', '/admin/custom-booking'];

  const linkVariants = {
    hover: { scale: 1.05, textShadow: "0px 0px 8px rgba(255,255,255,0.7)" },
    tap: { scale: 0.95 },
  };

  const mainVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* ✅ Conditional Navbar */}
      {!hideNavbarPaths.includes(location.pathname) && (
        <motion.nav
          className="bg-gradient-to-r from-teal-500 to-green-500 p-3 sm:p-4 shadow-lg sticky top-0 z-50 flex flex-wrap justify-center sm:justify-around items-center gap-3"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 80, damping: 15, delay: 0.1 }}
        >
          {[
            { to: "/admin", label: "Dashboard" },
            { to: "/admin/blocked-dates", label: "Blocked Dates" },
            { to: "/admin/contacts", label: "Contacts" },
            { to: "/admin/gallery", label: "Gallery" },
            { to: "/admin/custom-booking", label: "Manual Booking" },
            { to: "/admin/lawn-booking", label: "Lawn Booking" },
              { to: "/admin/room-management", label: "Room Management" }, // ✅ Added
          ].map((link) => (
            <motion.div
              key={link.to}
              whileHover="hover"
              whileTap="tap"
              variants={linkVariants}
              className="px-2 py-1 rounded-md"
            >
              <Link
                to={link.to}
                className="text-white font-semibold text-sm sm:text-base hover:underline transition-all duration-200 ease-in-out block"
              >
                {link.label}
              </Link>
            </motion.div>
          ))}
        </motion.nav>
      )}

      {/* Main Content */}
      <motion.main
        className="p-4 sm:p-6 flex-grow"
        variants={mainVariants}
        initial="hidden"
        animate="visible"
        key={location.pathname}
      >
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="blocked-dates" element={<BlockedDatesPage />} />
          <Route path="contacts" element={<ContactList />} />
          <Route path="gallery" element={<GalleryAdmin />} />
          <Route path="custom-booking" element={<AdminCustomBooking />} />
          <Route path="lawn-booking" element={<AdminCustomLawnBooking />} />
          <Route path="room-management" element={<AdminRoomManager />} />
        </Routes>
      </motion.main>
    </div>
  );
}

function BlockedDatesPage() {
  const sectionVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15, duration: 0.5 },
    },
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <motion.h2
        className="text-2xl sm:text-3xl font-bold text-center text-green-700 mb-4 sm:mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Blocked Dates Management
      </motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        <motion.div
          className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200"
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
        >
          <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4 text-center">
            Room Bookings
          </h3>
          <AdminBlockedDates type="Room" />
        </motion.div>

        <motion.div
          className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200"
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4 text-center">
            Lawn Bookings
          </h3>
          <AdminBlockedDates type="Lawn" />
        </motion.div>
      </div>
    </div>
  );
}
