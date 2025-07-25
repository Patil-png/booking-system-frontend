import React, { useState } from "react";
import { FaStar, FaUserFriends, FaAward, FaMapPin, FaUtensils, FaSpa, FaWifi, FaParking, FaBed, FaCoffee, FaSearchPlus, FaQuoteRight } from "react-icons/fa";
import { motion } from "framer-motion";

function Home() {
  const [selectedImage, setSelectedImage] = useState(null);

  // Demo data for stats
  const heroStats = [
    { icon: <FaStar className="text-[#f5c443] text-2xl xs:text-3xl md:text-4xl" />, value: "4.9", label: "Guest Rating" },
    { icon: <FaUserFriends className="text-[#f5c443] text-2xl xs:text-3xl md:text-4xl" />, value: "10K+", label: "Happy Guests" },
    { icon: <FaAward className="text-[#f5c443] text-2xl xs:text-3xl md:text-4xl" />, value: "25+", label: "Awards Won" },
    { icon: <FaMapPin className="text-[#f5c443] text-2xl xs:text-3xl md:text-4xl" />, value: "Prime", label: "Location" },
  ];
  // Add testimonials array
  const testimonials = [
    {
      text: "Absolutely exceptional service! The attention to detail and luxury amenities exceeded all my expectations. The spa was divine and the staff went above and beyond to make my stay memorable.",
      author: "Sarah Mitchell",
      role: "Business Executive",
      location: "New York, USA",
    },
    {
      text: "I've stayed at luxury hotels worldwide, but StayLuxe sets a new standard. The Presidential Suite was breathtaking, and the concierge service was impeccable. Truly a five-star experience.",
      author: "James Rodriguez",
      role: "Travel Blogger",
      location: "Barcelona, Spain",
    },
    {
      text: "Our wedding celebration at StayLuxe was magical. The event coordination was flawless, the venue was stunning, and every guest was thoroughly impressed. Highly recommend for special occasions.",
      author: "Emily Chen",
      role: "Wedding Planner",
      location: "Singapore",
    },
  ];

  // New data for more amenities
  const moreAmenities = [
    { icon: <FaUtensils />, title: "Entertainment Center", desc: "Gaming lounge and entertainment facilities" },
    { icon: <FaBed />, title: "Kids Club", desc: "Safe and fun activities for children" },
    { icon: <FaCoffee />, title: "Business Center", desc: "Fully equipped workspace and meeting rooms" },
    { icon: <FaStar />, title: "VIP Services", desc: "Personalized concierge and luxury services" },
    { icon: <FaMapPin />, title: "Express Check-in", desc: "Skip the lines with priority service" },
  ];

  return (
    <div className="font-sans min-h-screen bg-[#f8f5f0]">
      {/* HERO SECTION */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, delay: 0 }}
        className="relative min-h-[70vh] flex flex-col justify-center items-center text-center overflow-hidden font-sans bg-[#3d2c1e]"
      >
        {/* Background image (royalty-free from Unsplash) */}
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb" alt="Luxury Hotel" className="w-full h-full object-cover" style={{objectPosition: 'center', opacity: 0.5}} />
        </div>
        {/* Brown overlay */}
        <div className="absolute inset-0 bg-[#4b3725]/80 z-10"></div>
        <div className="relative z-20 w-full flex flex-col items-center justify-center pt-16 pb-8 px-4 sm:pt-24 sm:pb-16">
          <h1 className="font-serif font-extrabold uppercase tracking-tight leading-tight text-white drop-shadow-lg text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-2" style={{textShadow: '0 4px 24px #000, 0 2px 0 #b88a2b'}}>
            Experience
            <br />
            <span className="block text-[#f5c443]" style={{textShadow: '0 2px 8px #b88a2b'}}>Luxury Redefined</span>
          </h1>
          <p className="font-sans text-base xs:text-lg sm:text-xl md:text-2xl max-w-2xl mx-auto mt-2 mb-8 font-light tracking-wide text-[#ede6dd] leading-relaxed drop-shadow" style={{textShadow: '0 2px 8px #000'}}>Indulge in unparalleled comfort and sophistication at our award-winning hotel, where every moment becomes a cherished memory.</p>
          <div className="flex flex-col w-full max-w-xs gap-3 sm:flex-row sm:max-w-none sm:w-auto sm:gap-6 justify-center">
            <motion.button
              whileHover={{ scale: 1.05, y: -3 }}
              className="w-full sm:w-auto bg-[#f5c443] text-[#3d2c1e] px-6 py-3 sm:px-8 sm:py-3 rounded-full font-semibold text-base xs:text-lg sm:text-xl shadow-lg hover:bg-[#b88a2f] border-2 border-[#f5c443] hover:border-white transition-all duration-300"
              onClick={() => window.location.href = '/room-booking'}
            >
              Book Your Stay
            </motion.button>
          <motion.button
              whileHover={{ scale: 1.05, y: -3 }}
              className="w-full sm:w-auto bg-[#f8f5f0] text-[#7a5a2f] px-6 py-3 sm:px-8 sm:py-3 rounded-full font-semibold text-base xs:text-lg sm:text-xl shadow-lg border-2 border-[#b88a2f] hover:bg-[#ede6dd]/90 hover:text-[#3d2c1e] transition-all duration-300"
              onClick={() => window.location.href = '/Rooms'}
            >
              Explore Rooms
          </motion.button>
          </div>
        </div>
        {/* STATS CARDS */}
        <div className="relative z-20 w-full flex justify-center pb-8 px-2">
          <div className="grid grid-cols-2 gap-3 xs:gap-4 sm:gap-8 w-full max-w-xs sm:max-w-5xl sm:grid-cols-4">
            {[0,1,3,'best'].map((idx, i) => (
              <motion.div
                key={idx}
                className="bg-[#2d2217] rounded-xl p-3 xs:p-4 sm:p-6 flex flex-col items-center shadow border border-[#b88a2f] min-w-0"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ scale: 1.04, y: -4 }}
              >
                {idx === 'best' ? (
                  <>
                    <FaStar className="text-[#f5c443] text-2xl xs:text-3xl md:text-4xl" />
                    <div className="text-base xs:text-lg sm:text-xl font-bold text-[#f5c443] mt-1 xs:mt-2">Best Rooms</div>
                    <div className="text-xs xs:text-sm sm:text-base text-white mt-0.5 xs:mt-1">Top-rated luxury suites</div>
                  </>
                ) : (
                  <>
                    <div>{heroStats[idx].icon}</div>
                    <div className="text-base xs:text-lg sm:text-xl font-bold text-[#f5c443] mt-1 xs:mt-2">{heroStats[idx].value}</div>
                    <div className="text-xs xs:text-sm sm:text-base text-white mt-0.5 xs:mt-1">{heroStats[idx].label}</div>
                  </>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* FEATURES GRID */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="py-14 bg-[#f8f5f0] px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="font-extrabold text-[#222] text-2xl sm:text-3xl md:text-4xl leading-tight text-center mb-2">
            Why Choose <span className="text-[#7a5a2f]">StayLuxe</span>
          </h2>
          <p className="text-[#6b5b4a] mb-10 max-w-2xl mx-auto text-base sm:text-lg">
            Discover the exceptional features and services that make us the premier choice for discerning travelers seeking luxury and comfort.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <FaUtensils />, title: "Fine Dining", desc: "Award-winning restaurants with world-class cuisine.", badge: "Michelin Star" },
              { icon: <FaSpa />, title: "Spa & Wellness", desc: "Rejuvenating treatments and wellness programs.", badge: "Premium" },
              { icon: <FaCoffee />, title: "Fitness Center", desc: "State-of-the-art equipment and personal trainers.", badge: "24/7" },
              { icon: <FaWifi />, title: "High-Speed WiFi", desc: "Complimentary ultra-fast internet throughout.", badge: "Free" },
              { icon: <FaParking />, title: "Valet Parking", desc: "Complimentary valet service for all guests.", badge: "Included" },
              { icon: <FaBed />, title: "24/7 Security", desc: "Round-the-clock security for your peace of mind.", badge: "Secure" },
              { icon: <FaUtensils />, title: "Room Service", desc: "Gourmet dining delivered to your door anytime.", badge: "24/7" },
              { icon: <FaCoffee />, title: "Housekeeping", desc: "Daily housekeeping with luxury amenities.", badge: "Daily" },
            ].map((f, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-[#e0cba8] shadow-sm p-5 sm:p-6 flex flex-col items-center relative min-h-[240px]">
                <div className="absolute top-4 right-4">
                  <span className="bg-[#f5c443] text-[#7a5a2f] text-xs font-bold px-3 py-1 rounded-full shadow">{f.badge}</span>
                  </div>
                <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#7a5a2f] mb-4">
                  {React.cloneElement(f.icon, { className: "text-white text-2xl sm:text-3xl md:text-4xl" })}
                </div>
                <h3 className="font-bold text-[#222] text-lg sm:text-xl md:text-2xl mb-2 mt-1">{f.title}</h3>
                <p className="text-[#6b5b4a] text-sm sm:text-base md:text-[1.05rem]">{f.desc}</p>
              </div>
          ))}
          </div>
        </div>
      </motion.section>

      {/* HIGHLIGHTS SECTION */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="py-14 bg-[#fff] px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto text-center mb-10">
          <span className="inline-block bg-[#fdf6e3] text-[#b88a2b] text-sm font-semibold px-4 py-1 rounded-full mb-2">Premium Amenities</span>
          <h2 className="font-extrabold text-[#222] text-2xl sm:text-3xl md:text-4xl leading-tight text-center mb-2">
            Unparalleled <span className="text-[#7a5a2f]">Luxury</span>
          </h2>
          <p className="text-[#6b5b4a] max-w-2xl mx-auto text-base sm:text-lg mb-8">
            Immerse yourself in a world of sophistication with our carefully curated amenities designed to exceed your every expectation.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* The original highlights array was removed, so this section will be empty or need to be re-added */}
          {/* For now, keeping the structure but noting the missing data */}
          <motion.div
            key={0}
            className="bg-white rounded-xl shadow-lg border border-[#e0cba8] overflow-hidden flex flex-col"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0 * 0.15, ease: [0.6, -0.05, 0.01, 0.99] }}
            whileHover={{ scale: 1.04, y: -6 }}
          >
            <div className="relative">
              <img src="/RoomImages/deluxe.jpg" alt="Presidential Suite" className="w-full h-56 object-cover" />
              <div className="absolute top-4 left-4 bg-[#f5c443] text-[#3d2c1e] text-xs font-bold px-3 py-1 rounded-full shadow">Exclusive</div>
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-lg font-heading font-semibold mb-2 text-[#b88a2b]">Presidential Suite</h3>
              <p className="text-[#3d2c1e]/80 text-sm mb-3">Ultimate luxury with panoramic city views.</p>
              <div className="flex flex-wrap gap-2 mt-auto">
                <span className="bg-[#e0cba8] text-[#3d2c1e] text-xs px-2 py-1 rounded-full">3000 sq ft</span>
                <span className="bg-[#e0cba8] text-[#3d2c1e] text-xs px-2 py-1 rounded-full">Private Terrace</span>
                <span className="bg-[#e0cba8] text-[#3d2c1e] text-xs px-2 py-1 rounded-full">Butler Service</span>
              </div>
            </div>
          </motion.div>
          <motion.div
            key={1}
            className="bg-white rounded-xl shadow-lg border border-[#e0cba8] overflow-hidden flex flex-col"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 1 * 0.15, ease: [0.6, -0.05, 0.01, 0.99] }}
            whileHover={{ scale: 1.04, y: -6 }}
          >
            <div className="relative">
              <img src="/RoomImages/event1.jpg" alt="Gourmet Dining" className="w-full h-56 object-cover" />
              <div className="absolute top-4 left-4 bg-[#f5c443] text-[#3d2c1e] text-xs font-bold px-3 py-1 rounded-full shadow">Award Winning</div>
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-lg font-heading font-semibold mb-2 text-[#b88a2b]">Gourmet Dining</h3>
              <p className="text-[#3d2c1e]/80 text-sm mb-3">World-class cuisine by renowned chefs.</p>
              <div className="flex flex-wrap gap-2 mt-auto">
                <span className="bg-[#e0cba8] text-[#3d2c1e] text-xs px-2 py-1 rounded-full">Michelin Star</span>
                <span className="bg-[#e0cba8] text-[#3d2c1e] text-xs px-2 py-1 rounded-full">Wine Cellar</span>
                <span className="bg-[#e0cba8] text-[#3d2c1e] text-xs px-2 py-1 rounded-full">Private Dining</span>
              </div>
            </div>
          </motion.div>
            <motion.div
            key={2}
            className="bg-white rounded-xl shadow-lg border border-[#e0cba8] overflow-hidden flex flex-col"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 2 * 0.15, ease: [0.6, -0.05, 0.01, 0.99] }}
            whileHover={{ scale: 1.04, y: -6 }}
          >
            <div className="relative">
              <img src="/RoomImages/suite.jpg" alt="Luxury Spa" className="w-full h-56 object-cover" />
              <div className="absolute top-4 left-4 bg-[#f5c443] text-[#3d2c1e] text-xs font-bold px-3 py-1 rounded-full shadow">Premium</div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-lg font-heading font-semibold mb-2 text-[#b88a2b]">Luxury Spa</h3>
              <p className="text-[#3d2c1e]/80 text-sm mb-3">Rejuvenating treatments and wellness programs.</p>
              <div className="flex flex-wrap gap-2 mt-auto">
                <span className="bg-[#e0cba8] text-[#3d2c1e] text-xs px-2 py-1 rounded-full">Healing Therapies</span>
                <span className="bg-[#e0cba8] text-[#3d2c1e] text-xs px-2 py-1 rounded-full">Infinity Pool</span>
                <span className="bg-[#e0cba8] text-[#3d2c1e] text-xs px-2 py-1 rounded-full">Meditation Garden</span>
              </div>
              </div>
            </motion.div>
        </div>
      </motion.section>

      {/* MORE AMENITIES SECTION */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="py-10 bg-[#f8f5f0] px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto bg-white rounded-2xl p-4 sm:p-8 md:p-12">
          <h2 className="font-extrabold text-[#222] text-2xl sm:text-3xl md:text-4xl leading-tight text-center mb-2">And Much More...</h2>
          <p className="text-[#6b5b4a] max-w-2xl mx-auto text-base sm:text-lg mb-8 text-center">Discover additional services and facilities that make your stay extraordinary</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
            {moreAmenities.map((a, idx) => (
            <motion.div
                key={idx}
                className="bg-white rounded-xl p-4 sm:p-6 flex items-center gap-4 shadow border border-[#e0cba8]"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ scale: 1.03, y: -4 }}
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#7a5a2f]">
                  {React.cloneElement(a.icon, { className: "text-white text-xl sm:text-2xl" })}
              </div>
                <div>
                  <div className="font-bold text-[#222] text-base sm:text-lg">{a.title}</div>
                  <div className="text-xs sm:text-sm text-[#6b5b4a]">{a.desc}</div>
              </div>
            </motion.div>
          ))}
          </div>
          <div className="flex justify-center">
            <motion.button
              className="w-full sm:w-auto bg-[#7a5a2f] text-white font-bold px-6 py-2 sm:py-3 rounded-full shadow hover:bg-[#b88a2b] border-2 border-[#7a5a2f] hover:border-[#b88a2b] transition-all duration-300 text-base sm:text-lg"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => window.location.href = '/gallery'}
            >
              View Complete Amenities List
            </motion.button>
          </div>
        </div>
      </motion.section>

      {/* TESTIMONIALS SECTION */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="py-14 bg-[#f8f5f0] px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto text-center mb-10">
          <span className="inline-block bg-[#fdf6e3] text-[#b88a2b] text-sm font-semibold px-4 py-1 rounded-full mb-2">Guest Reviews</span>
          <h2 className="font-extrabold text-[#222] text-2xl sm:text-3xl md:text-4xl leading-tight">
            What Our Guests<br />
            <span className="text-[#7a5a2f]">Say</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {[0,1,2].map(idx => (
            <div key={idx} className="bg-white rounded-xl border border-[#e0cba8] shadow-sm p-4 xs:p-6 flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-2">
                <FaQuoteRight className="text-[#b88a2b] text-2xl xs:text-3xl" />
                <div className="flex gap-1 text-[#f5c443] text-base xs:text-lg">{[...Array(5)].map((_, i) => <FaStar key={i} />)}</div>
              </div>
              <p className="italic text-[#3d2c1e] text-sm xs:text-base sm:text-[1.05rem] md:text-base mb-4 leading-relaxed">{testimonials[idx].text}</p>
              <div className="flex items-center gap-3 mt-auto">
                <div className="bg-[#7a5a2f] text-white font-bold rounded-full w-10 h-10 flex items-center justify-center text-base xs:text-lg">{testimonials[idx].author.split(' ').map(n => n[0]).join('')}</div>
                <div className="flex flex-col items-start">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#222] text-sm xs:text-base">{testimonials[idx].author}</span>
                    <span className="bg-[#f5c443] text-[#7a5a2f] text-xs font-semibold px-2 py-0.5 rounded-full">Verified</span>
                  </div>
                  <div className="text-xs text-[#6b5b4a] mt-0.5">{testimonials[idx].role}<br />{testimonials[idx].location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* CTA SECTION */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, delay: 0.5 }}
        className="py-10 bg-white px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-4xl mx-auto text-center rounded-2xl shadow-lg border border-[#e0cba8] p-6 sm:p-10 bg-white">
          <div className="text-xl font-bold mb-2 text-[#3d2c1e] sm:text-[#b88a2b]">Ready to Create Your Own Story?</div>
          <div className="mb-6 text-[#6b5b4a] text-sm sm:text-base">Join thousands of satisfied guests and experience the luxury that has earned us countless five-star reviews and recommendations.</div>
          <div className="flex flex-col gap-3 w-full max-w-xs mx-auto sm:flex-row sm:max-w-none sm:w-auto sm:gap-4 justify-center">
            <button
              className="w-full sm:w-auto bg-[#7a5a2f] text-white font-bold px-8 py-3 rounded-full shadow hover:bg-[#b88a2b] border-2 border-[#7a5a2f] hover:border-[#b88a2b] transition-all duration-300 text-base"
              onClick={() => window.location.href = '/room-booking'}
            >
              Book Your Stay
            </button>
            {/* Removed Read All Reviews button */}
          </div>
        </div>
      </motion.section>
    </div>
  );
}

export default Home;



// import React, { useEffect, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   FaWifi,
//   FaParking,
//   FaSpa,
//   FaCoffee,
//   FaMapMarkerAlt,
//   FaBed,
//   FaUtensils,
//   FaQuoteRight,
//   FaSearchPlus,
// } from "react-icons/fa";

// export default function TajStyleHome() {
//   const [scrolled, setScrolled] = useState(false);
//   const [selectedImage, setSelectedImage] = useState(null); // ✅ FIXED: removed TS

//   useEffect(() => {
//     function onScroll() {
//       setScrolled(window.scrollY > 50);
//     }
//     window.addEventListener("scroll", onScroll);
//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);

//   const services = [
//     {
//       icon: <FaWifi />,
//       title: "Free Wi-Fi",
//       desc: "Stay connected with high-speed internet across the property.",
//     },
//     {
//       icon: <FaParking />,
//       title: "Ample Parking",
//       desc: "Convenient and secure parking available for all guests.",
//     },
//     {
//       icon: <FaSpa />,
//       title: "Relaxing Spa",
//       desc: "Indulge in rejuvenating spa treatments for ultimate relaxation.",
//     },
//     {
//       icon: <FaCoffee />,
//       title: "Gourmet Coffee Bar",
//       desc: "Enjoy premium coffee and snacks anytime at our cozy bar.",
//     },
//   ];

//   const highlights = [
//     {
//       img: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=400&fit=crop&crop=center",
//       title: "Elegant Suites",
//       desc: "Our meticulously designed suites offer a blend of traditional aesthetics and modern luxury.",
//     },
//     {
//       img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop&crop=center",
//       title: "Exquisite Dining",
//       desc: "Savor a culinary journey with dishes crafted from fresh, local ingredients by our expert chefs.",
//     },
//     {
//       img: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600&h=400&fit=crop&crop=center",
//       title: "Lush Gardens",
//       desc: "Find tranquility in our sprawling, beautifully manicured gardens, perfect for peaceful strolls.",
//     },
//   ];

//   const testimonials = [
//     {
//       text: "The attention to detail and personalized service were truly exceptional. A memorable stay!",
//       author: "Aisha S.",
//     },
//     {
//       text: "Beyond expectations! The blend of heritage and modern amenities made our vacation perfect.",
//       author: "Vikram P.",
//     },
//     {
//       text: "A serene oasis with delightful cuisine and the most welcoming staff. Already planning my return!",
//       author: "Priya L.",
//     },
//   ];

//   const galleryImages = [
//     "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop&crop=center",
//     "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop&crop=center",
//     "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=400&h=300&fit=crop&crop=center",
//     "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop&crop=center",
//     "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&h=300&fit=crop&crop=center",
//     "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=400&h=300&fit=crop&crop=center",
//     "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center",
//     "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&h=300&fit=crop&crop=center",
//   ];

//   const closeLightbox = () => setSelectedImage(null);

//   const sectionVariants = {
//     hidden: { opacity: 0, y: 50 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         duration: 0.9,
//         ease: [0.6, -0.05, 0.01, 0.99],
//         when: "beforeChildren",
//         staggerChildren: 0.2,
//       },
//     },
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, y: 30, scale: 0.95 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       scale: 1,
//       transition: { duration: 0.7, ease: [0.6, -0.05, 0.01, 0.99] },
//     },
//   };

//   const textVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] },
//     },
//   };

//   const headingLineVariants = {
//     hidden: { width: 0, opacity: 0 },
//     visible: {
//       width: "6rem",
//       opacity: 1,
//       transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] },
//     },
//   };

//   const lightboxImageVariants = {
//     hidden: { scale: 0.8, opacity: 0, rotateY: 10 },
//     visible: {
//       scale: 1,
//       opacity: 1,
//       rotateY: 0,
//       transition: {
//         type: "spring",
//         stiffness: 120,
//         damping: 15,
//         duration: 0.7,
//       },
//     },
//     exit: {
//       scale: 0.8,
//       opacity: 0,
//       rotateY: -10,
//       transition: { duration: 0.5, ease: [0.6, -0.05, 0.01, 0.99] },
//     },
//   };

//   return (
//     <div className="font-body text-text-light bg-primary-dark min-h-screen overflow-x-hidden scroll-smooth">

//       {/* Hero Section */}
//       <section
//         id="home"
//         className="relative min-h-[70vh] h-auto flex items-start justify-center text-center pt-2 xs:pt-4 sm:pt-8 pb-2 xs:pb-4 sm:pb-8 px-4 sm:px-6 lg:px-8 hero-bg"
//       >
//         {/* Dynamic Overlay */}
//         <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10 opacity-90"></div>
//         <motion.div
//           initial={{ opacity: 0, y: 40 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 1.2, delay: 0.2, ease: [0.6, -0.05, 0.01, 0.99] }}
//           className="relative z-20 max-w-4xl lg:max-w-6xl p-2 xs:p-4 sm:p-8 rounded-3xl glass-effect shadow-soft-xl border border-secondary-dark/60 mt-0 mb-2 xs:mb-4"
//         >
//           <motion.h1
//             className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight mb-4 xs:mb-6 uppercase text-accent-gold leading-tight drop-shadow-[0_2px_8px_rgba(255,186,73,0.25)] text-shadow-luxury"
//             initial={{ scale: 0.8, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             transition={{ duration: 1, delay: 0.4, type: 'spring', stiffness: 70, damping: 10 }}
//           >
//             Refined Luxury, Timeless Charm
//           </motion.h1>
//           <motion.p
//             className="text-sm xs:text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-6 xs:mb-10 font-body font-light tracking-wide text-text-light/95 leading-relaxed drop-shadow-[0_1px_4px_rgba(0,0,0,0.10)]"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 1, delay: 0.6 }}
//           >
//             Immerse yourself in an experience where every detail is crafted for your utmost comfort and delight.
//           </motion.p>
//           <motion.button
//             whileHover={{ scale: 1.05, y: -5 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => alert("Redirecting to booking portal...")}
//             className="bg-accent-gold text-primary-dark w-full sm:w-auto px-10 py-3 xs:px-12 xs:py-4 rounded-full font-heading font-bold text-base xs:text-lg shadow-soft-lg hover:bg-orange-600 transition-all duration-300 transform border-2 border-accent-gold hover:border-text-light focus:outline-none focus:ring-4 focus:ring-accent-gold focus:ring-opacity-60"
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 1, delay: 0.8 }}
//           >
//             Secure Your Retreat
//           </motion.button>
//         </motion.div>
//         {/* Scroll Indicator */}
//         <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20">
//           {/* Mobile: Animated Chevron Down */}
//           <motion.div
//             className="block sm:hidden"
//             animate={{ y: [0, 10, 0] }}
//             transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
//           >
//             <svg className="w-8 h-8 text-accent-gold mx-auto" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
//             </svg>
//           </motion.div>
//           {/* Desktop: Mouse Icon */}
//           <motion.div
//             className="hidden sm:flex w-9 h-14 border-2 border-text-light rounded-full justify-center pt-2"
//             animate={{ y: [0, 10, 0] }}
//             transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
//           >
//             <span className="w-1.5 h-3.5 bg-text-light rounded-full"></span>
//           </motion.div>
//         </div>
//       </section>

