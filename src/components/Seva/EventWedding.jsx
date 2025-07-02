import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const weddingImages = [
  "/RoomImages/event1.jpg",
  "/RoomImages/event2.jpg",
  "/RoomImages/event3.jpg",
  "/RoomImages/event4.jpg",
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6, ease: "easeOut" },
  }),
};

const EventWedding = () => {
  const navigate = useNavigate();

  return (
    <div className="container pt-6 pb-6 bg-gray-50 min-h-screen text-gray-800">
      {/* Hero Section */}
      <div
        className="relative bg-cover bg-center h-[60vh]"
        style={{ backgroundImage: "url('/RoomImages/event1.jpg')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold mb-4"
          >
            Events & Weddings
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="max-w-xl text-lg"
          >
            Create unforgettable memories at Gouri Inn with elegant venues, top-notch service, and luxury.
          </motion.p>
        </div>
      </div>

      {/* Description Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        custom={0}
        className="container mx-auto px-6 py-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-primary">
          Celebrate With Grace
        </h2>
        <p className="text-lg text-center max-w-3xl mx-auto text-gray-600">
          Our beautifully designed banquet spaces and outdoor venues offer a perfect setting for weddings, receptions, birthdays, and corporate events. Let our expert team take care of everything while you enjoy your special day stress-free.
        </p>
      </motion.div>

      {/* Image Gallery Section */}
      <div className="container mx-auto px-6 pb-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {weddingImages.map((img, i) => (
          <motion.div
            key={i}
            className="overflow-hidden rounded-2xl shadow-lg"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={i + 1}
          >
            <img
              src={img}
              alt={`event-${i}`}
              className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300 ease-in-out"
            />
          </motion.div>
        ))}
      </div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="bg-primary text-white py-12 px-6 text-center rounded-t-3xl"
      >
        <h3 className="text-2xl md:text-3xl font-semibold mb-4">
          Ready to Plan Your Perfect Day?
        </h3>
        <p className="mb-6">Contact us today and let our experts help you bring your vision to life.</p>
        <button
          onClick={() => navigate("/contact")}
          className="inline-block bg-white text-primary px-6 py-3 rounded-full font-semibold shadow hover:bg-gray-100 transition"
        >
          Contact Us
        </button>
      </motion.div>
    </div>
  );
};

export default EventWedding;