import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { GiBowlOfRice } from "react-icons/gi";
import SEOHead from "../SEO/SEOHead";

const rooms = [
  {
    id: 1,
    title: "President Suite",
    description:
      "Two-Bed or One-bed Suites are sanctuaries of contemporary style and comfort, affording plenty of privacy for the most restful, relaxed and productive stay. With plush furnishings in the living area and upscale features such as modern washroom hot water cold water shower, Home docking stations plus dramatic views.",
    image: "/RoomImages/President-suite.jpg",
  },
  {
    id: 2,
    title: "Maharaja Suite",
    description:
      "Suite designed keeping in view with the modern day Business Traveler providing them with a complementary tea / coffee. All Rooms are WI-FI enabled to keep in touch with business world. Colored TVs for news channels & other entertainment Cable channels too are provided in the Rooms..",
    image: "/RoomImages/maharaja-suites.jpg",
  },
  {
    id: 3,
    title: "Family Suite",
    description:
      "Multiple beds for maximum comfort (ideal for 3–5 guests ,A separate seating area for family gatherings or relaxation Modern amenities including air-conditioning, flat-screen TV, free Wi-Fi, and a mini-fridge Attached private bathroom with hot & cold water, premium toiletries, and 24/7 room service Elegant interiors and ample natural light to make you feel at home..",
    image: "/RoomImages/Family-suite.jpg",
  },
  {
    id: 4,
    title: "Super Deluxe",
    description:
      "The Super Deluxe rooms are designed for comfort and economical stay in Amravati. Premium Rooms are ideal for the business travelers who are looking for Budget. what it takes to be like a world class living destination, besides peaceful stay we provide bed and breakfast and wifi to ensure..",
    image: "/RoomImages/super-delux.jpg",
  },
  {
    id: 5,
    title: "Executive Suite",
    description:
      "The Executive Suite at Gouri Inn, Amravati offers a refined stay for guests who seek luxury, privacy, and superior comfort. Thoughtfully designed for business travelers and discerning guests, this suite features a spacious layout with a king-sized bed, dedicated work desk, complimentary toiletries. Whether you're here for business or leisure, the Executive Suite provides a peaceful, upscale environment for both work and relaxation...",
    image: "/RoomImages/executive-suite.jpg",
  },
];

// SEO structured data for rooms page
const roomsStructuredData = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Luxury Hotel Rooms & Suites",
  description:
    "Explore our premium accommodations including Deluxe Rooms, Executive Suites, and Family Suites at StayLuxe Hotel",
  url: "https://your-domain.com/Rooms",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      item: {
        "@type": "Product",
        name: "Deluxe Room",
        description:
          "Spacious room with king-sized bed, free Wi-Fi, and city view",
        image: "https://your-domain.com/RoomImages/deluxe.jpg",
        offers: {
          "@type": "Offer",
          availability: "https://schema.org/InStock",
          priceCurrency: "INR",
          price: "5000",
        },
      },
    },
    {
      "@type": "ListItem",
      position: 2,
      item: {
        "@type": "Product",
        name: "Executive Suite",
        description:
          "Includes a private lounge, workspace, and complimentary minibar",
        image: "https://your-domain.com/RoomImages/executive.jpg",
        offers: {
          "@type": "Offer",
          availability: "https://schema.org/InStock",
          priceCurrency: "INR",
          price: "8000",
        },
      },
    },
    {
      "@type": "ListItem",
      position: 3,
      item: {
        "@type": "Product",
        name: "Family Suite",
        description:
          "Perfect for families, includes 2 bedrooms, kids area, and dining table",
        image: "https://your-domain.com/RoomImages/family.jpg",
        offers: {
          "@type": "Offer",
          availability: "https://schema.org/InStock",
          priceCurrency: "INR",
          price: "12000",
        },
      },
    },
  ],
};

const wavePath1 = [
  "M0,80 C360,160 1080,0 1440,80 L1440,160 L0,160 Z",
  "M0,90 C360,140 1080,20 1440,90 L1440,160 L0,160 Z",
  "M0,80 C360,160 1080,0 1440,80 L1440,160 L0,160 Z",
  "M0,70 C360,180 1080,-20 1440,70 L1440,160 L0,160 Z",
  "M0,80 C360,160 1080,0 1440,80 L1440,160 L0,160 Z",
];
const wavePath2 = [
  "M0,120 C480,40 960,200 1440,120 L1440,160 L0,160 Z",
  "M0,130 C480,60 960,180 1440,130 L1440,160 L0,160 Z",
  "M0,120 C480,40 960,200 1440,120 L1440,160 L0,160 Z",
  "M0,110 C480,20 960,220 1440,110 L1440,160 L0,160 Z",
  "M0,120 C480,40 960,200 1440,120 L1440,160 L0,160 Z",
];
const wavePath3 = [
  "M0,100 Q720,180 1440,100 L1440,160 L0,160 Z",
  "M0,110 Q720,170 1440,110 L1440,160 L0,160 Z",
  "M0,100 Q720,180 1440,100 L1440,160 L0,160 Z",
  "M0,90 Q720,190 1440,90 L1440,160 L0,160 Z",
  "M0,100 Q720,180 1440,100 L1440,160 L0,160 Z",
];

