import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaGift } from "react-icons/fa";

const offers = [
  {
    id: 1,
    title: "Weekend Stay Offer",
    description: "Book a room for the weekend and get 20% off + complimentary breakfast.",
    image: "/RoomImages/weekend.jpg",
    badge: "Limited Time!"
  },
  {
    id: 2,
    title: "Wedding Package",
    description: "Host your wedding at Gouri Inn and get a luxury suite + banquet discount.",
    image: "/RoomImages/weddingoffer.jpg",
    badge: "Hot Deal"
  },
  {
    id: 3,
    title: "Food Combo Deal",
    description: "Enjoy a family meal combo at our restaurant starting just ₹499.",
    image: "/RoomImages/foodcombo.jpg",
    badge: "Best Value"
  },
];

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

const SpecialOffers = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-pink-50 via-yellow-50 to-orange-100 pt-16 pb-24 px-4 md:px-12 overflow-x-hidden">
      {/* Animated Heading */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring" }}
      >
        <motion.div
          initial={{ scale: 0.7, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.2 }}
          className="flex justify-center mb-2"
        >
          <FaGift className="text-5xl text-orange-400 animate-pulse" />
        </motion.div>
        <motion.h1
          className="text-5xl font-extrabold text-primary mb-4 tracking-tight drop-shadow-lg"
          initial={{ letterSpacing: "0.1em" }}
          animate={{ letterSpacing: "0.05em" }}
          transition={{ duration: 1.2, delay: 0.3 }}
        >
          Special Offers
        </motion.h1>
        <motion.p
          className="text-gray-600 max-w-2xl mx-auto text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
        >
          Discover our exclusive deals tailored to make your stay more rewarding.
        </motion.p>
      </motion.div>

      {/* Wavy Divider */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        {waveDivider}
      </motion.div>

      {/* Offer Cards */}
      <div className="relative z-10 grid md:grid-cols-3 gap-10 mt-8">
        {offers.map((offer, index) => (
          <motion.div
            key={offer.id}
            className="group bg-white/80 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition duration-300 border border-orange-100 relative"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2 + 0.3, duration: 0.7, type: "spring" }}
            whileHover={{ scale: 1.06, rotate: (index % 2 === 0 ? 2 : -2), boxShadow: "0 8px 32px 0 rgba(255, 140, 0, 0.15)" }}
          >
            <div className="relative">
              <img
                src={offer.image}
                alt={offer.title}
                className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {/* Animated Badge */}
              <motion.div
                className="absolute top-4 left-4"
                initial={{ opacity: 0, y: -10 }}
                whileHover={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="bg-gradient-to-r from-orange-400 to-pink-400 text-white px-4 py-1 rounded-full text-xs font-bold shadow animate-pulse">
                  {offer.badge}
                </span>
              </motion.div>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-primary mb-2 group-hover:text-orange-500 transition-colors duration-300">
                {offer.title}
              </h3>
              <p className="text-gray-600 text-base mb-4">{offer.description}</p>
              <motion.button
                onClick={() => navigate("/book")}
                whileHover={{ scale: 1.08, boxShadow: "0 0 24px 4px #f59e42" }}
                className="bg-gradient-to-r from-orange-400 to-pink-400 text-white px-6 py-2 rounded-full shadow-lg font-semibold hover:from-orange-500 hover:to-pink-500 transition-all duration-300 text-base animate-pulse"
              >
                Book Now
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Wavy Divider Bottom */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="mt-16"
      >
        {waveDivider}
      </motion.div>

      {/* CTA Section */}
      <motion.div
        className="text-center mt-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-primary mb-4">Don't Miss Out!</h2>
        <p className="text-gray-600 max-w-xl mx-auto">
          Offers valid for a limited time only. Reserve today and enjoy premium hospitality at unbeatable prices.
        </p>
      </motion.div>
    </div>
  );
};

export default SpecialOffers;

// import React from "react";
// import { motion } from "framer-motion";
// import { useNavigate } from "react-router-dom";

// const offers = [
//   {
//     id: 1,
//     title: "Weekend Stay Offer",
//     description: "Book a room for the weekend and get 20% off + complimentary breakfast.",
//     image: "/RoomImages/weekend.jpg",
//   },
//   {
//     id: 2,
//     title: "Wedding Package",
//     description: "Host your wedding at Gouri Inn and get a luxury suite + banquet discount.",
//     image: "/RoomImages/weddingoffer.jpg",
//   },
//   {
//     id: 3,
//     title: "Food Combo Deal",
//     description: "Enjoy a family meal combo at our restaurant starting just ₹499.",
//     image: "/RoomImages/foodcombo.jpg",
//   },
// ];

// const SpecialOffers = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="bg-white pt-16 pb-24 px-4 md:px-12">
//       <motion.div
//         className="text-center mb-12"
//         initial={{ opacity: 0, y: 20 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         viewport={{ once: true }}
//         transition={{ duration: 0.6 }}
//       >
//         <h1 className="text-4xl font-bold text-primary mb-4">Special Offers</h1>
//         <p className="text-gray-600 max-w-2xl mx-auto">
//           Discover our exclusive deals tailored to make your stay more rewarding.
//         </p>
//       </motion.div>

//       <div className="grid md:grid-cols-3 gap-8">
//         {offers.map((offer, index) => (
//           <motion.div
//             key={offer.id}
//             className="bg-gray-50 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300"
//             initial={{ opacity: 0, y: 30 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ delay: index * 0.2, duration: 0.5 }}
//           >
//             <img
//               src={offer.image}
//               alt={offer.title}
//               className="w-full h-56 object-cover"
//             />
//             <div className="p-6">
//               <h3 className="text-xl font-semibold text-primary">{offer.title}</h3>
//               <p className="text-gray-600 text-sm mb-4">{offer.description}</p>
//               <button
//                 onClick={() => navigate("/book")}
//                 className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition duration-300"
//               >
//                 Book Now
//               </button>
//             </div>
//           </motion.div>
//         ))}
//       </div>

//       <motion.div
//         className="text-center mt-16"
//         initial={{ opacity: 0 }}
//         whileInView={{ opacity: 1 }}
//         viewport={{ once: true }}
//         transition={{ duration: 0.5 }}
//       >
//         <h2 className="text-2xl font-bold text-primary mb-4">Don't Miss Out!</h2>
//         <p className="text-gray-600 max-w-xl mx-auto">
//           Offers valid for a limited time only. Reserve today and enjoy premium hospitality at unbeatable prices.
//         </p>
//       </motion.div>
//     </div>
//   );
// };

// export default SpecialOffers;