//       {/* Features Section */}
//       <motion.section
//         className="py-10 xs:py-14 sm:py-20 bg-secondary-dark px-4 sm:px-6 lg:px-8"
//         variants={sectionVariants}
//         initial="hidden"
//         whileInView="visible"
//         viewport={{ once: true, amount: 0.1 }}
//       >
//         <div className="max-w-7xl mx-auto text-center">
//           <motion.h2
//             className="text-accent-gold drop-shadow-[0_2px_8px_rgba(255,186,73,0.25)] text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-heading font-extrabold mb-3 xs:mb-4 tracking-tight relative inline-block pb-2 xs:pb-3"
//             variants={textVariants}
//           >
//             Distinguishing Features
//           </motion.h2>
//           <motion.span
//             className="block h-1.5 bg-danger-red rounded-full mx-auto mb-16"
//             variants={headingLineVariants}
//           ></motion.span>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 xs:gap-8 text-text-light">
//             {["Prime Location", "Luxurious Rooms", "Gourmet Dining"].map((title, idx) => (
//               <motion.div
//                 key={idx}
//                 variants={itemVariants}
//                 className="bg-primary-dark rounded-xl p-8 shadow-soft-lg border border-secondary-dark hover:border-accent-gold transition-all duration-500 transform hover:-translate-y-4 hover:shadow-soft-xl relative overflow-hidden group flex flex-col items-center"
//                 whileHover={{ scale: 1.02 }}
//               >
//                 <div className="relative z-10 text-center">
//                   <div className="mx-auto mb-6 h-28 w-28 text-accent-gold text-7xl flex items-center justify-center rounded-full bg-secondary-dark/70 shadow-inner border-2 border-primary-dark group-hover:border-danger-red transition-all duration-300 transform group-hover:scale-110">
//                     {idx === 0 && <FaMapMarkerAlt />}
//                     {idx === 1 && <FaBed />}
//                     {idx === 2 && <FaUtensils />}
//                   </div>
//                   <h3 className="text-lg xs:text-xl sm:text-2xl font-heading font-semibold mb-2 xs:mb-3 text-accent-gold drop-shadow-[0_2px_8px_rgba(255,186,73,0.25)] group-hover:text-text-light transition-colors duration-300">{title}</h3>
//                   <p className="text-text-muted text-sm xs:text-base leading-relaxed font-body font-light tracking-wide">{title === "Prime Location"
//                       ? "Nestled amidst scenic beauty, offering tranquility and convenient access to local attractions."
//                       : title === "Luxurious Rooms"
//                       ? "Opulently furnished suites designed for utmost comfort, combining classic charm with contemporary amenities."
//                       : "An exquisite culinary experience awaits, with gourmet creations crafted by our celebrated chefs."}</p>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </motion.section>

