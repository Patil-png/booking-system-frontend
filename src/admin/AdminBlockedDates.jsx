import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { CalendarDaysIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const AdminBlockedDates = ({ type = 'Room' }) => {
  const [blockedList, setBlockedList] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // <-- Required for navigation

  const fetchBlockedDates = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/blocked-dates?type=${type}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `Server responded with status ${res.status}`);
      }
      const data = await res.json();
      setBlockedList(data);
    } catch (err) {
      console.error('Failed to fetch blocked dates:', err);
      alert('Failed to fetch blocked dates: ' + err.message);
    }
  };

  const blockDate = async () => {
    if (!selectedDate) return;
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/blocked-dates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, date: selectedDate.toISOString() }),
      });
      if (res.ok) {
        setSelectedDate(null);
        await fetchBlockedDates();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to block date.');
      }
    } catch (error) {
      alert('Server error: ' + error.message);
    }
    setLoading(false);
  };

  const unblockDate = async (id) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/blocked-dates/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) fetchBlockedDates();
      else {
        const err = await res.json();
        alert(err.error || 'Failed to unblock date.');
      }
    } catch (error) {
      alert('Error deleting date: ' + error.message);
    }
  };

  useEffect(() => {
    fetchBlockedDates();
  }, [type]);

  return (
    <div className="max-w-md mx-auto mt-8 p-4 sm:p-6 bg-gradient-to-br from-green-50 via-white to-blue-50 rounded-3xl shadow-2xl border border-green-100 animate-fade-in-down transition-all duration-500 ease-in-out">
      <style>
        {`
          @keyframes fadeInDown {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .animate-fade-in-down {
            animation: fadeInDown 0.6s ease-out forwards;
          }

          @keyframes fadeInLeft {
            from { opacity: 0; transform: translateX(-20px); }
            to { opacity: 1; transform: translateX(0); }
          }

          .animate-fade-in-left {
            animation: fadeInLeft 0.4s ease-out forwards;
          }
        `}
      </style>

      <h2 className="text-xl sm:text-2xl font-extrabold mb-4 text-center text-green-700 tracking-tight flex items-center justify-center gap-2">
        <CalendarDaysIcon className="h-6 w-6 text-green-500" />
        Manage Blocked Dates for {type}
      </h2>

      <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mb-6">
        <div className="relative w-full sm:w-auto flex-1">
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            excludeDates={blockedList.map(item => new Date(item.date))}
            placeholderText="Select booking date"
            minDate={new Date()}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 bg-white shadow-sm text-sm"
          />
          <CalendarDaysIcon className="absolute left-2 top-1/2 -translate-y-1/2 h-5 w-5 text-green-400 pointer-events-none" />
        </div>
        <button
          onClick={blockDate}
          disabled={loading || !selectedDate}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm ${
            loading || !selectedDate
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 active:scale-95'
          }`}
        >
          <CalendarDaysIcon className="h-5 w-5 text-white" />
          {loading ? 'Blocking...' : 'Block Date'}
        </button>
      </div>

      <h4 className="text-base sm:text-lg font-semibold mb-2 text-green-700">Blocked Dates</h4>
      <ul className="space-y-3">
        {blockedList.length === 0 ? (
          <li className="text-gray-400 text-center py-4 italic">No blocked dates yet.</li>
        ) : (
          blockedList.map((item) => (
            <li
              key={item._id}
              className="flex justify-between items-center p-3 bg-gradient-to-r from-green-100 via-white to-blue-100 rounded-xl shadow-md animate-fade-in-left transition-all duration-300 ease-out transform hover:scale-[1.03] border border-green-100"
            >
              <span className="flex items-center gap-2 font-medium text-gray-700">
                <CalendarDaysIcon className="h-5 w-5 text-green-500" />
                <span className="bg-green-200 text-green-800 px-2 py-0.5 rounded-lg text-xs font-semibold tracking-wide">
                  {new Date(item.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                </span>
              </span>
              <button
                onClick={() => unblockDate(item._id)}
                className="flex items-center gap-1 text-red-600 font-semibold hover:underline hover:text-red-800 transition-colors duration-200 text-xs px-2 py-1 rounded-lg hover:bg-red-50"
              >
                <XCircleIcon className="h-4 w-4" />
                Unblock
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default AdminBlockedDates;
