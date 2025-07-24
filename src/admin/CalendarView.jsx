import React, { useEffect, useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, parse, startOfWeek, getDay, isWithinInterval } from 'date-fns';
import { fetchBookings, fetchBlockedDates, addBlockedDate } from '../utils/api';
import enUS from 'date-fns/locale/en-US';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarDaysIcon,
  FunnelIcon,
  ClockIcon,
  BuildingOfficeIcon,
  HomeIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlusCircleIcon,
  MagnifyingGlassIcon,
  Squares2X2Icon,
  ListBulletIcon,
} from '@heroicons/react/24/solid';

const locales = { 'en-US': enUS };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const CalendarView = () => {
  const [allBookings, setAllBookings] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [typeFilter, setTypeFilter] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [blockedEvents, setBlocked] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);
  const [showAlert, setShowAlert] = useState(false);

  const showAlertMessage = (message, type) => {
    setAlertMessage({ message, type });
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  useEffect(() => {
    setLoading(true);
    fetchBookings().then(bookings => {
      const mapped = bookings.map(b => ({
        title: `${b.type} - ₹${b.amount}`,
        start: new Date(b.checkIn),
        end: new Date(b.checkOut || b.checkIn), // Ensure end date is handled if missing
        allDay: true,
        resource: b, // Keep original booking data in resource
      }));
      setAllBookings(mapped);
      setFilteredEvents(mapped);
    }).catch(error => {
      console.error("Error fetching bookings:", error);
      setError("Failed to load bookings");
      showAlertMessage("Failed to load bookings", "error");
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchBlockedDates().then(setBlocked).catch(error => {
      console.error("Error fetching blocked dates:", error);
      showAlertMessage("Failed to load blocked dates", "error");
    });
  }, []);

  useEffect(() => {
    let filtered = allBookings;
    if (typeFilter !== 'All') {
      filtered = filtered.filter(event => event.resource.type === typeFilter);
    }
    if (startDate && endDate) {
      const sDate = new Date(startDate);
      const eDate = new Date(endDate);
      // Filter events that fall within the selected date range
      filtered = filtered.filter(event =>
        (new Date(event.start) >= sDate && new Date(event.start) <= eDate) ||
        (new Date(event.end) >= sDate && new Date(event.end) <= eDate) ||
        (new Date(event.start) <= sDate && new Date(event.end) >= eDate)
      );
    }
    setFilteredEvents(filtered);
  }, [typeFilter, startDate, endDate, allBookings]);

  const handleBlockDate = async (slotInfo) => {
    const date = slotInfo.start;
    const type = prompt('Block for Room or Lawn? (Type "Room" or "Lawn")');
    if (!type || !['Room', 'Lawn'].includes(type.trim())) {
      showAlertMessage('Invalid type. Please type "Room" or "Lawn".', 'error');
      return;
    }
    const reason = prompt('Reason (optional)');
    
    try {
      await addBlockedDate({ date, type: type.trim(), reason });
      showAlertMessage('Date blocked successfully!', 'success');
      fetchBlockedDates().then(setBlocked); // Re-fetch blocked dates to update calendar
    } catch (error) {
      console.error("Error adding blocked date:", error);
      showAlertMessage('Failed to block date. Please try again.', 'error');
    }
  };

  // Custom event styles for react-big-calendar
  const eventPropGetter = (event) => {
    let backgroundColor = '';
    let textColor = 'white';

    // Check if it's a blocked event
    if (event.resource?.blocked) {
      backgroundColor = '#EF4444'; // Tailwind red-500
      textColor = 'white';
    } else {
      // Regular booking events
      switch (event.resource?.type) {
        case 'Room':
          backgroundColor = '#3B82F6'; // Tailwind blue-500
          break;
        case 'Lawn':
          backgroundColor = '#F59E0B'; // Tailwind orange-500
          break;
        default:
          backgroundColor = '#6B7280'; // Tailwind gray-500 (fallback)
      }
    }

    return {
      style: {
        backgroundColor: backgroundColor,
        color: textColor,
        borderRadius: '4px',
        border: 'none',
        padding: '2px 4px', // Slight padding for better visual
        fontSize: '0.75rem', // text-xs
      },
    };
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex justify-center items-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <CalendarDaysIcon className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <p className="mt-4 text-lg font-medium text-gray-600">Loading calendar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-6 px-4 sm:px-6 lg:px-8">
      {/* Alert System */}
      <AnimatePresence>
        {showAlert && alertMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className={`fixed top-2 left-2 right-2 sm:top-6 sm:right-6 sm:left-auto z-50 p-2 sm:p-5 rounded-2xl shadow-2xl flex items-center space-x-2 sm:space-x-4 backdrop-blur-md border-2 max-w-md mx-auto sm:mx-0 text-xs sm:text-base ${
              alertMessage.type === "success"
                ? "bg-emerald-500/90 text-white border-emerald-300"
                : "bg-red-500/90 text-white border-red-300"
            }`}
          >
            <div className="flex-shrink-0">
              {alertMessage.type === "success" ? (
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <CheckCircleIcon className="h-5 w-5" />
                </div>
              ) : (
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <XCircleIcon className="h-5 w-5" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm sm:text-base">{alertMessage.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="max-w-7xl mx-auto text-xs sm:text-base"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div
          className="text-center mb-4 sm:mb-12"
          variants={itemVariants}
        >
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl mb-3 sm:mb-6 shadow-xl">
            <CalendarDaysIcon className="w-6 h-6 sm:w-10 sm:h-10 text-white" />
          </div>
          <h1 className="text-lg sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2 sm:mb-4">
            Booking Calendar Overview
          </h1>
          <p className="text-xs sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Manage your bookings and blocked dates with our interactive calendar
          </p>
        </motion.div>

        {/* Main Content Card */}
        <motion.div
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20 text-xs sm:text-base"
          variants={itemVariants}
        >
          {/* Filters Section */}
          <div className="p-3 sm:p-8 bg-gradient-to-r from-blue-600 to-indigo-700">
            <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-6">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <FunnelIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <h2 className="text-base sm:text-2xl font-bold text-white">Filter & Search</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-6">
              {/* Type Filter */}
              <div className="space-y-1 sm:space-y-2">
                <label className="block text-xs sm:text-sm font-semibold text-blue-100 flex items-center space-x-2">
                  <Squares2X2Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Filter by Type</span>
                </label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full px-2 sm:px-4 py-2 sm:py-3 border-2 border-white/20 rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder-blue-200 focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-300 text-xs sm:text-base"
                >
                  <option value="All" className="text-gray-900">All Bookings</option>
                  <option value="Room" className="text-gray-900">Room Bookings</option>
                  <option value="Lawn" className="text-gray-900">Lawn Bookings</option>
                </select>
              </div>

              {/* Start Date */}
              <div className="space-y-1 sm:space-y-2">
                <label className="block text-xs sm:text-sm font-semibold text-blue-100 flex items-center space-x-2">
                  <ClockIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>From Date</span>
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-2 sm:px-4 py-2 sm:py-3 border-2 border-white/20 rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder-blue-200 focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-300 text-xs sm:text-base [color-scheme:dark]"
                />
              </div>

              {/* End Date */}
              <div className="space-y-1 sm:space-y-2">
                <label className="block text-xs sm:text-sm font-semibold text-blue-100 flex items-center space-x-2">
                  <CalendarDaysIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>To Date</span>
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-2 sm:px-4 py-2 sm:py-3 border-2 border-white/20 rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder-blue-200 focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-300 text-xs sm:text-base [color-scheme:dark]"
                />
              </div>
            </div>

            {/* Legend */}
            <div className="mt-3 sm:mt-6 pt-3 sm:pt-6 border-t border-white/20">
              <h3 className="text-xs sm:text-sm font-semibold text-blue-100 mb-2 sm:mb-3 flex items-center space-x-2">
                <ListBulletIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Calendar Legend</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded"></div>
                  <span className="text-xs sm:text-sm text-blue-100">Room Bookings</span>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-orange-500 rounded"></div>
                  <span className="text-xs sm:text-sm text-blue-100">Lawn Bookings</span>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded"></div>
                  <span className="text-xs sm:text-sm text-blue-100">Blocked Dates</span>
                </div>
              </div>
            </div>
          </div>

          {/* Calendar Section */}
          <div className="p-2 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <CalendarDaysIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <h3 className="text-base sm:text-2xl font-bold text-gray-800">Interactive Calendar</h3>
              </div>
              <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
                <PlusCircleIcon className="w-4 h-4 text-blue-500" />
                <span>Click any date to block it</span>
              </div>
            </div>

            {/* Mobile Instructions */}
            <div className="sm:hidden mb-2 p-2 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex items-center space-x-1 text-xs text-blue-700">
                <PlusCircleIcon className="w-3 h-3" />
                <span>Tap any date to block it for booking</span>
              </div>
            </div>

            {/* Calendar Container */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 text-xs sm:text-base">
              <div className="calendar-container" style={{ height: '400px', minHeight: '300px' }}>
                <Calendar
                  localizer={localizer}
                  events={[...filteredEvents, ...blockedEvents]}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: '100%' }}
                  selectable
                  onSelectSlot={handleBlockDate}
                  eventPropGetter={eventPropGetter}
                  views={['month', 'week', 'day']}
                  defaultView="month"
                  popup
                  showMultiDayTimes
                  step={60}
                  showAllEvents
                  components={{
                    toolbar: (props) => (
                      <div className="rbc-toolbar bg-gradient-to-r from-gray-50 to-blue-50 p-2 sm:p-4 border-b border-gray-200 text-xs sm:text-base">
                        <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
                          <div className="flex items-center space-x-1 sm:space-x-2">
                            <motion.button
                              onClick={() => props.onNavigate('PREV')}
                              className="px-2 sm:px-3 py-1 sm:py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-xs sm:text-sm font-medium"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              ←
                            </motion.button>
                            <motion.button
                              onClick={() => props.onNavigate('TODAY')}
                              className="px-2 sm:px-4 py-1 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-xs sm:text-sm font-medium"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Today
                            </motion.button>
                            <motion.button
                              onClick={() => props.onNavigate('NEXT')}
                              className="px-2 sm:px-3 py-1 sm:py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-xs sm:text-sm font-medium"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              →
                            </motion.button>
                          </div>
                          <div className="text-xs sm:text-xl font-bold text-gray-800">
                            {props.label}
                          </div>
                          <div className="flex items-center space-x-1 sm:space-x-2">
                            {['month', 'week', 'day'].map((view) => (
                              <motion.button
                                key={view}
                                onClick={() => props.onView(view)}
                                className={`px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                                  props.view === view
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                {view.charAt(0).toUpperCase() + view.slice(1)}
                              </motion.button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ),
                  }}
                />
              </div>
            </div>

            {/* Summary Stats */}
            <div className="mt-3 sm:mt-6 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-2 sm:p-4 rounded-xl border border-blue-200">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <BuildingOfficeIcon className="w-5 h-5 sm:w-8 sm:h-8 text-blue-600" />
                  <div>
                    <div className="text-base sm:text-2xl font-bold text-blue-700">
                      {filteredEvents.filter(e => e.resource?.type === 'Room').length}
                    </div>
                    <div className="text-xs sm:text-sm text-blue-600">Room Bookings</div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-2 sm:p-4 rounded-xl border border-orange-200">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <HomeIcon className="w-5 h-5 sm:w-8 sm:h-8 text-orange-600" />
                  <div>
                    <div className="text-base sm:text-2xl font-bold text-orange-700">
                      {filteredEvents.filter(e => e.resource?.type === 'Lawn').length}
                    </div>
                    <div className="text-xs sm:text-sm text-orange-600">Lawn Bookings</div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-red-50 to-red-100 p-2 sm:p-4 rounded-xl border border-red-200">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <ExclamationTriangleIcon className="w-5 h-5 sm:w-8 sm:h-8 text-red-600" />
                  <div>
                    <div className="text-base sm:text-2xl font-bold text-red-700">
                      {blockedEvents.length}
                    </div>
                    <div className="text-xs sm:text-sm text-red-600">Blocked Dates</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Custom Calendar Styles */}
      <style>{`
        .calendar-container .rbc-calendar {
          font-family: inherit;
        }
        
        .calendar-container .rbc-event {
          border-radius: 8px;
          font-weight: 500;
          font-size: 0.75rem;
          padding: 2px 6px;
          border: none;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
        }
        
        .calendar-container .rbc-day-bg:hover {
          background-color: rgba(59, 130, 246, 0.05);
        }
        
        .calendar-container .rbc-selected {
          background-color: rgba(59, 130, 246, 0.1);
        }
        
        .calendar-container .rbc-today {
          background-color: rgba(59, 130, 246, 0.05);
        }
        
        .calendar-container .rbc-month-view,
        .calendar-container .rbc-time-view {
          border: none;
        }
        
        .calendar-container .rbc-header {
          background-color: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
          padding: 12px 8px;
          font-weight: 600;
          color: #475569;
        }
        
        @media (max-width: 640px) {
          .calendar-container .rbc-toolbar {
            flex-direction: column;
            gap: 12px;
          }
          
          .calendar-container .rbc-toolbar-label {
            font-size: 1rem;
          }
          
          .calendar-container .rbc-event {
            font-size: 0.6rem;
            padding: 1px 3px;
          }
        }
      `}</style>
    </div>
  );
};

export default CalendarView;


// import React, { useEffect, useState } from 'react';
// import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
// import 'react-big-calendar/lib/css/react-big-calendar.css';
// import { format, parse, startOfWeek, getDay, isWithinInterval } from 'date-fns';
// import { fetchBookings, fetchBlockedDates, addBlockedDate } from '../utils/api';
// import enUS from 'date-fns/locale/en-US';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//   CalendarDaysIcon,
//   FunnelIcon,
//   ClockIcon,
//   BuildingOfficeIcon,
//   HomeIcon,
//   ExclamationTriangleIcon,
//   CheckCircleIcon,
//   XCircleIcon,
//   PlusCircleIcon,
//   MagnifyingGlassIcon,
//   Squares2X2Icon,
//   ListBulletIcon,
// } from '@heroicons/react/24/solid';

// const locales = { 'en-US': enUS };

// const localizer = dateFnsLocalizer({
//   format,
//   parse,
//   startOfWeek,
//   getDay,
//   locales,
// });

// const CalendarView = () => {
//   const [allBookings, setAllBookings] = useState([]);
//   const [filteredEvents, setFilteredEvents] = useState([]);
//   const [typeFilter, setTypeFilter] = useState('All');
//   const [startDate, setStartDate] = useState('');
//   const [endDate, setEndDate] = useState('');
//   const [blockedEvents, setBlocked] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [alertMessage, setAlertMessage] = useState(null);
//   const [showAlert, setShowAlert] = useState(false);

//   const showAlertMessage = (message, type) => {
//     setAlertMessage({ message, type });
//     setShowAlert(true);
//     setTimeout(() => setShowAlert(false), 3000);
//   };

//   useEffect(() => {
//     setLoading(true);
//     fetchBookings().then(bookings => {
//       const mapped = bookings.map(b => ({
//         title: `${b.type} - ₹${b.amount}`,
//         start: new Date(b.checkIn),
//         end: new Date(b.checkOut || b.checkIn), // Ensure end date is handled if missing
//         allDay: true,
//         resource: b, // Keep original booking data in resource
//       }));
//       setAllBookings(mapped);
//       setFilteredEvents(mapped);
//     }).catch(error => {
//       console.error("Error fetching bookings:", error);
//       setError("Failed to load bookings");
//       showAlertMessage("Failed to load bookings", "error");
//     }).finally(() => setLoading(false));
//   }, []);

//   useEffect(() => {
//     fetchBlockedDates().then(setBlocked).catch(error => {
//       console.error("Error fetching blocked dates:", error);
//       showAlertMessage("Failed to load blocked dates", "error");
//     });
//   }, []);

//   useEffect(() => {
//     let filtered = allBookings;
//     if (typeFilter !== 'All') {
//       filtered = filtered.filter(event => event.resource.type === typeFilter);
//     }
//     if (startDate && endDate) {
//       const sDate = new Date(startDate);
//       const eDate = new Date(endDate);
//       // Filter events that fall within the selected date range
//       filtered = filtered.filter(event =>
//         (new Date(event.start) >= sDate && new Date(event.start) <= eDate) ||
//         (new Date(event.end) >= sDate && new Date(event.end) <= eDate) ||
//         (new Date(event.start) <= sDate && new Date(event.end) >= eDate)
//       );
//     }
//     setFilteredEvents(filtered);
//   }, [typeFilter, startDate, endDate, allBookings]);

//   const handleBlockDate = async (slotInfo) => {
//     const date = slotInfo.start;
//     const type = prompt('Block for Room or Lawn? (Type "Room" or "Lawn")');
//     if (!type || !['Room', 'Lawn'].includes(type.trim())) {
//       showAlertMessage('Invalid type. Please type "Room" or "Lawn".', 'error');
//       return;
//     }
//     const reason = prompt('Reason (optional)');
    
//     try {
//       await addBlockedDate({ date, type: type.trim(), reason });
//       showAlertMessage('Date blocked successfully!', 'success');
//       fetchBlockedDates().then(setBlocked); // Re-fetch blocked dates to update calendar
//     } catch (error) {
//       console.error("Error adding blocked date:", error);
//       showAlertMessage('Failed to block date. Please try again.', 'error');
//     }
//   };

//   // Custom event styles for react-big-calendar
//   const eventPropGetter = (event) => {
//     let backgroundColor = '';
//     let textColor = 'white';

//     // Check if it's a blocked event
//     if (event.resource?.blocked) {
//       backgroundColor = '#EF4444'; // Tailwind red-500
//       textColor = 'white';
//     } else {
//       // Regular booking events
//       switch (event.resource?.type) {
//         case 'Room':
//           backgroundColor = '#3B82F6'; // Tailwind blue-500
//           break;
//         case 'Lawn':
//           backgroundColor = '#F59E0B'; // Tailwind orange-500
//           break;
//         default:
//           backgroundColor = '#6B7280'; // Tailwind gray-500 (fallback)
//       }
//     }

//     return {
//       style: {
//         backgroundColor: backgroundColor,
//         color: textColor,
//         borderRadius: '4px',
//         border: 'none',
//         padding: '2px 4px', // Slight padding for better visual
//         fontSize: '0.75rem', // text-xs
//       },
//     };
//   };

//   const containerVariants = {
//     hidden: { opacity: 0, y: 50 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         duration: 0.8,
//         ease: [0.25, 0.46, 0.45, 0.94],
//         when: "beforeChildren",
//         staggerChildren: 0.1
//       }
//     }
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, y: 20, scale: 0.95 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       scale: 1,
//       transition: {
//         duration: 0.6,
//         ease: [0.25, 0.46, 0.45, 0.94]
//       }
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex justify-center items-center">
//         <div className="text-center">
//           <div className="relative">
//             <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
//             <div className="absolute inset-0 flex items-center justify-center">
//               <CalendarDaysIcon className="w-8 h-8 text-blue-600" />
//             </div>
//           </div>
//           <p className="mt-4 text-lg font-medium text-gray-600">Loading calendar...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-6 px-4 sm:px-6 lg:px-8">
//       {/* Alert System */}
//       <AnimatePresence>
//         {showAlert && alertMessage && (
//           <motion.div
//             initial={{ opacity: 0, y: -50, scale: 0.95 }}
//             animate={{ opacity: 1, y: 0, scale: 1 }}
//             exit={{ opacity: 0, y: -50, scale: 0.95 }}
//             transition={{ duration: 0.3 }}
//             className={`fixed top-4 left-4 right-4 sm:top-6 sm:right-6 sm:left-auto z-50 p-4 sm:p-5 rounded-2xl shadow-2xl flex items-center space-x-3 sm:space-x-4 backdrop-blur-md border-2 max-w-md mx-auto sm:mx-0 ${
//               alertMessage.type === "success"
//                 ? "bg-emerald-500/90 text-white border-emerald-300"
//                 : "bg-red-500/90 text-white border-red-300"
//             }`}
//           >
//             <div className="flex-shrink-0">
//               {alertMessage.type === "success" ? (
//                 <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
//                   <CheckCircleIcon className="h-5 w-5" />
//                 </div>
//               ) : (
//                 <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
//                   <XCircleIcon className="h-5 w-5" />
//                 </div>
//               )}
//             </div>
//             <div className="flex-1">
//               <p className="font-semibold text-sm sm:text-base">{alertMessage.message}</p>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       <motion.div
//         className="max-w-7xl mx-auto"
//         variants={containerVariants}
//         initial="hidden"
//         animate="visible"
//       >
//         {/* Header */}
//         <motion.div
//           className="text-center mb-8 sm:mb-12"
//           variants={itemVariants}
//         >
//           <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl mb-6 shadow-xl">
//             <CalendarDaysIcon className="w-10 h-10 text-white" />
//           </div>
//           <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
//             Booking Calendar Overview
//           </h1>
//           <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
//             Manage your bookings and blocked dates with our interactive calendar
//           </p>
//         </motion.div>

//         {/* Main Content Card */}
//         <motion.div
//           className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20"
//           variants={itemVariants}
//         >
//           {/* Filters Section */}
//           <div className="p-6 sm:p-8 bg-gradient-to-r from-blue-600 to-indigo-700">
//             <div className="flex items-center space-x-3 mb-6">
//               <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
//                 <FunnelIcon className="w-5 h-5 text-white" />
//               </div>
//               <h2 className="text-xl sm:text-2xl font-bold text-white">Filter & Search</h2>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
//               {/* Type Filter */}
//               <div className="space-y-2">
//                 <label className="block text-sm font-semibold text-blue-100 flex items-center space-x-2">
//                   <Squares2X2Icon className="w-4 h-4" />
//                   <span>Filter by Type</span>
//                 </label>
//                 <select
//                   value={typeFilter}
//                   onChange={(e) => setTypeFilter(e.target.value)}
//                   className="w-full px-4 py-3 border-2 border-white/20 rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder-blue-200 focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-300 text-base"
//                 >
//                   <option value="All" className="text-gray-900">All Bookings</option>
//                   <option value="Room" className="text-gray-900">Room Bookings</option>
//                   <option value="Lawn" className="text-gray-900">Lawn Bookings</option>
//                 </select>
//               </div>

//               {/* Start Date */}
//               <div className="space-y-2">
//                 <label className="block text-sm font-semibold text-blue-100 flex items-center space-x-2">
//                   <ClockIcon className="w-4 h-4" />
//                   <span>From Date</span>
//                 </label>
//                 <input
//                   type="date"
//                   value={startDate}
//                   onChange={(e) => setStartDate(e.target.value)}
//                   className="w-full px-4 py-3 border-2 border-white/20 rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder-blue-200 focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-300 text-base [color-scheme:dark]"
//                 />
//               </div>

//               {/* End Date */}
//               <div className="space-y-2">
//                 <label className="block text-sm font-semibold text-blue-100 flex items-center space-x-2">
//                   <CalendarDaysIcon className="w-4 h-4" />
//                   <span>To Date</span>
//                 </label>
//                 <input
//                   type="date"
//                   value={endDate}
//                   onChange={(e) => setEndDate(e.target.value)}
//                   className="w-full px-4 py-3 border-2 border-white/20 rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder-blue-200 focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-300 text-base [color-scheme:dark]"
//                 />
//               </div>
//             </div>

//             {/* Legend */}
//             <div className="mt-6 pt-6 border-t border-white/20">
//               <h3 className="text-sm font-semibold text-blue-100 mb-3 flex items-center space-x-2">
//                 <ListBulletIcon className="w-4 h-4" />
//                 <span>Calendar Legend</span>
//               </h3>
//               <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
//                 <div className="flex items-center space-x-3">
//                   <div className="w-4 h-4 bg-blue-500 rounded"></div>
//                   <span className="text-sm text-blue-100">Room Bookings</span>
//                 </div>
//                 <div className="flex items-center space-x-3">
//                   <div className="w-4 h-4 bg-orange-500 rounded"></div>
//                   <span className="text-sm text-blue-100">Lawn Bookings</span>
//                 </div>
//                 <div className="flex items-center space-x-3">
//                   <div className="w-4 h-4 bg-red-500 rounded"></div>
//                   <span className="text-sm text-blue-100">Blocked Dates</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Calendar Section */}
//           <div className="p-6 sm:p-8">
//             <div className="flex items-center justify-between mb-6">
//               <div className="flex items-center space-x-3">
//                 <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
//                   <CalendarDaysIcon className="w-5 h-5 text-white" />
//                 </div>
//                 <h3 className="text-xl sm:text-2xl font-bold text-gray-800">Interactive Calendar</h3>
//               </div>
//               <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
//                 <PlusCircleIcon className="w-4 h-4 text-blue-500" />
//                 <span>Click any date to block it</span>
//               </div>
//             </div>

//             {/* Mobile Instructions */}
//             <div className="sm:hidden mb-4 p-3 bg-blue-50 rounded-xl border border-blue-200">
//               <div className="flex items-center space-x-2 text-sm text-blue-700">
//                 <PlusCircleIcon className="w-4 h-4" />
//                 <span>Tap any date to block it for booking</span>
//               </div>
//             </div>

//             {/* Calendar Container */}
//             <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
//               <div className="calendar-container" style={{ height: '600px' }}>
//                 <Calendar
//                   localizer={localizer}
//                   events={[...filteredEvents, ...blockedEvents]}
//                   startAccessor="start"
//                   endAccessor="end"
//                   style={{ height: '100%' }}
//                   selectable
//                   onSelectSlot={handleBlockDate}
//                   eventPropGetter={eventPropGetter}
//                   views={['month', 'week', 'day']}
//                   defaultView="month"
//                   popup
//                   showMultiDayTimes
//                   step={60}
//                   showAllEvents
//                   components={{
//                     toolbar: (props) => (
//                       <div className="rbc-toolbar bg-gradient-to-r from-gray-50 to-blue-50 p-4 border-b border-gray-200">
//                         <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
//                           <div className="flex items-center space-x-2">
//                             <motion.button
//                               onClick={() => props.onNavigate('PREV')}
//                               className="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm font-medium"
//                               whileHover={{ scale: 1.05 }}
//                               whileTap={{ scale: 0.95 }}
//                             >
//                               ←
//                             </motion.button>
//                             <motion.button
//                               onClick={() => props.onNavigate('TODAY')}
//                               className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
//                               whileHover={{ scale: 1.05 }}
//                               whileTap={{ scale: 0.95 }}
//                             >
//                               Today
//                             </motion.button>
//                             <motion.button
//                               onClick={() => props.onNavigate('NEXT')}
//                               className="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm font-medium"
//                               whileHover={{ scale: 1.05 }}
//                               whileTap={{ scale: 0.95 }}
//                             >
//                               →
//                             </motion.button>
//                           </div>
                          
//                           <div className="text-lg sm:text-xl font-bold text-gray-800">
//                             {props.label}
//                           </div>
                          
//                           <div className="flex items-center space-x-2">
//                             {['month', 'week', 'day'].map((view) => (
//                               <motion.button
//                                 key={view}
//                                 onClick={() => props.onView(view)}
//                                 className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
//                                   props.view === view
//                                     ? 'bg-blue-600 text-white shadow-md'
//                                     : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
//                                 }`}
//                                 whileHover={{ scale: 1.05 }}
//                                 whileTap={{ scale: 0.95 }}
//                               >
//                                 {view.charAt(0).toUpperCase() + view.slice(1)}
//                               </motion.button>
//                             ))}
//                           </div>
//                         </div>
//                       </div>
//                     ),
//                   }}
//                 />
//               </div>
//             </div>

//             {/* Summary Stats */}
//             <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
//               <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
//                 <div className="flex items-center space-x-3">
//                   <BuildingOfficeIcon className="w-8 h-8 text-blue-600" />
//                   <div>
//                     <div className="text-2xl font-bold text-blue-700">
//                       {filteredEvents.filter(e => e.resource?.type === 'Room').length}
//                     </div>
//                     <div className="text-sm text-blue-600">Room Bookings</div>
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200">
//                 <div className="flex items-center space-x-3">
//                   <HomeIcon className="w-8 h-8 text-orange-600" />
//                   <div>
//                     <div className="text-2xl font-bold text-orange-700">
//                       {filteredEvents.filter(e => e.resource?.type === 'Lawn').length}
//                     </div>
//                     <div className="text-sm text-orange-600">Lawn Bookings</div>
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-xl border border-red-200">
//                 <div className="flex items-center space-x-3">
//                   <ExclamationTriangleIcon className="w-8 h-8 text-red-600" />
//                   <div>
//                     <div className="text-2xl font-bold text-red-700">
//                       {blockedEvents.length}
//                     </div>
//                     <div className="text-sm text-red-600">Blocked Dates</div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </motion.div>
//       </motion.div>

//       {/* Custom Calendar Styles */}
//       <style jsx>{`
//         .calendar-container .rbc-calendar {
//           font-family: inherit;
//         }
        
//         .calendar-container .rbc-event {
//           border-radius: 8px;
//           font-weight: 500;
//           font-size: 0.75rem;
//           padding: 2px 6px;
//           border: none;
//           box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
//         }
        
//         .calendar-container .rbc-day-bg:hover {
//           background-color: rgba(59, 130, 246, 0.05);
//         }
        
//         .calendar-container .rbc-selected {
//           background-color: rgba(59, 130, 246, 0.1);
//         }
        
//         .calendar-container .rbc-today {
//           background-color: rgba(59, 130, 246, 0.05);
//         }
        
//         .calendar-container .rbc-month-view,
//         .calendar-container .rbc-time-view {
//           border: none;
//         }
        
//         .calendar-container .rbc-header {
//           background-color: #f8fafc;
//           border-bottom: 1px solid #e2e8f0;
//           padding: 12px 8px;
//           font-weight: 600;
//           color: #475569;
//         }
        
//         @media (max-width: 640px) {
//           .calendar-container .rbc-toolbar {
//             flex-direction: column;
//             gap: 12px;
//           }
          
//           .calendar-container .rbc-toolbar-label {
//             font-size: 1rem;
//           }
          
//           .calendar-container .rbc-event {
//             font-size: 0.6rem;
//             padding: 1px 3px;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default CalendarView;