//       {/* Services Section */}
//       <motion.section
//         id="services"
//         className="max-w-7xl mx-auto px-4 sm:px-8 py-10 xs:py-14 sm:py-20 text-center"
//         variants={sectionVariants}
//         initial="hidden"
//         whileInView="visible"
//         viewport={{ once: true, amount: 0.1 }}
//       >
//         <motion.h2
//           className="text-accent-gold drop-shadow-[0_2px_8px_rgba(255,186,73,0.25)] text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-heading font-extrabold mb-3 xs:mb-4 tracking-tight relative inline-block pb-2 xs:pb-3"
//           variants={textVariants}
//         >
//           Premium Amenities
//         </motion.h2>
//         <motion.span
//           className="block h-1.5 bg-danger-red rounded-full mx-auto mb-16"
//           variants={headingLineVariants}
//         ></motion.span>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xs:gap-8">
//           {services.map(({ icon, title, desc }) => (
//             <motion.div
//               key={title}
//               variants={itemVariants}
//               className="bg-secondary-dark rounded-xl shadow-soft-lg p-7 text-center cursor-pointer transform transition-all duration-500 hover:shadow-soft-xl hover:scale-105 border border-primary-dark hover:border-accent-gold group relative overflow-hidden"
//               whileHover={{ rotateY: 3, rotateZ: 1, scale: 1.03 }}
//             >
//               <div className="relative z-10">
//                 <div className="text-danger-red text-6xl mb-5 flex items-center justify-center animate-subtle-pulse bg-primary-dark/70 rounded-full h-24 w-24 mx-auto shadow-inner border border-secondary-dark group-hover:border-accent-gold transition-colors duration-300">
//                   {icon}
//                 </div>
//                 <h3 className="text-2xl font-heading font-semibold mb-3 text-accent-gold group-hover:text-text-light transition-colors duration-300">{title}</h3>
//                 <p className="text-text-muted text-base leading-relaxed font-body">{desc}</p>
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       </motion.section>

