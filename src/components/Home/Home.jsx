import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Make sure AnimatePresence is imported

export default function TajStyleHome() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 50);
    }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const services = [
    { icon: "📶", title: "Free Wi-Fi", desc: "Stay connected with fast and reliable internet throughout the inn." },
    { icon: "🅿️", title: "Free Parking", desc: "Secure parking space available for guests at no extra cost." },
    { icon: "💆‍♀️", title: "Spa & Wellness", desc: "Relax and rejuvenate with our spa treatments and wellness programs." },
    { icon: "☕", title: "24/7 Coffee Bar", desc: "Enjoy your favorite beverages any time at our cozy coffee corner." },
  ];

  const highlights = [
    {
      img: "https://images.unsplash.com/photo-1501183638714-2f2f9899c6f5?auto=format&fit=crop&w=400&q=80",
      title: "Luxury Rooms",
      desc: "Experience the comfort of our beautifully designed rooms with premium furnishings and stunning views.",
    },
    {
      img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=400&q=80",
      title: "Delicious Cuisine",
      desc: "Enjoy gourmet meals prepared by our expert chefs, featuring local and international flavors.",
    },
    {
      img: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=400&q=80",
      title: "Relaxing Lawn",
      desc: "Spend peaceful moments in our lush green garden perfect for morning yoga, reading, or family gatherings.",
    },
  ];

  const testimonials = [
    { text: "Gouri Inn made our trip unforgettable with their warm hospitality and beautiful rooms!", author: "Anjali M." },
    { text: "Perfect getaway spot. Loved the garden and the food was amazing. Highly recommend!", author: "Rajesh K." },
    { text: "Clean, cozy, and super friendly staff. Can't wait to come back again!", author: "Neha S." },
  ];

  const [selectedImage, setSelectedImage] = useState(null);
  const closeLightbox = () => setSelectedImage(null);

  const galleryImages = [
    "/RoomImages/room1.jpg",
    "/RoomImages/room2.jpg",
    "/RoomImages/room3.jpg",
    "/LawnImages/lawn1.jpg",
    "/LawnImages/lawn2.jpg",
    "/LawnImages/lawn3.jpg",
  ];

  // Define variants for consistent animations with lower transition times
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut", staggerChildren: 0.1 } }, // Faster
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }, // Faster
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }, // Faster
  };

  return (
    <div className="font-serif text-primary bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 min-h-screen overflow-x-hidden scroll-smooth">
      {/* Hero Section */}
      <section
        id="home"
        className="relative h-screen flex items-center justify-center text-center px-6 sm:px-12"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1800&q=80')", // Used the specified URL
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-black to-black bg-opacity-75 backdrop-blur-sm z-10"></div>
        <motion.div
          initial={{ opacity: 0, y: 30 }} // Faster animation
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }} // Faster animation
          className="relative z-20 max-w-3xl md:max-w-4xl p-4"
        >
          <motion.h1
            className="text-4xl sm:text-6xl md:text-8xl font-extrabold tracking-wide drop-shadow-lg mb-6 uppercase text-white leading-tight"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4, type: "spring", stiffness: 100 }} // Faster animation
          >
            Experience Unrivaled Luxury
          </motion.h1>
          <motion.p
            className="text-lg sm:text-xl md:text-2xl max-w-2xl mx-auto mb-10 font-light tracking-wide drop-shadow-md text-gray-200"
            initial={{ opacity: 0, y: 15 }} // Faster animation
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }} // Faster animation
          >
            Where grandeur meets comfort, creating unforgettable memories.
          </motion.p>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(251, 191, 36, 0.8)", y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => alert("Redirecting to booking")}
            className="bg-yellow-500 text-gray-900 w-full sm:w-auto px-12 py-4 rounded-full font-bold text-lg shadow-2xl hover:bg-yellow-600 transition-all duration-300 transform"
            initial={{ opacity: 0, y: 20 }} // Faster animation
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }} // Faster animation
          >
            Book Your Grand Stay
          </motion.button>
        </motion.div>
      </section>

      {/* Features Section */}
      <motion.section
        className="py-24 bg-gray-900 px-4"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="max-w-6xl mx-auto text-center">
          <motion.h2
            className="text-yellow-400 text-3xl sm:text-4xl font-bold mb-14 tracking-wide relative inline-block pb-3"
            variants={textVariants}
          >
            What Sets Us Apart
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-rose-500 rounded-full animate-pulse-line"></span>
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-gray-300">
            {["Prime Location", "Luxurious Rooms", "Fine Dining"].map((title, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="bg-gray-800 bg-opacity-70 rounded-xl p-8 shadow-xl border border-gray-700 hover:border-yellow-400 transition-all duration-300 transform hover:-translate-y-4 hover:shadow-2xl"
                whileHover={{ scale: 1.03, boxShadow: "0 10px 40px rgba(251, 191, 36, 0.3)" }}
              >
                <div className="mx-auto mb-6 h-20 w-20 text-yellow-400 text-5xl flex items-center justify-center rounded-full bg-gray-700 shadow-inner">
                  {idx === 0 && <span className="drop-shadow">📍</span>}
                  {idx === 1 && <span className="drop-shadow">🛏️</span>}
                  {idx === 2 && <span className="drop-shadow">🍽️</span>}
                </div>
                <h3 className="text-2xl font-semibold mb-3 text-white">{title}</h3>
                <p className="text-base leading-relaxed text-gray-400">
                  {title === "Prime Location"
                    ? "Strategically nestled with breathtaking views, offering serene escapes and easy access to local marvels."
                    : title === "Luxurious Rooms"
                    ? "Opulently appointed suites designed for supreme comfort, blending classic elegance with modern amenities."
                    : "A culinary journey awaits, with gourmet creations by master chefs in an ambiance of refined taste."}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Services Section */}
      <motion.section
        id="services"
        className="max-w-6xl mx-auto px-4 sm:px-8 py-20 text-center bg-transparent"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.h2
          className="text-yellow-400 text-3xl sm:text-4xl font-bold mb-14 tracking-wide text-center relative inline-block pb-3"
          variants={textVariants}
        >
          Exclusive Amenities
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-rose-500 rounded-full animate-pulse-line"></span>
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map(({ icon, title, desc }) => (
            <motion.div
              key={title}
              variants={itemVariants}
              className="bg-white rounded-xl shadow-xl p-7 text-center cursor-pointer transform transition-all duration-300 hover:shadow-2xl hover:scale-105 border border-gray-100 hover:border-rose-300"
              whileHover={{ rotateY: 5, rotateZ: 2 }}
            >
              <div className="text-rose-600 text-5xl mb-5 flex items-center justify-center animate-bounce-slow">
                {icon}
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-900">{title}</h3>
              <p className="text-gray-700 text-base leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Highlights Section */}
      <motion.section
        id="highlights"
        className="max-w-6xl mx-auto bg-gray-900 px-4 py-20"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.h2
          className="text-3xl sm:text-4xl font-extrabold mb-12 text-center text-yellow-400 tracking-wide relative inline-block pb-3"
          variants={textVariants}
        >
          A Glimpse of Our Elegance
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-rose-500 rounded-full animate-pulse-line"></span>
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {highlights.map(({ img, title, desc }) => (
            <motion.div
              key={title}
              variants={itemVariants}
              className="bg-white rounded-xl shadow-xl overflow-hidden flex flex-col transform transition-all duration-300 hover:scale-103 hover:shadow-2xl border border-gray-100 hover:border-yellow-300"
              whileHover={{ y: -10, boxShadow: "0 15px 40px rgba(0,0,0,0.3)" }}
            >
              <div className="relative overflow-hidden">
                <img src={img} alt={title} className="h-56 w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-115" />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-2xl font-semibold mb-3 text-gray-900">{title}</h3>
                <p className="text-gray-700 flex-grow text-base leading-relaxed">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Testimonials */}
      <motion.section
        id="testimonials"
        className="max-w-5xl mx-auto px-4 py-20 bg-transparent"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.h2
          className="text-3xl sm:text-4xl font-extrabold mb-12 text-center text-yellow-400 tracking-wide relative inline-block pb-3"
          variants={textVariants}
        >
          Voices of Delight
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-rose-500 rounded-full animate-pulse-line"></span>
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {testimonials.map(({ text, author }) => (
            <motion.div
              key={author}
              variants={itemVariants}
              className="bg-rose-50 rounded-xl shadow-lg p-7 cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-rose-100 relative overflow-hidden"
              whileHover={{ scale: 1.02, backgroundColor: '#ffe4e6' }}
            >
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-rose-100 to-transparent opacity-30 pointer-events-none rounded-xl"></div>
              <p className="text-gray-800 text-base italic mb-5 leading-relaxed relative z-10">"{text}"</p>
              <p className="text-rose-700 font-bold text-right text-lg relative z-10">— {author}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Gallery */}
      <motion.section
        id="gallery"
        className="bg-gray-900 px-4 sm:px-8 py-20"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.h2
          className="text-3xl sm:text-4xl font-extrabold mb-12 text-center text-yellow-400 tracking-wide relative inline-block pb-3"
          variants={textVariants}
        >
          Our Visual Chronicle
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-rose-500 rounded-full animate-pulse-line"></span>
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {galleryImages.map((src, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="relative group rounded-xl overflow-hidden shadow-lg cursor-pointer border-2 border-transparent hover:border-yellow-400 transition-all duration-300"
              onClick={() => setSelectedImage(src)}
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(251, 191, 36, 0.5)" }}
            >
              <img
                src={src}
                alt={`Gallery image ${idx + 1}`}
                className="object-cover w-full h-64 sm:h-72 md:h-80 transition-transform duration-500 ease-in-out group-hover:scale-115"
              />
              <motion.div
                className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white font-bold text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <svg className="h-8 w-8 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View Details
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4 backdrop-blur-lg"
            onClick={closeLightbox}
          >
            <motion.div
              initial={{ scale: 0.8, rotateX: 90, opacity: 0 }}
              animate={{ scale: 1, rotateX: 0, opacity: 1 }}
              exit={{ scale: 0.8, rotateX: -90, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 25, duration: 0.4 }} // Faster lightbox transition
              className="relative max-w-5xl w-full max-h-[90vh] overflow-hidden rounded-xl shadow-2xl border-4 border-yellow-400"
              onClick={(e) => e.stopPropagation()}
            >
              <img src={selectedImage} alt="Enlarged" className="w-full h-full object-contain" />
              <button
                onClick={closeLightbox}
                className="absolute top-5 right-5 text-white text-5xl font-bold bg-gray-800 bg-opacity-70 rounded-full w-14 h-14 flex items-center justify-center transition-all duration-300 z-10 shadow-lg"
                aria-label="Close image"
                whileHover={{ scale: 1.15, rotate: 180, backgroundColor: '#ef4444', color: '#fff', boxShadow: "0 10px 20px rgba(0,0,0,0.5)" }}
                whileTap={{ scale: 0.9 }}
              >
                &times;
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

// import React, { useEffect, useState } from "react";
// import { motion } from "framer-motion";

// export default function TajStyleHome() {
//   const [scrolled, setScrolled] = useState(false);

//   useEffect(() => {
//     function onScroll() {
//       setScrolled(window.scrollY > 50);
//     }
//     window.addEventListener("scroll", onScroll);
//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);

//   const services = [
//     { icon: "📶", title: "Free Wi-Fi", desc: "Stay connected with fast and reliable internet throughout the inn." },
//     { icon: "🅿️", title: "Free Parking", desc: "Secure parking space available for guests at no extra cost." },
//     { icon: "💆‍♀️", title: "Spa & Wellness", desc: "Relax and rejuvenate with our spa treatments and wellness programs." },
//     { icon: "☕", title: "24/7 Coffee Bar", desc: "Enjoy your favorite beverages any time at our cozy coffee corner." },
//   ];

//   const highlights = [
//     {
//       img: "https://images.unsplash.com/photo-1501183638714-2f2f9899c6f5?auto=format&fit=crop&w=400&q=80",
//       title: "Luxury Rooms",
//       desc: "Experience the comfort of our beautifully designed rooms with premium furnishings and stunning views.",
//     },
//     {
//       img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=400&q=80",
//       title: "Delicious Cuisine",
//       desc: "Enjoy gourmet meals prepared by our expert chefs, featuring local and international flavors.",
//     },
//     {
//       img: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=400&q=80",
//       title: "Relaxing Lawn",
//       desc: "Spend peaceful moments in our lush green garden perfect for morning yoga, reading, or family gatherings.",
//     },
//   ];

//   const testimonials = [
//     { text: "Gouri Inn made our trip unforgettable with their warm hospitality and beautiful rooms!", author: "Anjali M." },
//     { text: "Perfect getaway spot. Loved the garden and the food was amazing. Highly recommend!", author: "Rajesh K." },
//     { text: "Clean, cozy, and super friendly staff. Can't wait to come back again!", author: "Neha S." },
//   ];

//   const [selectedImage, setSelectedImage] = useState(null);
//   const closeLightbox = () => setSelectedImage(null);


//   const galleryImages = [
//     "/RoomImages/room1.jpg",
//     "/RoomImages/room2.jpg",
//     "/RoomImages/room3.jpg",
//     "/LawnImages/lawn1.jpg",
//     "/LawnImages/lawn2.jpg",
//     "/LawnImages/lawn3.jpg",
//   ];

//   return (
//     <div className="font-serif text-primary bg-gray-900 min-h-screen overflow-x-hidden scroll-smooth">
//       {/* Hero Section */}
//       <section
//         className="relative h-screen flex items-center justify-center text-center px-6 sm:px-12"
//         style={{
//           backgroundImage:
//             "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=80')",
//           backgroundPosition: "center",
//           backgroundSize: "cover",
//           backgroundAttachment: "fixed",
//         }}
//       >
//         <div className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm z-10"></div>
//         <motion.div
//           initial={{ opacity: 0, y: 40 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 1 }}
//           className="relative z-20 max-w-3xl md:max-w-4xl p-4"
//         >
//           <h1 className="text-3xl sm:text-5xl md:text-7xl font-extrabold tracking-wide drop-shadow-lg mb-6 uppercase text-white">
//             Experience Timeless Luxury
//           </h1>
//           <p className="text-lg sm:text-xl md:text-2xl max-w-2xl mx-auto mb-10 font-light tracking-wide drop-shadow-md text-white">
//             Where elegance meets comfort in the heart of tranquility.
//           </p>
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => alert("Redirecting to booking")}
//             className="bg-yellow-400 text-gray-900 w-full sm:w-auto px-10 py-3 rounded-full font-semibold text-lg shadow-xl hover:bg-yellow-500 transition"
//           >
//             Book Your Stay
//           </motion.button>
//         </motion.div>
//       </section>

//       {/* Features Section */}
//       <section className="py-24 bg-gray-800 px-4">
//         <div className="max-w-6xl mx-auto text-center">
//           <motion.h2
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8 }}
//             className="text-yellow-400 text-3xl sm:text-4xl font-bold mb-14 tracking-wide"
//           >
//             What Makes Us Exceptional
//           </motion.h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-gray-300">
//             {["Prime Location", "Luxurious Rooms", "Fine Dining"].map((title, idx) => (
//               <motion.div
//                 key={idx}
//                 whileHover={{ scale: 1.05 }}
//                 className="bg-gray-900 bg-opacity-50 rounded-xl p-8 shadow-lg hover:shadow-yellow-400/50 transition-shadow"
//               >
//                 <div className="mx-auto mb-6 h-14 w-14 text-yellow-400 text-3xl">⭐</div>
//                 <h3 className="text-xl font-semibold mb-3">{title}</h3>
//                 <p className="text-sm leading-relaxed">
//                   {title === "Prime Location"
//                     ? "Centrally located with breathtaking views and easy access to local attractions."
//                     : title === "Luxurious Rooms"
//                     ? "Elegantly furnished suites with modern amenities for ultimate relaxation."
//                     : "World-class cuisine served in elegant settings to delight your palate."}
//                 </p>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Services Section */}
//       <section id="services" className="max-w-6xl mx-auto px-4 sm:px-8 py-20 text-center">
//         <h2 className="text-yellow-400 text-3xl sm:text-4xl font-bold mb-14 tracking-wide">
//           Our Services
//           <span className="block w-20 h-1 bg-pink-500 rounded mx-auto mt-3"></span>
//         </h2>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//           {services.map(({ icon, title, desc }) => (
//             <motion.div
//               key={title}
//               whileHover={{ scale: 1.03 }}
//               className="bg-white rounded-xl shadow-lg p-6 text-center cursor-pointer transform transition hover:shadow-2xl"
//             >
//               <div className="text-pink-500 text-4xl mb-4">{icon}</div>
//               <h3 className="text-xl font-semibold mb-2 text-gray-900">{title}</h3>
//               <p className="text-gray-600 text-sm">{desc}</p>
//             </motion.div>
//           ))}
//         </div>
//       </section>

//       {/* Highlights Section */}
//       <section id="highlights" className="max-w-6xl mx-auto bg-gray-800 px-4 py-20">
//         <h2 className="text-3xl sm:text-4xl font-extrabold mb-12 text-center text-yellow-400 tracking-wide">
//           Our Highlights
//           <span className="block w-20 h-1 bg-pink-500 rounded mx-auto mt-3"></span>
//         </h2>
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//           {highlights.map(({ img, title, desc }) => (
//             <motion.div
//               key={title}
//               whileHover={{ scale: 1.03 }}
//               className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col"
//             >
//               <img src={img} alt={title} className="h-44 w-full object-cover" />
//               <div className="p-5 flex flex-col flex-grow">
//                 <h3 className="text-xl font-semibold mb-2 text-gray-900">{title}</h3>
//                 <p className="text-gray-600 flex-grow text-sm">{desc}</p>
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       </section>

//       {/* Testimonials */}
//       <section id="testimonials" className="max-w-5xl mx-auto px-4 py-20">
//         <h2 className="text-3xl sm:text-4xl font-extrabold mb-12 text-center text-yellow-400 tracking-wide">
//           What Our Guests Say
//           <span className="block w-20 h-1 bg-pink-500 rounded mx-auto mt-3"></span>
//         </h2>
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
//           {testimonials.map(({ text, author }) => (
//             <motion.div
//               key={author}
//               whileHover={{ scale: 1.02 }}
//               className="bg-pink-100 rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-2xl"
//             >
//               <p className="text-gray-800 text-sm italic mb-4">"{text}"</p>
//               <p className="text-pink-500 font-semibold text-right">— {author}</p>
//             </motion.div>
//           ))}
//         </div>
//       </section>

//       <section id="gallery" className="bg-gray-900 px-4 sm:px-8 py-20">
//   <h2 className="text-3xl sm:text-4xl font-extrabold mb-12 text-center text-yellow-400 tracking-wide">
//     Gallery
//     <span className="block w-20 h-1 bg-pink-500 rounded mx-auto mt-3"></span>
//   </h2>

//   <motion.div
//     initial={{ opacity: 0, y: 30 }}
//     whileInView={{ opacity: 1, y: 0 }}
//     transition={{ duration: 0.8 }}
//     viewport={{ once: true }}
//     className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
//   >
//     {galleryImages.map((src, idx) => (
//       <motion.div
//         key={idx}
//         whileHover={{ scale: 1.03 }}
//         className="relative group rounded-xl overflow-hidden shadow-lg cursor-pointer"
//         onClick={() => setSelectedImage(src)}
//       >
//         <img
//           src={src}
//           alt={`Gallery image ${idx + 1}`}
//           className="object-cover w-full h-64 sm:h-72 md:h-80 transition-transform duration-300 ease-in-out group-hover:scale-110"
//         />
//         <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center text-white font-semibold text-lg">
//           View Image
//         </div>
//       </motion.div>
//     ))}
//   </motion.div>
// </section>

// {selectedImage && (
//   <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
//     <div className="relative max-w-3xl w-full max-h-[90vh] overflow-hidden rounded-xl shadow-lg">
//       <img src={selectedImage} alt="Enlarged" className="w-full h-full object-contain" />
//       <button
//         onClick={closeLightbox}
//         className="absolute top-2 right-2 text-white text-3xl font-bold hover:text-yellow-400 transition"
//       >
//         &times;
//       </button>
//     </div>
//   </div>
// )}


//     </div>
//   );
// }



// import React from "react";
// import { useEffect, useState } from "react";

// export default function TajStyleHome() {
//   const [scrolled, setScrolled] = useState(false);

//   useEffect(() => {
//     function onScroll() {
//       setScrolled(window.scrollY > 50);
//     }
//     window.addEventListener("scroll", onScroll);
//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);

//   return (
//     <div className="font-serif text-primary bg-gray-900 min-h-screen overflow-x-hidden">


//       {/* Hero Section */}
//       <section
//         className="relative h-screen flex items-center justify-center text-center px-6 sm:px-12"
//         style={{
//           backgroundImage:
//             "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=80')",
//           backgroundPosition: "center",
//           backgroundSize: "cover",
//           backgroundAttachment: "fixed",
//         }}
//       >
//         {/* Dark Overlay */}
//         <div className="absolute inset-0 bg-black bg-opacity-70 z-10"></div>

//         {/* Hero Content */}
//         <div className="relative z-20 max-w-4xl">
//           <h1 className="text-5xl md:text-7xl font-extrabold tracking-wide drop-shadow-lg mb-6 uppercase">
//             Experience Timeless Luxury
//           </h1>
//           <p className="text-xl md:text-2xl max-w-2xl mx-auto mb-12 font-light tracking-wide drop-shadow-md">
//             Where elegance meets comfort in the heart of tranquility.
//           </p>
//           <button
//             onClick={() => alert("Redirecting to booking")}
//             className="bg-yellow-400 text-gray-900 px-14 py-4 rounded-full font-semibold text-lg shadow-xl hover:bg-yellow-500 transition transform hover:scale-105"
//           >
//             Book Your Stay
//           </button>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section className="py-24  bg-gray-800">
//         <div className="max-w-6xl mx-auto text-center px-6 sm:px-12">
//           <h2 className="text-yellow-400 text-4xl font-bold mb-14 tracking-wide">
//             What Makes Us Exceptional
//           </h2>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-gray-300">
//             <div className="bg-gray-900 bg-opacity-50 rounded-xl p-8 shadow-lg hover:shadow-yellow-400/50 transition-shadow">
//               <svg
//                 className="mx-auto mb-6 h-14 w-14 text-yellow-400"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 viewBox="0 0 24 24"
//               >
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" />
//               </svg>
//               <h3 className="text-xl font-semibold mb-3">Prime Location</h3>
//               <p className="text-gray-300 text-sm leading-relaxed">
//                 Centrally located with breathtaking views and easy access to local attractions.
//               </p>
//             </div>

//             <div className="bg-gray-900 bg-opacity-50 rounded-xl p-8 shadow-lg hover:shadow-yellow-400/50 transition-shadow">
//               <svg
//                 className="mx-auto mb-6 h-14 w-14 text-yellow-400"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 viewBox="0 0 24 24"
//               >
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18M3 18h18" />
//               </svg>
//               <h3 className="text-xl font-semibold mb-3">Luxurious Rooms</h3>
//               <p className="text-gray-300 text-sm leading-relaxed">
//                 Elegantly furnished suites with modern amenities for ultimate relaxation.
//               </p>
//             </div>

//             <div className="bg-gray-900 bg-opacity-50 rounded-xl p-8 shadow-lg hover:shadow-yellow-400/50 transition-shadow">
//               <svg
//                 className="mx-auto mb-6 h-14 w-14 text-yellow-400"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 viewBox="0 0 24 24"
//               >
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
//               </svg>
//               <h3 className="text-xl font-semibold mb-3">Fine Dining</h3>
//               <p className="text-gray-300 text-sm leading-relaxed">
//                 World-class cuisine served in elegant settings to delight your palate.
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* SERVICES */}
//       <section id="services" className="max-w-4xl mx-auto px-5 py-16 text-center">
//         <h2 className="text-yellow-400 text-4xl font-bold mb-14 tracking-wide">
//           Our Services
//           <span className="block w-20 h-1 bg-pink-500 rounded mx-auto mt-3"></span>
//         </h2>
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
//           {[
//             { icon: "📶", title: "Free Wi-Fi", desc: "Stay connected with fast and reliable internet throughout the inn." },
//             { icon: "🅿️", title: "Free Parking", desc: "Secure parking space available for guests at no extra cost." },
//             { icon: "💆‍♀️", title: "Spa & Wellness", desc: "Relax and rejuvenate with our spa treatments and wellness programs." },
//             { icon: "☕", title: "24/7 Coffee Bar", desc: "Enjoy your favorite beverages any time at our cozy coffee corner." },
//           ].map(({ icon, title, desc }) => (
//             <div
//               key={title}
//               className="bg-white rounded-xl shadow-lg p-8 text-center cursor-pointer transform transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
//             >
//               <div className="text-pink-500 text-5xl mb-5">{icon}</div>
//               <h3 className="text-2xl font-semibold mb-3 text-gray-900">{title}</h3>
//               <p className="text-gray-600">{desc}</p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* HIGHLIGHTS */}
//       <section id="highlights" className="max-w-6xl mx-auto bg-gray-800 px-5 py-16">
//         <h2 className="text-4xl font-extrabold mb-12 text-center  text-yellow-400 tracking-wide">
//           Our Highlights
//           <span className="block w-20 h-1 bg-pink-500 rounded mx-auto mt-3"></span>
//         </h2>
//         <div className="flex flex-wrap justify-center gap-8">
//           {[
//             {
//               img: "https://images.unsplash.com/photo-1501183638714-2f2f9899c6f5?auto=format&fit=crop&w=400&q=80",
//               title: "Luxury Rooms",
//               desc:
//                 "Experience the comfort of our beautifully designed rooms with premium furnishings and stunning views.",
//             },
//             {
//               img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=400&q=80",
//               title: "Delicious Cuisine",
//               desc:
//                 "Enjoy gourmet meals prepared by our expert chefs, featuring local and international flavors.",
//             },
//             {
//               img: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=400&q=80",
//               title: "Relaxing Lawn",
//               desc:
//                 "Spend peaceful moments in our lush green garden perfect for morning yoga, reading, or family gatherings.",
//             },
//           ].map(({ img, title, desc }) => (
//             <div
//               key={title}
//               className="bg-white rounded-xl shadow-md overflow-hidden w-72 cursor-pointer transform transition duration-300 hover:-translate-y-2 hover:shadow-xl flex flex-col"
//             >
//               <img src={img} alt={title} className="h-44 w-full object-cover border-b border-gray-200" />
//               <div className="p-5 flex flex-col flex-grow">
//                 <h3 className="text-2xl font-semibold mb-2 text-gray-900">{title}</h3>
//                 <p className="text-gray-600 flex-grow">{desc}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* TESTIMONIALS */}
//       <section id="testimonials" className="max-w-5xl mx-auto px-5 py-16">
//         <h2 className="text-4xl font-extrabold mb-12 text-center text-yellow-400 tracking-wide">
//           What Our Guests Say
//           <span className="block w-20 h-1 bg-pink-500 rounded mx-auto mt-3"></span>
//         </h2>
//         <div className="flex flex-col sm:flex-row justify-center gap-8">
//           {[
//             { text: "Gouri Inn made our trip unforgettable with their warm hospitality and beautiful rooms!", author: "Anjali M." },
//             { text: "Perfect getaway spot. Loved the garden and the food was amazing. Highly recommend!", author: "Rajesh K." },
//             { text: "Clean, cozy, and super friendly staff. Can't wait to come back again!", author: "Neha S." },
//           ].map(({ text, author }) => (
//             <div
//               key={author}
//               className="bg-pink-100 rounded-xl shadow-lg p-8 max-w-md cursor-pointer hover:shadow-2xl transition transform hover:-translate-y-1"
//             >
//               <p className="text-gray-800 text-lg italic mb-6">"{text}"</p>
//               <p className="text-pink-500 font-semibold text-right">— {author}</p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* GALLERY */}
//       <section id="gallery" className=" bg-gray-800 container px-15 mb-6 rounded-xl w-screen mx-auto px-5 py-16">
//         <h2 className="text-4xl font-extrabold mb-12 text-center text-yellow-400 tracking-wide">
//           Gallery
//           <span className="block w-20 h-1 bg-pink-500 rounded mx-auto mt-3"></span>
//         </h2>
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
//           {[
//             "/RoomImages/room1.jpg",
//             "/RoomImages/room2.jpg",
//             "/RoomImages/room3.jpg",
//             "/LawnImages/lawn1.jpg",
//             "/LawnImages/lawn2.jpg",
//             "/LawnImages/lawn3.jpg",
//           ].map((src, idx) => (
//             <img
//               key={idx}
//               src={src}
//               alt={`Gallery image ${idx + 1}`}
//               className="rounded-lg shadow-lg cursor-pointer object-cover w-full h-64 hover:scale-105 transition-transform"
//               loading="lazy"
//             />
//           ))}
//         </div>
//       </section>

      
//     </div>
//   );
// }
