import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const rooms = [
  {
    id: 1,
    title: "Deluxe Room",
    description: "Spacious room with king-sized bed, free Wi-Fi, and city view.",
    image: "/RoomImages/deluxe.jpg",
  },
  {
    id: 2,
    title: "Executive Suite",
    description: "Includes a private lounge, workspace, and complimentary minibar.",
    image: "/RoomImages/executive.jpg",
  },
  {
    id: 3,
    title: "Family Suite",
    description: "Perfect for families, includes 2 bedrooms, kids area, and dining table.",
    image: "/RoomImages/family.jpg",
  },
];

const GuestRooms = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pt-16 pb-24 px-4 md:px-12 bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] bg-300 animate-aurora-slow text-white">
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold mb-4">Guest Rooms</h1>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Experience comfort and elegance with our luxurious room options, designed for your ultimate relaxation.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8">
        {rooms.map((room, index) => (
          <motion.div
            key={room.id}
            className="bg-[#1e1e2f] rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition duration-300"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2, duration: 0.5 }}
          >
            <img
              src={room.image}
              alt={room.title}
              className="w-full h-56 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold text-white">{room.title}</h3>
              <p className="text-gray-300 text-sm mb-4">{room.description}</p>
              <button
                onClick={() => navigate("/book")}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
              >
                Book Now
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default GuestRooms;



// import React from "react";
// import { motion } from "framer-motion";

// const rooms = [
//   {
//     id: 1,
//     title: "Deluxe Room",
//     description: "Spacious room with king-sized bed, free Wi-Fi, and city view.",
//     image: "/RoomImages/deluxe.jpg",
//     price: "₹2,999 / night",
//   },
//   {
//     id: 2,
//     title: "Executive Suite",
//     description: "Includes a private lounge, workspace, and complimentary minibar.",
//     image: "/RoomImages/executive.jpg",
//     price: "₹4,999 / night",
//   },
//   {
//     id: 3,
//     title: "Family Suite",
//     description: "Perfect for families, includes 2 bedrooms, kids area, and dining table.",
//     image: "/RoomImages/family.jpg",
//     price: "₹5,999 / night",
//   },
// ];

// const GuestRooms = () => {
//   return (
//     <div className="min-h-screen pt-16 pb-24 px-4 md:px-12 bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] bg-300 animate-aurora-slow text-white">
//       <motion.div
//         className="text-center mb-12"
//         initial={{ opacity: 0, y: 30 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         viewport={{ once: true }}
//         transition={{ duration: 0.6 }}
//       >
//         <h1 className="text-4xl font-bold mb-4">Guest Rooms</h1>
//         <p className="text-gray-300 max-w-2xl mx-auto">
//           Experience comfort and elegance with our luxurious room options, designed for your ultimate relaxation.
//         </p>
//       </motion.div>

//       <div className="grid md:grid-cols-3 gap-8">
//         {rooms.map((room, index) => (
//           <motion.div
//             key={room.id}
//             className="bg-[#1e1e2f] rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition duration-300"
//             initial={{ opacity: 0, y: 40 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ delay: index * 0.2, duration: 0.5 }}
//           >
//             <img
//               src={room.image}
//               alt={room.title}
//               className="w-full h-56 object-cover"
//             />
//             <div className="p-6">
//               <h3 className="text-xl font-semibold text-white">{room.title}</h3>
//               <p className="text-gray-400 text-sm my-2">{room.price}</p>
//               <p className="text-gray-300 text-sm mb-4">{room.description}</p>
//               <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300">
//                 Book Now
//               </button>
//             </div>
//           </motion.div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default GuestRooms;


// // backend friendly 

// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";

// const Rooms = () => { // Renamed component from GuestRooms to Rooms
//   const [rooms, setRooms] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchRooms = async () => {
//       try {
//         const response = await fetch('http://localhost:5000/api/rooms'); // Fetch from your backend
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         const data = await response.json();
//         setRooms(data);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRooms();
//   }, []);

//   if (loading) {
//     return (
//       <div className="min-h-screen pt-16 pb-24 px-4 md:px-12 bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] bg-300 animate-aurora-slow text-white text-center">
//         Loading rooms...
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen pt-16 pb-24 px-4 md:px-12 bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] bg-300 animate-aurora-slow text-white text-center text-red-600">
//         Error: {error}
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen pt-16 pb-24 px-4 md:px-12 bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] bg-300 animate-aurora-slow text-white">
//       <motion.div
//         className="text-center mb-12"
//         initial={{ opacity: 0, y: 20 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         viewport={{ once: true }}
//         transition={{ duration: 0.6 }}
//       >
//         <h1 className="text-4xl font-bold mb-4">Guest Rooms</h1>
//         <p className="text-gray-300 max-w-2xl mx-auto">
//           Experience comfort and elegance with our luxurious room options, designed for your ultimate relaxation.
//         </p>
//       </motion.div>

//       <div className="grid md:grid-cols-3 gap-8">
//         {rooms.length > 0 ? (
//           rooms.map((room, index) => (
//             <motion.div
//               key={room._id || room.id}
//               className="bg-[#1e1e2f] rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition duration-300"
//               initial={{ opacity: 0, y: 40 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ delay: index * 0.2, duration: 0.5 }}
//             >
//               <img
//                 src={room.image}
//                 alt={room.name || room.title} // Use name from backend, fallback to title if still present from old data
//                 className="w-full h-56 object-cover"
//               />
//               <div className="p-6">
//                 <h3 className="text-xl font-semibold text-white">{room.name || room.title}</h3> {/* Use name or title */}
//                 <p className="text-gray-400 text-sm my-2">{room.price}</p>
//                 <p className="text-gray-300 text-sm mb-4">{room.description}</p>
//                 {/* Assuming there's a contact or book now button here,
//                     the original Rooms.jsx snippet cut off before that */}
//               </div>
//             </motion.div>
//           ))
//         ) : (
//           <p className="col-span-3 text-center text-gray-500">No rooms available at the moment.</p>
//         )}
//       </div>
//       {/* Assuming there's a CTA section at the bottom, similar to GuestRooms.jsx */}
//     </div>
//   );
// };

// export default Rooms;