const waveAnim = {
  animate: {
    d: wavePath1,
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};
const waveAnim2 = {
  animate: {
    d: wavePath2,
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};
const waveAnim3 = {
  animate: {
    d: wavePath3,
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
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
        <linearGradient
          id="waveGradient1"
          x1="0"
          y1="0"
          x2="1440"
          y2="0"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#3b82f6" />
          <stop offset="1" stopColor="#8b5cf6" />
        </linearGradient>
        <linearGradient
          id="waveGradient2"
          x1="0"
          y1="0"
          x2="1440"
          y2="0"
          gradientUnits="userSpaceOnUse"
        >
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
        <feGaussianBlur stdDeviation="12" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
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

const Rooms = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#181c2b] via-[#232946] to-[#1a1a2e] pt-16 pb-24 px-4 md:px-12 overflow-x-hidden text-white">
      <SEOHead
        title="Guest Rooms | StayLuxe Hotel"
        description="Experience comfort and elegance with our luxurious room options, designed for your ultimate relaxation and memorable stay."
        keywords="luxury hotel rooms, executive suites, family suites, hotel accommodations, hotel rooms, hotel stay"
        structuredData={roomsStructuredData}
      />
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
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 10,
            delay: 0.2,
          }}
          className="flex justify-center mb-2"
        >
          <GiBowlOfRice className="text-5xl text-blue-400 animate-pulse" />
        </motion.div>
        <motion.h1
          className="text-5xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4 tracking-tight drop-shadow-lg"
          initial={{ letterSpacing: "0.1em" }}
          animate={{ letterSpacing: "0.05em" }}
          transition={{ duration: 1.2, delay: 0.3 }}
        >
          Guest Rooms
        </motion.h1>
        <motion.p
          className="text-gray-300 max-w-2xl mx-auto text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
        >
          Experience comfort and elegance with our luxurious room options,
          designed for your ultimate relaxation and memorable stay.
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

      {/* Room Cards */}
      <div className="relative z-10 grid gap-10 md:grid-cols-3 mt-8">
        {rooms.map((room, index) => (
          <motion.div
            key={room.id}
            className="group bg-[#232946] rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition duration-300 border border-blue-900/40 relative"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              delay: index * 0.2 + 0.3,
              duration: 0.7,
              type: "spring",
            }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 8px 32px 0 rgba(59, 130, 246, 0.15)",
            }}
          >
            <div className="relative">
              <img
                src={room.image}
                alt={room.title}
                className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-blue-200 mb-2 group-hover:text-blue-400 transition-colors duration-300">
                {room.title}
              </h3>
              <p className="text-gray-300 text-base mb-4">{room.description}</p>
              <motion.button
                onClick={() => navigate("/book")}
                whileHover={{ scale: 1.08, boxShadow: "0 0 24px 4px #6366f1" }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full shadow-lg font-semibold hover:from-blue-500 hover:to-purple-500 transition-all duration-300 text-base animate-pulse"
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
        <h2 className="text-3xl font-bold text-blue-200 mb-4">
          Need help choosing the perfect room for your stay?
        </h2>
        <p className="text-gray-300 max-w-xl mx-auto mb-6">
          Contact us today and let our experts help you find the best option for
          your needs.
        </p>
        <motion.button
          onClick={() => navigate("/contact")}
          whileHover={{ scale: 1.08, boxShadow: "0 0 24px 4px #6366f1" }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full shadow-lg font-semibold hover:from-blue-500 hover:to-purple-500 transition-all duration-300 text-lg animate-pulse"
        >
          Contact Us for Assistance
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Rooms;

// import React from "react";
// import { motion } from "framer-motion";
// import { useNavigate } from "react-router-dom";

// const rooms = [
//   {
//     id: 1,
//     title: "Deluxe Room",
//     description: "Spacious room with king-sized bed, free Wi-Fi, and city view.",
//     image: "/RoomImages/deluxe.jpg",
//   },
//   {
//     id: 2,
//     title: "Executive Suite",
//     description: "Includes a private lounge, workspace, and complimentary minibar.",
//     image: "/RoomImages/executive.jpg",
//   },
//   {
//     id: 3,
//     title: "Family Suite",
//     description: "Perfect for families, includes 2 bedrooms, kids area, and dining table.",
//     image: "/RoomImages/family.jpg",
//   },
// ];

// const GuestRooms = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white overflow-hidden relative">
//       {/* Animated Background Elements */}
//       <div className="absolute inset-0 overflow-hidden">
//         <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-500 rounded-full opacity-10 blur-3xl animate-pulse"></div>
//         <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500 rounded-full opacity-10 blur-3xl animate-pulse delay-1000"></div>
//         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-400 rounded-full opacity-5 blur-3xl animate-pulse delay-500"></div>
//       </div>

//       <div className="relative z-10 pt-16 pb-24 px-4 sm:px-6 lg:px-12">
//         {/* Header Section */}
//         <motion.div
//           className="text-center mb-16 max-w-4xl mx-auto"
//           initial={{ opacity: 0, y: 30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.8, ease: "easeOut" }}
//         >
//           <motion.div
//             className="inline-block mb-4"
//             initial={{ scale: 0.9, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             transition={{ delay: 0.2, duration: 0.6 }}
//           >
//             <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6 leading-tight">
//               Guest Rooms
//             </h1>
//           </motion.div>

//           <motion.p
//             className="text-gray-300 text-lg sm:text-xl lg:text-2xl leading-relaxed max-w-3xl mx-auto"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.4, duration: 0.6 }}
//           >
//             Experience comfort and elegance with our luxurious room options, designed for your ultimate relaxation and memorable stay.
//           </motion.p>

//           {/* Decorative Line */}
//           <motion.div
//             className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-8 rounded-full"
//             initial={{ scaleX: 0 }}
//             animate={{ scaleX: 1 }}
//             transition={{ delay: 0.6, duration: 0.8 }}
//           />
//         </motion.div>

//         {/* Rooms Grid */}
//         <div className="max-w-7xl mx-auto">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
//             {rooms.map((room, index) => (
//               <motion.div
//                 key={room.id}
//                 className="group bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 border border-white/20 hover:border-white/40"
//                 initial={{ opacity: 0, y: 50, scale: 0.9 }}
//                 whileInView={{ opacity: 1, y: 0, scale: 1 }}
//                 viewport={{ once: true, margin: "-50px" }}
//                 transition={{
//                   delay: index * 0.2,
//                   duration: 0.7,
//                   ease: "easeOut"
//                 }}
//                 whileHover={{
//                   y: -10,
//                   scale: 1.02,
//                   transition: { duration: 0.3 }
//                 }}
//               >
//                 {/* Image Section */}
//                 <div className="relative overflow-hidden">
//                   <motion.img
//                     src={room.image}
//                     alt={room.title}
//                     className="w-full h-56 sm:h-64 lg:h-72 object-cover group-hover:scale-110 transition-transform duration-700"
//                     whileHover={{ scale: 1.1 }}
//                     transition={{ duration: 0.6 }}
//                   />
//                   {/* Overlay Gradient */}
//                   <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

//                   {/* Floating Badge */}
//                   <motion.div
//                     className="absolute top-4 right-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg"
//                     initial={{ scale: 0, opacity: 0 }}
//                     animate={{ scale: 1, opacity: 1 }}
//                     transition={{ delay: index * 0.2 + 0.5, duration: 0.4 }}
//                   >
//                     Room {room.id}
//                   </motion.div>
//                 </div>

//                 {/* Content Section */}
//                 <div className="p-6 sm:p-8">
//                   <motion.h3
//                     className="text-xl sm:text-2xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors duration-300"
//                     initial={{ opacity: 0, x: -20 }}
//                     whileInView={{ opacity: 1, x: 0 }}
//                     transition={{ delay: index * 0.2 + 0.3, duration: 0.5 }}
//                   >
//                     {room.title}
//                   </motion.h3>

//                   <motion.p
//                     className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6 line-clamp-3"
//                     initial={{ opacity: 0, x: -20 }}
//                     whileInView={{ opacity: 1, x: 0 }}
//                     transition={{ delay: index * 0.2 + 0.4, duration: 0.5 }}
//                   >
//                     {room.description}
//                   </motion.p>

//                   {/* Book Now Button */}
//                   <motion.button
//                     onClick={() => navigate("/book")}
//                     className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50"
//                     initial={{ opacity: 0, y: 20 }}
//                     whileInView={{ opacity: 1, y: 0 }}
//                     transition={{ delay: index * 0.2 + 0.5, duration: 0.5 }}
//                     whileHover={{
//                       scale: 1.05,
//                       boxShadow: "0 12px 32px rgba(59, 130, 246, 0.4)"
//                     }}
//                     whileTap={{ scale: 0.98 }}
//                   >
//                     Book Now
//                   </motion.button>
//                 </div>

//                 {/* Hover Effect Border */}
//                 <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
//               </motion.div>
//             ))}
//           </div>
//         </div>

//         {/* Bottom CTA Section */}
//         <motion.div
//           className="text-center mt-20 max-w-4xl mx-auto"
//           initial={{ opacity: 0, y: 30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ delay: 0.8, duration: 0.6 }}
//         >
//           <motion.p
//             className="text-gray-300 text-lg sm:text-xl mb-8"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 1, duration: 0.6 }}
//           >
//             Need help choosing the perfect room for your stay?
//           </motion.p>

//           <motion.button
//             onClick={() => navigate("/contact")}
//             className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-2 border-white/30 hover:border-white/50 px-8 py-3 rounded-xl font-semibold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white/20"
//             whileHover={{
//               scale: 1.05,
//               y: -2,
//               boxShadow: "0 8px 25px rgba(255, 255, 255, 0.1)"
//             }}
//             whileTap={{ scale: 0.98 }}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 1.2, duration: 0.6 }}
//           >
//             Contact Us for Assistance
//           </motion.button>
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default GuestRooms;
