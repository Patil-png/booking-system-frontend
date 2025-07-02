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
    link.href = 'http://localhost:5000/api/bookings/export-all';
    link.setAttribute('download', 'all-bookings.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const fetchBookings = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/bookings');
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      console.error("Failed to fetch bookings", err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/notifications');
      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  const unseenCount = notifications.filter(n => !n.seen).length;

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      await fetch(`http://localhost:5000/api/bookings/${id}`, {
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
    <div className="p-6 max-w-7xl mx-auto animate-fade-in-down">
      <div className="flex justify-between items-center mb-6">
        <div className="relative cursor-pointer" onClick={() => setShowNotifications(!showNotifications)}>
          <Bell className="w-6 h-6 text-gray-700" />
          {unseenCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {unseenCount}
            </span>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      {showNotifications && (
        <div className="mb-6 bg-white p-4 rounded shadow">
          <Notifications />
        </div>
      )}

      <div className="mb-10 bg-white p-6 rounded-xl shadow-md">
        <StatsCharts />
      </div>

      <div className="mb-10 bg-white p-6 rounded-xl shadow-md">
      <OptionsPanel />
      </div>

      <div className="mb-10 bg-white p-6 rounded-xl shadow-md">
        <CalendarView />
      </div>

      <div className="mb-10 bg-white p-6 rounded-xl shadow-md">
        <BookingsList bookings={bookings} onDelete={handleDelete} />
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleExportAll}
          className="px-6 py-3 bg-gradient-to-r from-teal-500 to-green-500 text-white font-semibold rounded-lg shadow hover:scale-105 transition-transform duration-300"
        >
          Export All Bookings (Room + Lawn)
        </button>
      </div>
    </div>
  );
};

export default DashboardHome;


// import React, { useEffect, useState } from 'react';
// import BookingsList from './BookingsList';
// import CalendarView from './CalendarView';
// import StatsCharts from './StatsCharts';
// import { useNavigate } from 'react-router-dom';
// import Notifications from './Notifications';

// const DashboardHome = () => {
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!localStorage.getItem('adminToken')) {
//       navigate('/login');
//     }
//   }, []);

// const handleLogout = () => {
//   localStorage.removeItem('adminToken');
//   sessionStorage.clear();
//   navigate('/login'); 
// };


//   const [bookings, setBookings] = useState([]);

//   const handleExportAll = () => {
//     const link = document.createElement('a');
//     link.href = 'http://localhost:5000/api/bookings/export-all';
//     link.setAttribute('download', 'all-bookings.csv');
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const fetchBookings = async () => {
//     try {
//       const res = await fetch('http://localhost:5000/api/bookings');
//       const data = await res.json();
//       setBookings(data);
//     } catch (err) {
//       console.error("Failed to fetch bookings", err);
//     }
//   };

//   const handleDelete = async (id) => {
//   if (window.confirm('Are you sure you want to delete this booking?')) {
//     await fetch(`http://localhost:5000/api/bookings/${id}`, {
//       method: 'DELETE',
//     });
//     fetchBookings(); // Refresh list
//   }
// };

//   useEffect(() => {
//     fetchBookings();
//   }, []);

//   return (
    
//     <div className="p-6 max-w-7xl mx-auto animate-fade-in-down">
//       <div className="flex justify-end mb-6">
//   <button
//     onClick={handleLogout}
//     className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
//   >
//     Logout
//   </button>
// </div>


//       <div className="mb-10 bg-white p-6 rounded-xl shadow-md">
//         <StatsCharts />
//       </div>

//       <div className="mb-10 bg-white p-6 rounded-xl shadow-md">
//         <CalendarView />
//       </div>

//       <div className="mb-10 bg-white p-6 rounded-xl shadow-md">
//         <BookingsList bookings={bookings} onDelete={handleDelete} />
//       </div>
      


//       <div className="flex justify-center">
//         <button
//           onClick={handleExportAll}
//           className="px-6 py-3 bg-gradient-to-r from-teal-500 to-green-500 text-white font-semibold rounded-lg shadow hover:scale-105 transition-transform duration-300"
//         >
//           Export All Bookings (Room + Lawn)
//         </button>
//       </div>

//     </div>
//   );
// };

// export default DashboardHome;


// import React, { useEffect, useState } from 'react';
// import BookingsList from './BookingsList';
// import CalendarView from './CalendarView';
// import StatsCharts from './StatsCharts';

// const DashboardHome = () => {
//   const [bookings, setBookings] = useState([]);

//   // ✅ Function to export bookings CSV
//   const handleExportAll = () => {
//     const link = document.createElement('a');
//     link.href = 'http://localhost:5000/api/bookings/export-all';
//     link.setAttribute('download', 'all-bookings.csv');
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   // ✅ Fetch bookings and update state
//   const fetchBookings = async () => {
//     try {
//       const res = await fetch('http://localhost:5000/api/bookings');
//       const data = await res.json();
//       setBookings(data);
//     } catch (err) {
//       console.error("Failed to fetch bookings", err);
//     }
//   };

//   // ✅ useEffect must be inside the component
//   useEffect(() => {
//     fetchBookings();
//   }, []);

//   return (
//     <div style={{ padding: 20 }}>
//       <h1>Admin Dashboard</h1>
//       <StatsCharts />
//       <hr />
//       <CalendarView />
//       <hr />
//       <BookingsList bookings={bookings} />
//       <hr />
//       <button onClick={handleExportAll}>
//         Export All Bookings (Room + Lawn)
//       </button>
//     </div>
//   );
// };

// export default DashboardHome;