//       {/* Highlights Section */}
//       <motion.section
//         id="highlights"
//         className="max-w-7xl mx-auto bg-primary-dark px-4 sm:px-6 lg:px-8 py-10 xs:py-14 sm:py-20"
//         variants={sectionVariants}
//         initial="hidden"
//         whileInView="visible"
//         viewport={{ once: true, amount: 0.1 }}
//       >
//         <motion.h2
//           className="text-accent-gold drop-shadow-[0_2px_8px_rgba(255,186,73,0.25)] text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-heading font-extrabold mb-3 xs:mb-4 text-center tracking-tight relative inline-block pb-2 xs:pb-3"
//           variants={textVariants}
//         >
//           Moments of Grandeur
//         </motion.h2>
//         <motion.span
//           className="block h-1.5 bg-danger-red rounded-full mx-auto mb-16"
//           variants={headingLineVariants}
//         ></motion.span>
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 xs:gap-8">
//           {highlights.map(({ img, title, desc }) => (
//             <motion.div
//               key={title}
//               variants={itemVariants}
//               className="bg-secondary-dark rounded-xl shadow-soft-lg overflow-hidden flex flex-col transform transition-all duration-500 hover:scale-[1.02] hover:shadow-soft-xl border border-primary-dark hover:border-accent-gold group"
//               whileHover={{ y: -10 }}
//             >
//               <div className="relative overflow-hidden h-60">
//                 <img src={img} alt={title} className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-115" />
//                 <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
//               </div>
//               <div className="p-6 flex flex-col flex-grow">
//                 <h3 className="text-lg xs:text-xl sm:text-2xl font-heading font-semibold mb-2 xs:mb-3 text-accent-gold drop-shadow-[0_2px_8px_rgba(255,186,73,0.25)] group-hover:text-text-light transition-colors duration-300">{title}</h3>
//                 <p className="text-text-muted flex-grow text-sm xs:text-base leading-relaxed font-body font-light tracking-wide">{desc}</p>
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       </motion.section>

