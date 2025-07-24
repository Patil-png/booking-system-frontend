import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaRegGem } from "react-icons/fa";

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

const wavePath1 = [
  "M0,80 C360,160 1080,0 1440,80 L1440,160 L0,160 Z",
  "M0,90 C360,140 1080,20 1440,90 L1440,160 L0,160 Z",
  "M0,80 C360,160 1080,0 1440,80 L1440,160 L0,160 Z",
  "M0,70 C360,180 1080,-20 1440,70 L1440,160 L0,160 Z",
  "M0,80 C360,160 1080,0 1440,80 L1440,160 L0,160 Z"
];
const wavePath2 = [
  "M0,120 C480,40 960,200 1440,120 L1440,160 L0,160 Z",
  "M0,130 C480,60 960,180 1440,130 L1440,160 L0,160 Z",
  "M0,120 C480,40 960,200 1440,120 L1440,160 L0,160 Z",
  "M0,110 C480,20 960,220 1440,110 L1440,160 L0,160 Z",
  "M0,120 C480,40 960,200 1440,120 L1440,160 L0,160 Z"
];
const wavePath3 = [
  "M0,100 Q720,180 1440,100 L1440,160 L0,160 Z",
  "M0,110 Q720,170 1440,110 L1440,160 L0,160 Z",
  "M0,100 Q720,180 1440,100 L1440,160 L0,160 Z",
  "M0,90 Q720,190 1440,90 L1440,160 L0,160 Z",
  "M0,100 Q720,180 1440,100 L1440,160 L0,160 Z"
];

