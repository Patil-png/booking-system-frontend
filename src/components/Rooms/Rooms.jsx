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
