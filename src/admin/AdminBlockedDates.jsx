import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const AdminBlockedDates = ({ type = 'Room' }) => {
  const [blockedList, setBlockedList] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchBlockedDates = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/blocked-dates?type=${type}`);
      if (!res.ok) throw new Error(`Server responded with status ${res.status}`);
      const data = await res.json();
      setBlockedList(data);
    } catch (err) {
      console.error('Failed to fetch blocked dates:', err);
      alert('Failed to fetch blocked dates.');
    }
  };

  const blockDate = async () => {
    if (!selectedDate) return;
    setLoading(true);
    try {
      const res = await fetch('/api/blocked-dates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, date: selectedDate }),
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
      const res = await fetch(`/api/blocked-dates/${id}`, { method: 'DELETE' });
      if (res.ok) fetchBlockedDates();
      else alert('Failed to unblock date.');
    } catch (error) {
      alert('Error deleting date: ' + error.message);
    }
  };

  useEffect(() => {
    fetchBlockedDates();
  }, [type]);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-xl animate-fade-in-down transition-all duration-500 ease-in-out md:p-10">
      <h2 className="text-2xl font-bold mb-4 text-center text-green-600">Manage Blocked Dates for {type}</h2>

      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          excludeDates={blockedList.map(item => new Date(item.date))}
          placeholderText="Select booking date"
          minDate={new Date()}
          className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <button
          onClick={blockDate}
          disabled={loading || !selectedDate}
          className={`px-4 py-2 rounded-lg text-white transition-colors ${
            loading || !selectedDate
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {loading ? 'Blocking...' : 'Block Date'}
        </button>
      </div>

      <h4 className="text-lg font-semibold mb-2">Blocked Dates:</h4>
      <ul className="space-y-2">
        {blockedList.map((item) => (
          <li key={item._id} className="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
            <span>{new Date(item.date).toDateString()}</span>
            <button
              onClick={() => unblockDate(item._id)}
              className="text-red-600 font-medium hover:underline"
            >
              Unblock
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminBlockedDates;

// import React, { useEffect, useState } from 'react';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';

// const AdminBlockedDates = ({ type = 'Room' }) => {
//   const [blockedList, setBlockedList] = useState([]); // Full blocked date objects
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [loading, setLoading] = useState(false);

// const fetchBlockedDates = async () => {
//   try {
//     const res = await fetch(`http://localhost:5000/api/blocked-dates?type=${type}`);

//     if (!res.ok) {
//       throw new Error(`Server responded with status ${res.status}`);
//     }

//     const data = await res.json();
//     setBlockedList(data);
//   } catch (err) {
//     console.error('Failed to fetch blocked dates:', err);
//     alert('Failed to fetch blocked dates.');
//   }
// };


//   const blockDate = async () => {
//     if (!selectedDate) return;
//     setLoading(true);

//     try {
//       const res = await fetch('/api/blocked-dates', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ type, date: selectedDate }),
//       });

//       if (res.ok) {
//         setSelectedDate(null);
//         await fetchBlockedDates();
//       } else {
//         const err = await res.json();
//         alert(err.error || 'Failed to block date.');
//       }
//     } catch (error) {
//       alert('Server error: ' + error.message);
//     }

//     setLoading(false);
//   };

//   const unblockDate = async (id) => {
//     try {
//       const res = await fetch(`/api/blocked-dates/${id}`, { method: 'DELETE' });
//       if (res.ok) fetchBlockedDates();
//       else alert('Failed to unblock date.');
//     } catch (error) {
//       alert('Error deleting date: ' + error.message);
//     }
//   };

//   useEffect(() => {
//     fetchBlockedDates();
//   }, [type]);

//   return (
//     <div style={{ padding: '20px', maxWidth: 500, margin: 'auto' }}>
//       <h2>Manage Blocked Dates for {type}</h2>

//       <div style={{ marginBottom: '1rem' }}>
//         <DatePicker
//   selected={selectedDate}
//   onChange={(date) => setSelectedDate(date)}
//   excludeDates={blockedList.map(item => new Date(item.date))} // ✅ correct
//   placeholderText="Select booking date"
//   minDate={new Date()}
// />
//         <button onClick={blockDate} disabled={loading || !selectedDate} style={{ marginLeft: 10 }}>
//           {loading ? 'Blocking...' : 'Block Date'}
//         </button>
//       </div>

//       <h4>Blocked Dates:</h4>
//       <ul>
//         {blockedList.map((item) => (
//           <li key={item._id}>
//             {new Date(item.date).toDateString()}
//             <button onClick={() => unblockDate(item._id)} style={{ marginLeft: 8 }}>
//               Unblock
//             </button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default AdminBlockedDates;
