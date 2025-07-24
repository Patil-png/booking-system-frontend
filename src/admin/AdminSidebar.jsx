import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import logo from '../assets/logo.png';

const links = [
  { to: '/executive-assistant', label: 'Dashboard' },
  { to: '/executive-assistant/blocked-dates', label: 'Blocked Dates' },
  { to: '/executive-assistant/contacts', label: 'Contacts' },
  { to: '/executive-assistant/gallery', label: 'Gallery' },
  { to: '/executive-assistant/custom-booking', label: 'Manual Booking' },
  { to: '/executive-assistant/lawn-booking', label: 'Lawn Booking' },
  { to: '/executive-assistant/room-management', label: 'Room Management' },
];

const sidebarVariants = {
  open: {
    x: 0,
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  },
  closed: {
    x: '-100%',
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  },
};

export default function AdminSidebar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Sidebar for desktop, drawer for mobile
  return (
    <>
      {/* Hamburger for mobile */}
      <div className="lg:hidden fixed top-4 left-4 z-[100]">
        <motion.button
          onClick={() => setOpen(true)}
          className="p-2 rounded-full shadow-2xl cursor-pointer bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900 border-2 border-purple-400/40"
          aria-label="Open sidebar"
          whileTap={{ scale: 0.92, boxShadow: '0 0 0 12px #a78bfa55' }}
          whileHover={{ scale: 1.12, boxShadow: '0 0 32px 8px #a78bfa' }}
          animate={open ? { rotate: 180, background: 'linear-gradient(135deg, #18181b 60%, #a78bfa 100%)', boxShadow: '0 0 32px 8px #a78bfa' } : { rotate: 0, background: 'linear-gradient(135deg, #18181b 60%, #312e81 100%)', boxShadow: '0 0 24px 4px #312e81' }}
          transition={{ type: 'spring', stiffness: 300, damping: 18 }}
          style={{ transition: 'background 0.5s' }}
        >
          <Bars3Icon className="h-6 w-6 text-white drop-shadow-lg" />
        </motion.button>
      </div>

      {/* Overlay for mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 bg-black/40 z-[99] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {(open || window.innerWidth >= 1024) && (
          <motion.aside
            className={
              open && window.innerWidth < 1024
                ? "fixed top-0 left-0 h-full w-72 xs:w-64 sm:w-80 bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900/90 bg-opacity-90 shadow-2xl z-[100] flex flex-col pt-8 pb-4 px-4 border-l-2 border-purple-400/40 backdrop-blur-xl"
                : "hidden lg:flex lg:flex-col lg:w-64 lg:min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900/90 bg-opacity-90 shadow-2xl pt-8 pb-4 px-4 border-l-2 border-purple-400/40 backdrop-blur-xl lg:sticky lg:top-0"
            }
            initial={window.innerWidth >= 1024 ? { x: '-100%', opacity: 0 } : 'closed'}
            animate={window.innerWidth >= 1024 ? { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 180, damping: 22 } } : 'open'}
            exit={window.innerWidth >= 1024 ? { x: '-100%', opacity: 0, transition: { duration: 0.3, ease: 'easeOut' } } : 'closed'}
            variants={sidebarVariants}
            style={open && window.innerWidth < 1024 ? { zIndex: 100 } : {}}
          >
            {/* Logo and Brand for mobile */}
            {open && window.innerWidth < 1024 && (
              <div className="flex flex-row items-center justify-center gap-2 mb-4">
                <img src={logo} alt="Gouri-inn Logo" className="h-8 xs:h-10 sm:h-12 w-auto" style={{maxWidth:'60px'}} />
                <span className="text-lg xs:text-xl sm:text-2xl font-luxury font-bold text-white tracking-wide leading-tight">Gouri-inn</span>
              </div>
            )}
            {/* Close button for mobile */}
            <div className="flex flex-row items-center justify-between gap-4 mb-8 lg:hidden">
              <span className="text-white text-xl font-bold">Admin</span>
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-full bg-white/10 text-white hover:bg-white/30 focus:outline-none shadow-lg transition-all duration-200"
                aria-label="Close sidebar"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            {/* Links */}
            <nav className="flex flex-col gap-2 mt-4">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 text-white/90 hover:bg-white/10 hover:text-white text-base shadow-sm ${location.pathname === link.to ? 'bg-white/20 text-white' : ''}`}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="flex-grow" />
            {/* Optional: Add logo or footer here */}
          </motion.aside>
        )}
      </AnimatePresence>
      {/* Spacer for desktop layout is no longer needed */}
    </>
  );
} 