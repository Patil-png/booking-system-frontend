import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; // 🆕 Import useNavigate

export default function ContactList() {
  const [contacts, setContacts] = useState([]);
  const [expandedCard, setExpandedCard] = useState(null);
  const navigate = useNavigate(); // 🆕 Initialize

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/contacts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("📥 Contacts received:", data);
      setContacts(data);
    } catch (err) {
      console.error('❌ Failed to fetch contacts:', err.response?.data || err.message);
    }
  };

  const toggleExpand = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gray-50 min-h-screen">
      {/* 🆕 Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
      >
        ← Back
      </button>

      <h2 className="text-3xl font-bold mb-6 text-center">Contact Messages</h2>

      {contacts.length === 0 ? (
        <p className="text-gray-500 text-center mt-10">📭 No messages found</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {contacts.map((c) => (
              <motion.div
                key={c._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                layout
                className="bg-white shadow-xl rounded-2xl p-6 border hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
              >
                <h3 className="font-bold text-xl mb-1">{c.name}</h3>
                <p className="text-gray-700 text-sm">{c.email}</p>
                <p className="text-sm text-gray-600 mb-2">Phone: {c.phone || 'N/A'}</p>
                <div className="text-gray-800 text-sm mb-1">
                  <p className="font-semibold">Message:</p>
                  <div className={`whitespace-pre-line ${expandedCard === c._id ? '' : 'line-clamp-3'}`}>
                    {c.message}
                  </div>
                  {c.message.length > 100 && (
                    <button
                      onClick={() => toggleExpand(c._id)}
                      className="text-blue-600 text-xs mt-1 hover:underline"
                    >
                      {expandedCard === c._id ? 'Show Less' : 'Read More'}
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-1">IP: {c.ip}</p>
                <p className="text-xs text-gray-400">Date: {new Date(c.createdAt).toLocaleString()}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}




// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { motion, AnimatePresence } from 'framer-motion';
// import { useNavigate } from 'react-router-dom'; // 🆕 Import useNavigate

// export default function ContactList() {
//   const [contacts, setContacts] = useState([]);
//   const [expandedCard, setExpandedCard] = useState(null);
//   const navigate = useNavigate(); // 🆕 Initialize

//   useEffect(() => {
//     fetchContacts();
//   }, []);

//   const fetchContacts = async () => {
//     try {
//       const token = localStorage.getItem('adminToken');
//       const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/contacts`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       console.log("📥 Contacts received:", data);
//       setContacts(data);
//     } catch (err) {
//       console.error('❌ Failed to fetch contacts:', err.response?.data || err.message);
//     }
//   };

//   const toggleExpand = (id) => {
//     setExpandedCard(expandedCard === id ? null : id);
//   };

//   return (
//     <div className="p-6 max-w-6xl mx-auto bg-gray-50 min-h-screen">
//       {/* 🆕 Back Button */}
//       <button
//         onClick={() => navigate(-1)}
//         className="mb-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
//       >
//         ← Back
//       </button>

//       <h2 className="text-3xl font-bold mb-6 text-center">Contact Messages</h2>

//       {contacts.length === 0 ? (
//         <p className="text-gray-500 text-center mt-10">📭 No messages found</p>
//       ) : (
//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//           <AnimatePresence>
//             {contacts.map((c) => (
//               <motion.div
//                 key={c._id}
//                 initial={{ opacity: 0, y: 30 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: 30 }}
//                 layout
//                 className="bg-white shadow-xl rounded-2xl p-6 border hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
//               >
//                 <h3 className="font-bold text-xl mb-1">{c.name}</h3>
//                 <p className="text-gray-700 text-sm">{c.email}</p>
//                 <p className="text-sm text-gray-600 mb-2">Phone: {c.phone || 'N/A'}</p>
//                 <div className="text-gray-800 text-sm mb-1">
//                   <p className="font-semibold">Message:</p>
//                   <div className={`whitespace-pre-line ${expandedCard === c._id ? '' : 'line-clamp-3'}`}>
//                     {c.message}
//                   </div>
//                   {c.message.length > 100 && (
//                     <button
//                       onClick={() => toggleExpand(c._id)}
//                       className="text-blue-600 text-xs mt-1 hover:underline"
//                     >
//                       {expandedCard === c._id ? 'Show Less' : 'Read More'}
//                     </button>
//                   )}
//                 </div>
//                 <p className="text-xs text-gray-400 mt-1">IP: {c.ip}</p>
//                 <p className="text-xs text-gray-400">Date: {new Date(c.createdAt).toLocaleString()}</p>
//               </motion.div>
//             ))}
//           </AnimatePresence>
//         </div>
//       )}
//     </div>
//   );
// }
