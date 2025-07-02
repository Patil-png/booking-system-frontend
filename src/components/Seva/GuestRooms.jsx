import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const rooms = [
  {
    id: 1,
    name: "Deluxe Room",
    description: "Spacious rooms with modern amenities, complimentary breakfast, and beautiful views.",
    image: "/RoomImages/deluxe.jpg",
  },
  {
    id: 2,
    name: "Premium Suite",
    description: "A luxurious suite with separate living area, elegant decor, and premium services.",
    image: "/RoomImages/suite.jpg",
  },
  {
    id: 3,
    name: "Family Room",
    description: "Ideal for families with spacious interiors, double beds, and modern comforts.",
    image: "/RoomImages/family.jpg",
  },
];

const GuestRooms = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white pt-16 pb-24 px-4 md:px-12">
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold text-primary mb-4">Guest Rooms</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Experience luxury and comfort in every stay. Our rooms are designed for relaxation and elegance.
        </p>
      </motion.div>

      <div className="grid gap-8 md:grid-cols-3">
        {rooms.map((room, index) => (
          <motion.div
            key={room.id}
            className="bg-gray-50 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition duration-300"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2, duration: 0.5 }}
          >
            <img
              src={room.image}
              alt={room.name}
              className="w-full h-56 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold text-primary mb-2">{room.name}</h3>
              <p className="text-gray-600 text-sm">{room.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="mt-16 text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl font-bold text-primary mb-4">Book Your Stay</h2>
        <p className="text-gray-600 max-w-xl mx-auto mb-6">
          Whether for business or leisure, Gouri Inn offers the perfect blend of comfort and style.
        </p>
        <button
          onClick={() => navigate("/book")}
          className="bg-primary text-white px-6 py-2 rounded-lg shadow hover:bg-primary/90 transition duration-300"
        >
          Book Now
        </button>
      </motion.div>
    </div>
  );
};

export default GuestRooms;