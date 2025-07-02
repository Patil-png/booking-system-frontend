// src/components/Notifications.jsx
import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/notifications');
      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsSeen = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/notifications/${id}/seen`, {
        method: 'PUT',
      });

      setNotifications((prev) =>
        prev.map((n) =>
          n._id === id ? { ...n, seen: true, autoHide: true } : n
        )
      );

      toast.success('Marked as seen');

      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n._id !== id));
      }, 3000);
    } catch (err) {
      console.error('Error marking notification as seen:', err);
      toast.error('Failed to mark as seen');
    }
  };

  const deleteNotification = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/notifications/${id}`, {
        method: 'DELETE',
      });
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      toast.success('Notification deleted');
    } catch (err) {
      console.error('Error deleting notification:', err);
      toast.error('Failed to delete');
    }
  };

  if (loading) return <p>Loading notifications...</p>;

  return (
    <div className="bg-white p-4 shadow rounded-lg mb-6 relative">
      <Toaster position="top-right" reverseOrder={false} />
      <h3 className="text-xl font-bold mb-3">Notifications</h3>
      {notifications.length === 0 ? (
        <p className="text-gray-500">No notifications found.</p>
      ) : (
        <ul className="space-y-2">
          {notifications.map((n) => (
            <li
              key={n._id}
              className={`p-3 border rounded flex justify-between items-start transition cursor-pointer ${
                n.seen ? 'text-gray-400' : 'text-black font-semibold'
              } hover:bg-gray-100`}
              onClick={() => !n.seen && markAsSeen(n._id)}
            >
              <div>
                <span>{n.message}</span>
                <br />
                <small className="text-sm">
                  {new Date(n.createdAt).toLocaleString()}
                </small>
              </div>
              <button
                className="text-red-500 ml-4 text-sm hover:underline"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNotification(n._id);
                }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;


// import React, { useEffect, useState } from 'react';

// const Notifications = () => {
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchNotifications = async () => {
//     try {
//       const res = await fetch('http://localhost:5000/api/notifications');
//       const data = await res.json();
//       setNotifications(data);
//     } catch (err) {
//       console.error('Failed to fetch notifications:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchNotifications();
//   }, []);

//   const markAsSeen = async (id) => {
//     try {
//       await fetch(`http://localhost:5000/api/notifications/${id}/seen`, {
//         method: 'PUT',
//       });
//       setNotifications((prev) =>
//         prev.map((n) => (n._id === id ? { ...n, seen: true } : n))
//       );
//     } catch (err) {
//       console.error('Error marking notification as seen:', err);
//     }
//   };

//   if (loading) return <p>Loading notifications...</p>;

//   return (
//     <div className="bg-white p-4 shadow rounded-lg mb-6">
//       <h3 className="text-xl font-bold mb-3">Notifications</h3>
//       {notifications.length === 0 ? (
//         <p className="text-gray-500">No notifications found.</p>
//       ) : (
//         <ul className="space-y-2">
//           {notifications.map((n) => (
//             <li
//               key={n._id}
//               className={`p-2 cursor-pointer border-b ${
//                 n.seen ? 'text-gray-400' : 'text-black font-semibold'
//               } hover:bg-gray-100 transition`}
//               onClick={() => markAsSeen(n._id)}
//             >
//               <span>{n.message}</span>
//               <br />
//               <small className="text-sm">{new Date(n.createdAt).toLocaleString()}</small>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default Notifications;


// import React, { useEffect, useState } from 'react';

// const Notifications = () => {
//   const [notifications, setNotifications] = useState([]);

//   useEffect(() => {
//     fetch('http://localhost:5000/api/notifications')
//       .then(res => res.json())
//       .then(setNotifications);
//   }, []);

//   const markAsSeen = async (id) => {
//     await fetch(`http://localhost:5000/api/notifications/${id}/seen`, { method: 'PUT' });
//     setNotifications((prev) => prev.map(n => n._id === id ? { ...n, seen: true } : n));
//   };

//   return (
//     <div className="bg-white p-4 shadow rounded-lg mb-6">
//       <h3 className="text-xl font-bold mb-2">Notifications</h3>
//       <ul>
//         {notifications.map(n => (
//           <li
//             key={n._id}
//             className={`p-2 ${n.seen ? 'text-gray-400' : 'text-black font-semibold'}`}
//             onClick={() => markAsSeen(n._id)}
//           >
//             {n.message} - {new Date(n.createdAt).toLocaleString()}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default Notifications;
