import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [replyStatus, setReplyStatus] = useState("");
  const navigate = useNavigate();

  const fetchContacts = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.get("http://localhost:5000/api/admin/contacts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setContacts(res.data);
    } catch (err) {
      console.error("Failed to fetch contacts", err.response?.data || err);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this message?");
    if (!confirm) return;

    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(`http://localhost:5000/api/admin/contacts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setContacts((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error("Failed to delete contact", err.response?.data || err);
      alert("Failed to delete. Please try again.");
    }
  };

  const handleReply = async (email) => {
    if (!replyMessage.trim()) {
      setReplyStatus("Message cannot be empty.");
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");
      await axios.post(
        "http://localhost:5000/api/admin/contacts/reply",
        {
          to: email,
          subject: "Reply from Gouri Inn",
          message: replyMessage,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setReplyStatus("✅ Reply sent!");
      setReplyingTo(null);
      setReplyMessage("");
    } catch (err) {
      console.error(err);
      setReplyStatus("❌ Failed to send reply.");
    }
  };

  return (
    <div className="p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
      >
        ← Back
      </button>

      <h1 className="text-2xl font-bold mb-4">Contact Messages</h1>
      <div className="overflow-x-auto bg-white shadow rounded-lg p-4">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Phone</th>
              <th className="p-2 text-left">Inquiry</th>
              <th className="p-2 text-left">Message</th>
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((c, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                <td className="p-2">{c.name}</td>
                <td className="p-2">{c.email}</td>
                <td className="p-2">{c.phone || "N/A"}</td>
                <td className="p-2">{c.inquiryType || "N/A"}</td>
                <td className="p-2">{c.message}</td>
                <td className="p-2">{new Date(c.createdAt).toLocaleString()}</td>
                <td className="p-2">
                  <button
                    onClick={() => setReplyingTo(c._id)}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 mr-2"
                  >
                    Reply
                  </button>
                  <button
                    onClick={() => handleDelete(c._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>

                  {replyingTo === c._id && (
                    <div className="mt-2">
                      <textarea
                        rows={3}
                        className="w-full border rounded p-2 mt-2"
                        placeholder="Type your reply..."
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                      />
                      <div className="flex mt-2 gap-2">
                        <button
                          onClick={() => handleReply(c.email)}
                          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                        >
                          Send Reply
                        </button>
                        <button
                          onClick={() => {
                            setReplyingTo(null);
                            setReplyMessage("");
                            setReplyStatus("");
                          }}
                          className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                        >
                          Cancel
                        </button>
                      </div>
                      {replyStatus && <p className="text-sm mt-1">{replyStatus}</p>}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {contacts.length === 0 && <p className="mt-4 text-gray-600">No messages yet.</p>}
      </div>
    </div>
  );
};

export default Contacts;


// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const Contacts = () => {
//   const [contacts, setContacts] = useState([]);
//   const [replyingTo, setReplyingTo] = useState(null);
//   const [replyMessage, setReplyMessage] = useState("");
//   const [replyStatus, setReplyStatus] = useState("");
//   const navigate = useNavigate();

//   const fetchContacts = async () => {
//     try {
//       const token = localStorage.getItem("adminToken");
//       const res = await axios.get("http://localhost:5000/api/admin/contacts", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setContacts(res.data);
//     } catch (err) {
//       console.error("Failed to fetch contacts", err.response?.data || err);
//     }
//   };

//   useEffect(() => {
//     fetchContacts();
//   }, []);

//   const handleDelete = async (id) => {
//     const confirm = window.confirm("Are you sure you want to delete this message?");
//     if (!confirm) return;

//     try {
//       const token = localStorage.getItem("adminToken");
//       await axios.delete(`http://localhost:5000/api/admin/contacts/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setContacts((prev) => prev.filter((c) => c._id !== id));
//     } catch (err) {
//       console.error("Failed to delete contact", err.response?.data || err);
//       alert("Failed to delete. Please try again.");
//     }
//   };

//   const handleReply = async (email) => {
//     if (!replyMessage.trim()) {
//       setReplyStatus("Message cannot be empty.");
//       return;
//     }

//     try {
//       const token = localStorage.getItem("adminToken");
//       await axios.post(
//         "http://localhost:5000/api/admin/contacts/reply",
//         {
//           to: email,
//           subject: "Reply from Gouri Inn",
//           message: replyMessage,
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       setReplyStatus("✅ Reply sent!");
//       setReplyingTo(null);
//       setReplyMessage("");
//     } catch (err) {
//       console.error(err);
//       setReplyStatus("❌ Failed to send reply.");
//     }
//   };

//   return (
//     <div className="p-6">
//       <button
//         onClick={() => navigate(-1)}
//         className="mb-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
//       >
//         ← Back
//       </button>

//       <h1 className="text-2xl font-bold mb-4">Contact Messages</h1>
//       <div className="overflow-x-auto bg-white shadow rounded-lg p-4">
//         <table className="w-full">
//           <thead>
//             <tr className="border-b">
//               <th className="p-2 text-left">Name</th>
//               <th className="p-2 text-left">Email</th>
//               <th className="p-2 text-left">Phone</th>
//               <th className="p-2 text-left">Inquiry</th>
//               <th className="p-2 text-left">Message</th>
//               <th className="p-2 text-left">Date</th>
//               <th className="p-2 text-left">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {contacts.map((c, i) => (
//               <tr key={i} className="border-b hover:bg-gray-50">
//                 <td className="p-2">{c.name}</td>
//                 <td className="p-2">{c.email}</td>
//                 <td className="p-2">{c.phone || "N/A"}</td>
//                 <td className="p-2">{c.inquiryType || "N/A"}</td>
//                 <td className="p-2">{c.message}</td>
//                 <td className="p-2">{new Date(c.createdAt).toLocaleString()}</td>
//                 <td className="p-2">
//                   <button
//                     onClick={() => setReplyingTo(c._id)}
//                     className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 mr-2"
//                   >
//                     Reply
//                   </button>
//                   <button
//                     onClick={() => handleDelete(c._id)}
//                     className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
//                   >
//                     Delete
//                   </button>

//                   {replyingTo === c._id && (
//                     <div className="mt-2">
//                       <textarea
//                         rows={3}
//                         className="w-full border rounded p-2 mt-2"
//                         placeholder="Type your reply..."
//                         value={replyMessage}
//                         onChange={(e) => setReplyMessage(e.target.value)}
//                       />
//                       <div className="flex mt-2 gap-2">
//                         <button
//                           onClick={() => handleReply(c.email)}
//                           className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
//                         >
//                           Send Reply
//                         </button>
//                         <button
//                           onClick={() => {
//                             setReplyingTo(null);
//                             setReplyMessage("");
//                             setReplyStatus("");
//                           }}
//                           className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
//                         >
//                           Cancel
//                         </button>
//                       </div>
//                       {replyStatus && <p className="text-sm mt-1">{replyStatus}</p>}
//                     </div>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//         {contacts.length === 0 && <p className="mt-4 text-gray-600">No messages yet.</p>}
//       </div>
//     </div>
//   );
// };

// export default Contacts;


// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const Contacts = () => {
//   const [contacts, setContacts] = useState([]);
//   const navigate = useNavigate();

//   const fetchContacts = async () => {
//     try {
//       const token = localStorage.getItem("adminToken");
//       const res = await axios.get("http://localhost:5000/api/admin/contacts", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setContacts(res.data);
//     } catch (err) {
//       console.error("Failed to fetch contacts", err.response?.data || err);
//     }
//   };

//   useEffect(() => {
//     fetchContacts();
//   }, []);

//   const handleDelete = async (id) => {
//     const confirm = window.confirm("Are you sure you want to delete this message?");
//     if (!confirm) return;

//     try {
//       const token = localStorage.getItem("adminToken");
//       await axios.delete(`http://localhost:5000/api/admin/contacts/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       // Remove from state
//       setContacts((prev) => prev.filter((c) => c._id !== id));
//     } catch (err) {
//       console.error("Failed to delete contact", err.response?.data || err);
//       alert("Failed to delete. Please try again.");
//     }
//   };

//   return (
//     <div className="p-6">
//       <button
//         onClick={() => navigate(-1)}
//         className="mb-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
//       >
//         ← Back
//       </button>

//       <h1 className="text-2xl font-bold mb-4">Contact Messages</h1>
//       <div className="overflow-x-auto bg-white shadow rounded-lg p-4">
//         <table className="w-full">
//           <thead>
//             <tr className="border-b">
//               <th className="p-2 text-left">Name</th>
//               <th className="p-2 text-left">Email</th>
//               <th className="p-2 text-left">Phone</th>
//               <th className="p-2 text-left">Inquiry</th>
//               <th className="p-2 text-left">Message</th>
//               <th className="p-2 text-left">Date</th>
//               <th className="p-2 text-left">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {contacts.map((c, i) => (
//               <tr key={i} className="border-b hover:bg-gray-50">
//                 <td className="p-2">{c.name}</td>
//                 <td className="p-2">{c.email}</td>
//                 <td className="p-2">{c.phone || "N/A"}</td>
//                 <td className="p-2">{c.inquiryType || "N/A"}</td>
//                 <td className="p-2">{c.message}</td>
//                 <td className="p-2">{new Date(c.createdAt).toLocaleString()}</td>
//                 <td className="p-2">
//                   <button
//                     onClick={() => handleDelete(c._id)}
//                     className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//         {contacts.length === 0 && <p className="mt-4 text-gray-600">No messages yet.</p>}
//       </div>
//     </div>
//   );
// };

// export default Contacts;



// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const Contacts = () => {
//   const [contacts, setContacts] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchContacts = async () => {
//       try {
//         const token = localStorage.getItem("adminToken");
//         const res = await axios.get("http://localhost:5000/api/admin/contacts", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setContacts(res.data);
//       } catch (err) {
//         console.error("Failed to fetch contacts", err.response?.data || err);
//       }
//     };

//     fetchContacts();
//   }, []);

//   return (
//     <div className="p-6">
//       <button
//         onClick={() => navigate(-1)}
//         className="mb-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
//       >
//         ← Back
//       </button>

//       <h1 className="text-2xl font-bold mb-4">Contact Messages</h1>
//       <div className="overflow-x-auto bg-white shadow rounded-lg p-4">
//         <table className="w-full">
//           <thead>
//             <tr className="border-b">
//               <th className="p-2 text-left">Name</th>
//               <th className="p-2 text-left">Email</th>
//               <th className="p-2 text-left">Phone</th>
//               <th className="p-2 text-left">Inquiry</th>
//               <th className="p-2 text-left">Message</th>
//               <th className="p-2 text-left">Date</th>
//             </tr>
//           </thead>
//           <tbody>
//             {contacts.map((c, i) => (
//               <tr key={i} className="border-b hover:bg-gray-50">
//                 <td className="p-2">{c.name}</td>
//                 <td className="p-2">{c.email}</td>
//                 <td className="p-2">{c.phone || "N/A"}</td>
//                 <td className="p-2">{c.inquiryType || "N/A"}</td>
//                 <td className="p-2">{c.message}</td>
//                 <td className="p-2">{new Date(c.createdAt).toLocaleString()}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//         {contacts.length === 0 && <p className="mt-4 text-gray-600">No messages yet.</p>}
//       </div>
//     </div>
//   );
// };

// export default Contacts;