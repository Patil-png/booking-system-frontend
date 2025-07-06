
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';

const AdminBlockedDates = ({ type = 'Room' }) => {
  const [blockedList, setBlockedList] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // <-- Required for navigation

  const fetchBlockedDates = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/blocked-dates?type=${type}`);
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
      const res = await fetch('http://localhost:5000/api/blocked-dates', {
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
      const res = await fetch(`http://localhost:5000/api/blocked-dates/${id}`, {
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
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-xl animate-fade-in-down transition-all duration-500 ease-in-out md:p-10">
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


      <h2 className="text-2xl font-bold mb-4 text-center text-green-600">
        Manage Blocked Dates for {type}
      </h2>

      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          excludeDates={blockedList.map(item => new Date(item.date))}
          placeholderText="Select booking date"
          minDate={new Date()}
          className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transform transition-transform duration-200 hover:scale-105"
        />
        <button
          onClick={blockDate}
          disabled={loading || !selectedDate}
          className={`px-4 py-2 rounded-lg text-white transition-all duration-300 transform hover:scale-105 ${
            loading || !selectedDate
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-500 hover:bg-green-600 active:scale-95'
          }`}
        >
          {loading ? 'Blocking...' : 'Block Date'}
        </button>
      </div>

      <h4 className="text-lg font-semibold mb-2">Blocked Dates:</h4>
      <ul className="space-y-3">
        {blockedList.length === 0 ? (
          <li className="text-gray-500 text-center py-4">No blocked dates yet.</li>
        ) : (
          blockedList.map((item) => (
            <li
              key={item._id}
              className="flex justify-between items-center p-3 bg-gray-50 rounded-lg shadow-sm animate-fade-in-left transition-all duration-300 ease-out transform hover:scale-[1.02]"
            >
              <span className="font-medium text-gray-700">{new Date(item.date).toDateString()}</span>
              <button
                onClick={() => unblockDate(item._id)}
                className="text-red-600 font-medium hover:underline transition-colors duration-200 hover:text-red-800"
              >
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