//       {/* Testimonials */}
//       <motion.section
//         id="testimonials"
//         className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 xs:py-14 sm:py-20"
//         variants={sectionVariants}
//         initial="hidden"
//         whileInView="visible"
//         viewport={{ once: true, amount: 0.1 }}
//       >
//         <motion.h2
//           className="text-accent-gold drop-shadow-[0_2px_8px_rgba(255,186,73,0.25)] text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-heading font-extrabold mb-3 xs:mb-4 text-center tracking-tight relative inline-block pb-2 xs:pb-3"
//           variants={textVariants}
//         >
//           Kind Words from Our Guests
//         </motion.h2>
//         <motion.span
//           className="block h-1.5 bg-danger-red rounded-full mx-auto mb-16"
//           variants={headingLineVariants}
//         ></motion.span>
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 xs:gap-8">
//           {testimonials.map(({ text, author }) => (
//             <motion.div
//               key={author}
//               variants={itemVariants}
//               className="bg-secondary-dark rounded-xl shadow-soft-lg p-7 cursor-pointer hover:shadow-soft-xl transition-all duration-500 transform hover:-translate-y-3 border border-primary-dark hover:border-danger-red relative overflow-hidden group"
//               whileHover={{ scale: 1.01 }}
//             >
//               <div className="absolute top-4 left-4 text-8xl text-primary-dark/60 opacity-80 z-0 select-none transform translate-x-[-15px] translate-y-[-15px] group-hover:text-danger-red/20 transition-colors duration-300">
//                 <FaQuoteRight />
//               </div>
//               <p className="text-text-muted text-base xs:text-lg italic mb-3 xs:mb-5 leading-relaxed relative z-10 font-body font-light tracking-wide">"{text}"</p>
//               <p className="text-accent-gold font-heading font-bold text-right text-base xs:text-lg relative z-10 drop-shadow-[0_1px_4px_rgba(255,186,73,0.10)]">— {author}</p>
//             </motion.div>
//           ))}
//         </div>
//       </motion.section>

