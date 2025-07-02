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
      const { data } = await axios.get('http://localhost:5000/api/admin/contacts', {
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

// export default function ContactList() {
//   const [contacts, setContacts] = useState([]);
//   const [expandedCard, setExpandedCard] = useState(null);

//   useEffect(() => {
//     fetchContacts();
//   }, []);

//   const fetchContacts = async () => {
//     try {
//       const token = localStorage.getItem('adminToken');
//       const { data } = await axios.get('http://localhost:5000/api/admin/contacts', {
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


// // 📁 src/pages/admin/ContactList.jsx

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { motion, AnimatePresence } from 'framer-motion';

// export default function ContactList() {
//   const [contacts, setContacts] = useState([]);
//   const [expandedCard, setExpandedCard] = useState(null);

//   useEffect(() => {
//     fetchContacts();
//   }, []);

//   const fetchContacts = async () => {
//     try {
//       const token = localStorage.getItem('adminToken');
//       const { data } = await axios.get('http://localhost:5000/api/admin/contacts', {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setContacts(data);
//     } catch (err) {
//       console.error('Failed to fetch contacts', err);
//     }
//   };

//   const toggleExpand = (id) => {
//     setExpandedCard(expandedCard === id ? null : id);
//   };

//   return (
//     <div className="p-6 max-w-6xl mx-auto bg-gray-50 min-h-screen">
//       <h2 className="text-3xl font-bold mb-6 text-center">Contact Messages</h2>
//       <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//         <AnimatePresence>
//           {contacts.map((c) => (
//             <motion.div
//               key={c._id}
//               initial={{ opacity: 0, y: 30 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: 30 }}
//               layout
//               className="bg-white shadow-xl rounded-2xl p-6 border border-gray-200 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 ease-in-out"
//             >
//               <div className="space-y-1">
//                 <h3 className="font-bold text-xl">{c.name}</h3>
//                 <p className="text-gray-700 text-sm">{c.email}</p>
//                 <p className="text-sm text-gray-600">Phone: {c.phone || 'N/A'}</p>
//                 <div className="mt-2 text-gray-800 text-sm">
//                   <p className="font-semibold">Message:</p>
//                   <div
//                     className={`relative whitespace-pre-line ${
//                       expandedCard === c._id ? 'max-h-[300px]' : 'max-h-20'
//                     } overflow-hidden`}
//                   >
//                     {c.message}
//                     {c.message.length > 200 && (
//                       <div className="absolute bottom-0 left-0 w-full h-10 bg-gradient-to-t from-white to-transparent" />
//                     )}
//                   </div>
//                   {c.message.length > 200 && (
//                     <button
//                       onClick={() => toggleExpand(c._id)}
//                       className="text-blue-600 text-xs mt-1 hover:underline"
//                     >
//                       {expandedCard === c._id ? 'Show Less' : 'Read More'}
//                     </button>
//                   )}
//                 </div>
//                 <p className="text-xs text-gray-400 mt-1">IP: {c.ip}</p>
//                 <p className="text-xs text-gray-400 mt-1">
//                   Date: {new Date(c.createdAt).toLocaleString()}
//                 </p>
//               </div>
//             </motion.div>
//           ))}
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// }


// import React, { useEffect, useState } from 'react';
// import API from '../api';
// import { motion, AnimatePresence } from 'framer-motion';

// export default function ContactList() {
//   const [contacts, setContacts] = useState([]);
//   const [editing, setEditing] = useState(null);
//   const [form, setForm] = useState({ name: '', email: '', phone: '', inquiryType: '', message: '' });
//   const [expandedCard, setExpandedCard] = useState(null); // for toggling long message

//   useEffect(() => {
//     fetchContacts();
//   }, []);

//   const fetchContacts = async () => {
//     try {
//       const { data } = await API.get('/contact');
//       setContacts(data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const deleteContact = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this contact?')) return;
//     await API.delete(`/contact/${id}`);
//     fetchContacts();
//   };

//   const startEdit = (contact) => {
//     setEditing(contact._id);
//     setForm(contact);
//   };

//   const cancelEdit = () => {
//     setEditing(null);
//     setForm({ name: '', email: '', phone: '', inquiryType: '', message: '' });
//   };

//   const handleUpdate = async () => {
//     await API.put(`/contact/${editing}`, form);
//     setEditing(null);
//     fetchContacts();
//   };

//   const toggleExpand = (id) => {
//     setExpandedCard(expandedCard === id ? null : id);
//   };

//   return (
//     <div className="p-6 max-w-6xl mx-auto bg-gray-50 min-h-screen">
//       <h2 className="text-3xl font-bold mb-6 text-center">Contact Messages</h2>
//       <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//         <AnimatePresence>
//           {contacts.map((c) => (
//             <motion.div
//               key={c._id}
//               initial={{ opacity: 0, y: 30 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: 30 }}
//               layout
//               className="bg-white shadow-xl rounded-2xl p-6 border border-gray-200 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 ease-in-out"
//             >
//               {editing === c._id ? (
//                 <div className="space-y-2">
//                   <input
//                     className="w-full border p-2 rounded"
//                     value={form.name}
//                     onChange={(e) => setForm({ ...form, name: e.target.value })}
//                     placeholder="Name"
//                   />
//                   <input
//                     className="w-full border p-2 rounded"
//                     value={form.email}
//                     onChange={(e) => setForm({ ...form, email: e.target.value })}
//                     placeholder="Email"
//                   />
//                   <input
//                     className="w-full border p-2 rounded"
//                     value={form.phone}
//                     onChange={(e) => setForm({ ...form, phone: e.target.value })}
//                     placeholder="Phone"
//                   />
//                   <input
//                     className="w-full border p-2 rounded"
//                     value={form.inquiryType}
//                     onChange={(e) => setForm({ ...form, inquiryType: e.target.value })}
//                     placeholder="Inquiry Type"
//                   />
//                   <textarea
//                     className="w-full border p-2 rounded"
//                     value={form.message}
//                     onChange={(e) => setForm({ ...form, message: e.target.value })}
//                     placeholder="Message"
//                   />
//                   <div className="flex gap-2">
//                     <button onClick={handleUpdate} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
//                       Save
//                     </button>
//                     <button onClick={cancelEdit} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">
//                       Cancel
//                     </button>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="space-y-1">
//                   <h3 className="font-bold text-xl">{c.name}</h3>
//                   <p className="text-gray-700 text-sm">{c.email}</p>
//                   <p className="text-sm text-gray-600">Phone: {c.phone || 'N/A'}</p>
//                   <p className="text-sm text-gray-600">Type: {c.inquiryType || 'General'}</p>

//                   <div className="mt-2 text-gray-800 text-sm">
//                     <p className="font-semibold">Message:</p>
//                     <div
//                       className={`relative whitespace-pre-line ${
//                         expandedCard === c._id ? 'max-h-[300px]' : 'max-h-20'
//                       } overflow-hidden`}
//                     >
//                       {c.message}
//                       {c.message.length > 200 && (
//                         <div
//                           className="absolute bottom-0 left-0 w-full h-10 bg-gradient-to-t from-white to-transparent"
//                         />
//                       )}
//                     </div>
//                     {c.message.length > 200 && (
//                       <button
//                         onClick={() => toggleExpand(c._id)}
//                         className="text-blue-600 text-xs mt-1 hover:underline"
//                       >
//                         {expandedCard === c._id ? 'Show Less' : 'Read More'}
//                       </button>
//                     )}
//                   </div>

//                   <p className="text-xs text-gray-400 mt-1">IP: {c.ip}</p>
//                   <div className="flex gap-2 mt-3">
//                     <button onClick={() => startEdit(c)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
//                       Edit
//                     </button>
//                     <button onClick={() => deleteContact(c._id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
//                       Delete
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </motion.div>
//           ))}
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// }


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// import React, { useEffect, useState } from 'react';
// import API from '../api';
// import { motion, AnimatePresence } from 'framer-motion';

// export default function ContactList() {
//   const [contacts, setContacts] = useState([]);
//   const [editing, setEditing] = useState(null);
//   const [form, setForm] = useState({ name: '', email: '', phone: '', inquiryType: '', message: '' });

//   useEffect(() => {
//     fetchContacts();
//   }, []);

//   const fetchContacts = async () => {
//     try {
//       const { data } = await API.get('/contact');
//       setContacts(data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const deleteContact = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this contact?')) return;
//     await API.delete(`/contact/${id}`);
//     fetchContacts();
//   };

//   const startEdit = (contact) => {
//     setEditing(contact._id);
//     setForm(contact);
//   };

//   const cancelEdit = () => {
//     setEditing(null);
//     setForm({ name: '', email: '', phone: '', inquiryType: '', message: '' });
//   };

//   const handleUpdate = async () => {
//     await API.put(`/contact/${editing}`, form);
//     setEditing(null);
//     fetchContacts();
//   };

//   return (
//     <div className="p-4 max-w-5xl mx-auto">
//       <h2 className="text-3xl font-bold mb-6 text-center">Contact Messages</h2>
//       <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//         <AnimatePresence>
//           {contacts.map((c) => (
//             <motion.div
//               key={c._id}
//               initial={{ opacity: 0, y: 30 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: 30 }}
//               layout
//               className="bg-white shadow-lg rounded-2xl p-4 border hover:shadow-xl transition-shadow"
//             >
//               {editing === c._id ? (
//                 <div className="space-y-2">
//                   <input
//                     className="w-full border p-2 rounded"
//                     value={form.name}
//                     onChange={(e) => setForm({ ...form, name: e.target.value })}
//                     placeholder="Name"
//                   />
//                   <input
//                     className="w-full border p-2 rounded"
//                     value={form.email}
//                     onChange={(e) => setForm({ ...form, email: e.target.value })}
//                     placeholder="Email"
//                   />
//                   <input
//                     className="w-full border p-2 rounded"
//                     value={form.phone}
//                     onChange={(e) => setForm({ ...form, phone: e.target.value })}
//                     placeholder="Phone"
//                   />
//                   <input
//                     className="w-full border p-2 rounded"
//                     value={form.inquiryType}
//                     onChange={(e) => setForm({ ...form, inquiryType: e.target.value })}
//                     placeholder="Inquiry Type"
//                   />
//                   <textarea
//                     className="w-full border p-2 rounded"
//                     value={form.message}
//                     onChange={(e) => setForm({ ...form, message: e.target.value })}
//                     placeholder="Message"
//                   />
//                   <div className="flex gap-2">
//                     <button onClick={handleUpdate} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
//                       Save
//                     </button>
//                     <button onClick={cancelEdit} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">
//                       Cancel
//                     </button>
//                   </div>
//                 </div>
//               ) : (
//                 <div>
//                   <h3 className="font-bold text-xl">{c.name}</h3>
//                   <p className="text-gray-700">{c.email}</p>
//                   <p className="text-sm text-gray-600">Phone: {c.phone || 'N/A'}</p>
//                   <p className="text-sm text-gray-600">Type: {c.inquiryType || 'General'}</p>
//                   <p className="mt-2 text-gray-800">{c.message}</p>
//                   <p className="text-xs text-gray-400 mt-1">IP: {c.ip}</p>
//                   <div className="flex gap-2 mt-3">
//                     <button onClick={() => startEdit(c)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
//                       Edit
//                     </button>
//                     <button onClick={() => deleteContact(c._id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
//                       Delete
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </motion.div>
//           ))}
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// }


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// import React, { useEffect, useState } from 'react';
// import API from '../api';

// export default function ContactList() {
//   const [contacts, setContacts] = useState([]);
//   const [editing, setEditing] = useState(null);
//   const [form, setForm] = useState({ name: '', email: '', phone: '', inquiryType: '', message: '' });

//   useEffect(() => {
//     API.get('/contact')
//       .then(res => setContacts(res.data))
//       .catch(err => console.error(err));
//   }, []);

//   const fetchContacts = async () => {
//     const { data } = await API.get('/contact');
//     setContacts(data);
//   };

//   const deleteContact = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this contact?')) return;
//     await API.delete(`/contact/${id}`);
//     fetchContacts();
//   };

//   const startEdit = (contact) => {
//     setEditing(contact._id);
//     setForm(contact);
//   };

//   const cancelEdit = () => {
//     setEditing(null);
//     setForm({ name: '', email: '', phone: '', inquiryType: '', message: '' });
//   };

//   const handleUpdate = async () => {
//     await API.put(`/contact/${editing}`, form);
//     setEditing(null);
//     fetchContacts();
//   };

//   return (
//     <div>
//       <h2>Contact Messages</h2>
//       {contacts.map((c) => (
//         <div key={c._id} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
//           {editing === c._id ? (
//             <>
//               <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /><br />
//               <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /><br />
//               <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /><br />
//               <input value={form.inquiryType} onChange={(e) => setForm({ ...form, inquiryType: e.target.value })} /><br />
//               <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /><br />
//               <button onClick={handleUpdate}>Save</button>
//               <button onClick={cancelEdit}>Cancel</button>
//             </>
//           ) : (
//             <>
//               <strong>{c.name}</strong> ({c.email})<br />
//               Phone: {c.phone || 'N/A'}<br />
//               Type: {c.inquiryType || 'General'}<br />
//               Message: {c.message}<br />
//               <small>Submitted from IP: {c.ip}</small><br />
//               <button onClick={() => startEdit(c)}>Edit</button>
//               <button onClick={() => deleteContact(c._id)}>Delete</button>
//             </>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// }
