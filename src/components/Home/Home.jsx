import React, { useState } from "react";
import { FaStar, FaUserFriends, FaAward, FaMapPin, FaUtensils, FaSpa, FaWifi, FaParking, FaBed, FaCoffee, FaSearchPlus, FaQuoteRight } from "react-icons/fa";
import { motion } from "framer-motion";
import SEOHead from "../SEO/SEOHead";

function Home() {
  const [selectedImage, setSelectedImage] = useState(null);

  // SEO structured data for homepage
  const homeStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "StayLuxe Hotel - Luxury Accommodations",
    "description": "Experience luxury redefined at StayLuxe Hotel. Book premium accommodations with 5-star amenities, fine dining, spa services, and exceptional hospitality.",
    "url": "https://your-domain.com",
    "mainEntity": {
      "@type": "Hotel",
      "name": "StayLuxe Hotel",
      "description": "Luxury hotel with premium accommodations and 5-star amenities",
      "starRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "1000",
        "bestRating": "5"
      }
    }
  };

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
    <>
      <SEOHead 
        title="Luxury Hotel Booking | Premium Accommodations & 5-Star Experience"
        description="Experience luxury redefined at StayLuxe Hotel. Book premium accommodations with 5-star amenities, fine dining, spa services, and exceptional hospitality. Best rates guaranteed."
        keywords="luxury hotel, hotel booking, premium accommodation, 5-star hotel, luxury stay, hotel rooms, presidential suite, deluxe rooms, spa hotel, fine dining, hotel amenities, luxury accommodation"
        image="https://your-domain.com/og-image.jpg"
        url="https://your-domain.com"
        structuredData={homeStructuredData}
      />
      
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
            <img 
              src="https://images.unsplash.com/photo-1506744038136-46273834b3fb" 
              alt="Luxury Hotel StayLuxe - Premium Accommodations" 
              className="w-full h-full object-cover" 
              style={{objectPosition: 'center', opacity: 0.5}}
              loading="eager"
            />
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
                aria-label="Book your luxury stay at StayLuxe Hotel"
              >
                Book Your Stay
              </motion.button>
            <motion.button
                whileHover={{ scale: 1.05, y: -3 }}
                className="w-full sm:w-auto bg-[#f8f5f0] text-[#7a5a2f] px-6 py-3 sm:px-8 sm:py-3 rounded-full font-semibold text-base xs:text-lg sm:text-xl shadow-lg border-2 border-[#b88a2f] hover:bg-[#ede6dd]/90 hover:text-[#3d2c1e] transition-all duration-300"
                onClick={() => window.location.href = '/Rooms'}
                aria-label="Explore luxury rooms and suites at StayLuxe Hotel"
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
                <img src="/RoomImages/deluxe.jpg" alt="Presidential Suite at StayLuxe Hotel" className="w-full h-56 object-cover" loading="lazy" />
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
                <img src="/RoomImages/event1.jpg" alt="Gourmet Dining at StayLuxe Hotel" className="w-full h-56 object-cover" loading="lazy" />
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
                <img src="/RoomImages/suite.jpg" alt="Luxury Spa at StayLuxe Hotel" className="w-full h-56 object-cover" loading="lazy" />
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
                aria-label="View complete amenities list at StayLuxe Hotel"
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
                aria-label="Book your luxury stay at StayLuxe Hotel"
              >
                Book Your Stay
              </button>
              {/* Removed Read All Reviews button */}
            </div>
          </div>
        </motion.section>
      </div>
    </>
  );
}

export default Home;