const waveAnim = {
  animate: {
    d: wavePath1,
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};
const waveAnim2 = {
  animate: {
    d: wavePath2,
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};
const waveAnim3 = {
  animate: {
    d: wavePath3,
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const waveDivider = (
  <div className="relative w-full h-24 md:h-32 overflow-hidden">
    <svg
      viewBox="0 0 1440 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 w-full h-full"
    >
      <defs>
        <linearGradient id="waveGradient1" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3b82f6" />
          <stop offset="1" stopColor="#8b5cf6" />
        </linearGradient>
        <linearGradient id="waveGradient2" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366f1" />
          <stop offset="1" stopColor="#a5b4fc" />
        </linearGradient>
      </defs>
      <motion.path
        d={wavePath1[0]}
        fill="url(#waveGradient1)"
        fillOpacity="0.18"
        variants={waveAnim}
        animate="animate"
      />
      <motion.path
        d={wavePath2[0]}
        fill="url(#waveGradient2)"
        fillOpacity="0.28"
        variants={waveAnim2}
        animate="animate"
      />
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="12" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <motion.path
        d={wavePath3[0]}
        fill="#312e81"
        fillOpacity="0.5"
        filter="url(#glow)"
        variants={waveAnim3}
        animate="animate"
      />
    </svg>
  </div>
);

// Simple sparkle/confetti animation for hero
const Sparkles = () => (
  <div className="pointer-events-none absolute inset-0 flex justify-center items-center z-10">
    {[...Array(12)].map((_, i) => (
      <motion.span
        key={i}
        className="absolute"
        initial={{ opacity: 0, scale: 0.5, x: 0, y: 0 }}
        animate={{
          opacity: [0, 1, 0],
          scale: [0.5, 1.2, 0.5],
          x: [0, Math.cos((i / 12) * 2 * Math.PI) * 120],
          y: [0, Math.sin((i / 12) * 2 * Math.PI) * 60],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          delay: i * 0.18,
          ease: "easeInOut",
        }}
        style={{ left: "50%", top: "50%" }}
      >
        <FaRegGem className="text-yellow-300 text-lg drop-shadow" />
      </motion.span>
    ))}
  </div>
);

const EventWedding = () => {
  const navigate = useNavigate();

  return (
    <div className="container pt-6 pb-6 bg-gradient-to-br from-pink-50 via-white to-yellow-50 min-h-screen text-gray-800">
      {/* Hero Section */}
      <div
        className="relative bg-cover bg-center h-[60vh] rounded-b-3xl shadow-lg overflow-hidden"
        style={{ backgroundImage: "url('/RoomImages/event1.jpg')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white text-center px-4">
          <Sparkles />
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg"
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

      {/* Wavy Divider */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        {waveDivider}
      </motion.div>

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

      {/* Gallery Divider */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        {waveDivider}
      </motion.div>

      {/* Image Gallery Section */}
      <div className="container mx-auto px-6 pb-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {weddingImages.map((img, i) => (
          <motion.div
            key={i}
            className="overflow-hidden rounded-2xl shadow-lg bg-white/80 hover:shadow-2xl border border-pink-100 relative group"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={i + 1}
            whileHover={{ scale: 1.04, rotate: (i % 2 === 0 ? 2 : -2) }}
            transition={{ type: "spring", stiffness: 120, damping: 12 }}
          >
            <img
              src={img}
              alt={`event-${i}`}
              className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <motion.div
              className="absolute bottom-4 right-4"
              initial={{ opacity: 0, y: 10 }}
              whileHover={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <FaRegGem className="text-pink-300 text-xl animate-bounce" />
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Wavy Divider Bottom */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        {waveDivider}
      </motion.div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="bg-primary/95 text-white py-14 px-8 text-center rounded-t-3xl mt-12 shadow-2xl border border-primary/40"
        style={{ background: 'linear-gradient(135deg, #be185d 80%, #f59e42 100%)' }}
      >
        <h3 className="text-3xl md:text-4xl font-extrabold mb-4 drop-shadow-lg tracking-tight">
          Ready to Plan Your Perfect Day?
        </h3>
        <p className="mb-8 text-lg font-medium text-white/90 drop-shadow">
          Contact us today and let our experts help you bring your vision to life.
        </p>
        <motion.button
          onClick={() => navigate("/contact")}
          whileHover={{ scale: 1.08, boxShadow: "0 0 24px 4px #fff" }}
          className="inline-block bg-white-200 text-primary px-10 py-4 rounded-full font-bold shadow-lg hover:bg-pink-100 hover:text-pink-700 transition text-xl border-2 border-white/80 drop-shadow-lg"
        >
          Contact Us
        </motion.button>
      </motion.div>
    </div>
  );
};

export default EventWedding;

// import React from "react";
// import { motion } from "framer-motion";
// import { useNavigate } from "react-router-dom";

// const weddingImages = [
//   "/RoomImages/event1.jpg",
//   "/RoomImages/event2.jpg",
//   "/RoomImages/event3.jpg",
//   "/RoomImages/event4.jpg",
// ];

// const fadeUp = {
//   hidden: { opacity: 0, y: 30 },
//   visible: (i) => ({
//     opacity: 1,
//     y: 0,
//     transition: { delay: i * 0.2, duration: 0.6, ease: "easeOut" },
//   }),
// };

// const EventWedding = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="container pt-6 pb-6 bg-gray-50 min-h-screen text-gray-800">
//       {/* Hero Section */}
//       <div
//         className="relative bg-cover bg-center h-[60vh]"
//         style={{ backgroundImage: "url('/RoomImages/event1.jpg')" }}
//       >
//         <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white text-center px-4">
//           <motion.h1
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8 }}
//             className="text-4xl md:text-6xl font-bold mb-4"
//           >
//             Events & Weddings
//           </motion.h1>
//           <motion.p
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.3, duration: 0.8 }}
//             className="max-w-xl text-lg"
//           >
//             Create unforgettable memories at Gouri Inn with elegant venues, top-notch service, and luxury.
//           </motion.p>
//         </div>
//       </div>

//       {/* Description Section */}
//       <motion.div
//         initial="hidden"
//         whileInView="visible"
//         viewport={{ once: true }}
//         variants={fadeUp}
//         custom={0}
//         className="container mx-auto px-6 py-12"
//       >
//         <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-primary">
//           Celebrate With Grace
//         </h2>
//         <p className="text-lg text-center max-w-3xl mx-auto text-gray-600">
//           Our beautifully designed banquet spaces and outdoor venues offer a perfect setting for weddings, receptions, birthdays, and corporate events. Let our expert team take care of everything while you enjoy your special day stress-free.
//         </p>
//       </motion.div>

//       {/* Image Gallery Section */}
//       <div className="container mx-auto px-6 pb-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
//         {weddingImages.map((img, i) => (
//           <motion.div
//             key={i}
//             className="overflow-hidden rounded-2xl shadow-lg"
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true }}
//             variants={fadeUp}
//             custom={i + 1}
//           >
//             <img
//               src={img}
//               alt={`event-${i}`}
//               className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300 ease-in-out"
//             />
//           </motion.div>
//         ))}
//       </div>

//       {/* CTA Section */}
//       <motion.div
//         initial={{ opacity: 0, y: 30 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         viewport={{ once: true }}
//         transition={{ duration: 0.7 }}
//         className="bg-primary text-white py-12 px-6 text-center rounded-t-3xl"
//       >
//         <h3 className="text-2xl md:text-3xl font-semibold mb-4">
//           Ready to Plan Your Perfect Day?
//         </h3>
//         <p className="mb-6">Contact us today and let our experts help you bring your vision to life.</p>
//         <button
//           onClick={() => navigate("/contact")}
//           className="inline-block bg-white text-primary px-6 py-3 rounded-full font-semibold shadow hover:bg-gray-100 transition"
//         >
//           Contact Us
//         </button>
//       </motion.div>
//     </div>
//   );
// };

// export default EventWedding;