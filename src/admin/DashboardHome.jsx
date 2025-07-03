import React, { useEffect, useState } from 'react';
import BookingsList from './BookingsList';
import CalendarView from './CalendarView';
import StatsCharts from './StatsCharts';
import { useNavigate } from 'react-router-dom';
import Notifications from './Notifications';
import { Bell } from 'lucide-react';
import OptionsPanel from './OptionsPanel';

const DashboardHome = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('adminToken')) {
      navigate('/login');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    sessionStorage.clear();
    navigate('/login');
  };

  const handleExportAll = () => {
    const link = document.createElement('a');
    link.href = `${import.meta.env.VITE_API_BASE_URL}/api/bookings/export-all`;
    link.setAttribute('download', 'all-bookings.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const fetchBookings = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/bookings`);
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      console.error("Failed to fetch bookings", err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/notifications`);
      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  const unseenCount = notifications.filter(n => !n.seen).length;

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/bookings/${id}`, {
        method: 'DELETE',
      });
      fetchBookings();
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchNotifications();
  }, []);

  return (
    <div className="p-1 sm:p-6 max-w-7xl mx-auto animate-fade-in-down">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div
          className="relative cursor-pointer"
          onClick={() => setShowNotifications(!showNotifications)}
        >
          <Bell className="w-6 h-6 text-gray-700" />
          {unseenCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {unseenCount}
            </span>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm sm:text-base"
        >
          Logout
        </button>
      </div>

      {/* Notifications */}
      {showNotifications && (
        <div className="mb-6 bg-white p-4 rounded shadow max-h-72 overflow-y-auto">
          <Notifications />
        </div>
      )}

      {/* Stats Charts */}
      <div className="mb-6 bg-white p-4 sm:p-6 rounded-xl shadow-md overflow-x-auto">
        <StatsCharts />
      </div>

      {/* Options Panel */}
      <div className="mb-6 bg-white p-4 sm:p-6 rounded-xl shadow-md overflow-x-auto">
        <OptionsPanel />
      </div>

      {/* Calendar View */}
      <div className="mb-6 bg-white p-4 sm:p-6 rounded-xl shadow-md overflow-x-auto">
        <CalendarView />
      </div>

      {/* Bookings List */}
      <div className="mb-6 bg-white p-4 sm:p-6 rounded-xl shadow-md overflow-x-auto">
        <BookingsList bookings={bookings} onDelete={handleDelete} />
      </div>

      {/* Export Button */}
      <div className="flex justify-center">
        <button
          onClick={handleExportAll}
          className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-teal-500 to-green-500 text-white font-semibold rounded-lg shadow hover:scale-105 transition-transform duration-300 text-sm sm:text-base"
        >
          Export All Bookings (Room + Lawn)
        </button>
      </div>
    </div>
  );
};

export default DashboardHome;