//       {/* Gallery */}
//       <motion.section
//         id="gallery"
//         className="bg-primary-dark px-4 sm:px-6 lg:px-8 py-10 xs:py-14 sm:py-20"
//         variants={sectionVariants}
//         initial="hidden"
//         whileInView="visible"
//         viewport={{ once: true, amount: 0.1 }}
//       >
//         <motion.h2
//           className="text-accent-gold drop-shadow-[0_2px_8px_rgba(255,186,73,0.25)] text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-heading font-extrabold mb-3 xs:mb-4 text-center tracking-tight relative inline-block pb-2 xs:pb-3"
//           variants={textVariants}
//         >
//           Visual Diary of Splendor
//         </motion.h2>
//         <motion.span
//           className="block h-1.5 bg-danger-red rounded-full mx-auto mb-16"
//           variants={headingLineVariants}
//         ></motion.span>

//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//           {galleryImages.map((src, idx) => (
//             <motion.div
//               key={idx}
//               variants={itemVariants}
//               className="relative group rounded-xl overflow-hidden shadow-soft-lg cursor-pointer border-2 border-transparent hover:border-accent-gold transition-all duration-500"
//               onClick={() => setSelectedImage(src)}
//               whileHover={{ scale: 1.05 }}
//             >
//               <img
//                 src={src}
//                 alt={`Gallery image ${idx + 1}`}
//                 className="object-cover w-full h-64 transition-transform duration-700 ease-in-out group-hover:scale-110"
//               />
//               <div className="absolute inset-0 bg-primary-dark/80 flex flex-col items-center justify-center text-text-light font-bold text-lg opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-400">
//                 <FaSearchPlus className="h-10 w-10 mb-2 text-accent-gold" />
//                 <span className="font-heading text-xl">View Image</span>
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       </motion.section>

//       {/* Lightbox Viewer */}
//       <AnimatePresence>
//         {selectedImage && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4 backdrop-blur-md"
//             onClick={closeLightbox}
//           >
//             <motion.div
//               initial="hidden"
//               animate="visible"
//               exit="exit"
//               variants={lightboxImageVariants}
//               className="relative max-w-5xl w-full max-h-[90vh] overflow-hidden rounded-2xl shadow-soft-xl border-4 border-accent-gold"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <img src={selectedImage} alt="Enlarged" className="w-full h-full object-contain" />
//               <motion.button
//                 onClick={closeLightbox}
//                 className="absolute top-5 right-5 text-text-light text-5xl font-bold bg-danger-red bg-opacity-80 rounded-full w-16 h-16 flex items-center justify-center transition-all duration-300 z-10 shadow-soft-lg border-2 border-text-light"
//                 aria-label="Close image"
//                 whileHover={{
//                   scale: 1.15,
//                   rotate: 90,
//                   backgroundColor: "#c21e56",
//                   color: "#fff",
//                 }}
//                 whileTap={{ scale: 0.9 }}
//               >
//                 &times;
//               </motion.button>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }
