import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaWifi, FaParking, FaSpa, FaCoffee, FaMapMarkerAlt, FaBed, FaUtensils, FaQuoteRight, FaSearchPlus } from 'react-icons/fa'; // Importing icons

export default function TajStyleHome() {
  const [scrolled, setScrolled] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 50);
    }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const services = [
    { icon: <FaWifi />, title: "Free Wi-Fi", desc: "Stay connected with high-speed internet across the property." },
    { icon: <FaParking />, title: "Ample Parking", desc: "Convenient and secure parking available for all guests." },
    { icon: <FaSpa />, title: "Relaxing Spa", desc: "Indulge in rejuvenating spa treatments for ultimate relaxation." },
    { icon: <FaCoffee />, title: "Gourmet Coffee Bar", desc: "Enjoy premium coffee and snacks anytime at our cozy bar." },
  ];

  const highlights = [
    {
      img: "/RoomImages/room1.jpg", // Modern room
      title: "Elegant Suites",
      desc: "Our meticulously designed suites offer a blend of traditional aesthetics and modern luxury.",
    },
    {
      img: "/RoomImages/room2.jpg", // Modern dining
      title: "Exquisite Dining",
      desc: "Savor a culinary journey with dishes crafted from fresh, local ingredients by our expert chefs.",
    },
    {
      img: "/RoomImages/room3.jpg", // Serene garden/outdoor
      title: "Lush Gardens",
      desc: "Find tranquility in our sprawling, beautifully manicured gardens, perfect for peaceful strolls.",
    },
  ];

  const testimonials = [
    { text: "The attention to detail and personalized service were truly exceptional. A memorable stay!", author: "Aisha S." },
    { text: "Beyond expectations! The blend of heritage and modern amenities made our vacation perfect.", author: "Vikram P." },
    { text: "A serene oasis with delightful cuisine and the most welcoming staff. Already planning my return!", author: "Priya L." },
  ];

  const galleryImages = [
    "/RoomImages/room1.jpg", // Ensure these paths are correct in your public folder
    "/RoomImages/room2.jpg",
    "/RoomImages/room3.jpg",
    "/RoomImages/room4.jpg",
    "/LawnImages/lawn1.jpg",
    "/LawnImages/lawn2.jpg",
    "/LawnImages/lawn3.jpg",
    "/LawnImages/lawn4.jpg",
  ];

  const closeLightbox = () => setSelectedImage(null);

  // Framer Motion Variants - Updated for smoother, modern feel
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.9,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: "easeOut" } },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const headingLineVariants = {
    hidden: { width: 0, opacity: 0 },
    visible: { width: "6rem", opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const lightboxImageVariants = {
    hidden: { scale: 0.8, opacity: 0, rotateY: 10 },
    visible: { scale: 1, opacity: 1, rotateY: 0, transition: { type: "spring", stiffness: 120, damping: 15, duration: 0.7 } },
    exit: { scale: 0.8, opacity: 0, rotateY: -10, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="font-body text-text-light bg-primary-dark min-h-screen overflow-x-hidden scroll-smooth">

      {/* Hero Section */}
      <section
        id="home"
        className="relative h-screen flex items-center justify-center text-center px-4 sm:px-6 lg:px-8"
        style={{
          backgroundColor:"black", // More modern, luxurious image
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundAttachment: "fixed",
        }}
      >
        {/* Dynamic Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-overlay-gradient-start via-overlay-gradient-end to-transparent z-10 opacity-90"></div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
          className="relative z-20 max-w-4xl lg:max-w-6xl p-8 sm:p-12 rounded-3xl bg-overlay-dark shadow-soft-xl border border-secondary-dark/60"
        >
          <motion.h1
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-extrabold tracking-tight drop-shadow-lg mb-6 uppercase text-accent-gold leading-tight"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.4, type: "spring", stiffness: 70, damping: 10 }}
          >
            Refined Luxury, Timeless Charm
          </motion.h1>
          <motion.p
            className="text-lg sm:text-xl md:text-2xl max-w-2xl mx-auto mb-10 font-body font-light tracking-wide text-text-light/90 drop-shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            Immerse yourself in an experience where every detail is crafted for your utmost comfort and delight.
          </motion.p>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "var(--tw-shadow-button-gold)", y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => alert("Redirecting to booking portal...")}
            className="bg-accent-gold text-primary-dark w-full sm:w-auto px-12 py-4 rounded-full font-heading font-bold text-lg shadow-soft-lg hover:bg-orange-600 transition-all duration-300 transform border-2 border-accent-gold hover:border-text-light focus:outline-none focus:ring-4 focus:ring-accent-gold focus:ring-opacity-60"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            Secure Your Retreat
          </motion.button>
        </motion.div>
        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20">
          <motion.div
            className="w-9 h-14 border-2 border-text-light rounded-full flex justify-center pt-2"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <span className="w-1.5 h-3.5 bg-text-light rounded-full"></span>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <motion.section
        className="py-24 bg-secondary-dark px-4 sm:px-6 lg:px-8"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="max-w-7xl mx-auto text-center">
          <motion.h2
            className="text-accent-gold text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold mb-4 tracking-tight relative inline-block pb-3"
            variants={textVariants}
          >
            Distinguishing Features
          </motion.h2>
          <motion.span
            className="block h-1.5 bg-danger-red rounded-full mx-auto mb-16"
            variants={headingLineVariants}
          ></motion.span>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-text-light">
            {["Prime Location", "Luxurious Rooms", "Gourmet Dining"].map((title, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="bg-primary-dark rounded-xl p-8 shadow-soft-lg border border-secondary-dark hover:border-accent-gold transition-all duration-500 transform hover:-translate-y-4 hover:shadow-soft-xl relative overflow-hidden group flex flex-col items-center"
                whileHover={{ scale: 1.02, boxShadow: "0 18px 45px rgba(255, 137, 6, 0.2)" }}
              >
                <div className="relative z-10 text-center">
                  <div className="mx-auto mb-6 h-28 w-28 text-accent-gold text-7xl flex items-center justify-center rounded-full bg-secondary-dark/70 shadow-inner border-2 border-primary-dark group-hover:border-danger-red transition-all duration-300 transform group-hover:scale-110">
                    {idx === 0 && <FaMapMarkerAlt />}
                    {idx === 1 && <FaBed />}
                    {idx === 2 && <FaUtensils />}
                  </div>
                  <h3 className="text-3xl font-heading font-semibold mb-3 text-accent-gold group-hover:text-text-light transition-colors duration-300">{title}</h3>
                  <p className="text-base leading-relaxed text-text-muted font-body">
                    {title === "Prime Location"
                      ? "Nestled amidst scenic beauty, offering tranquility and convenient access to local attractions."
                      : title === "Luxurious Rooms"
                      ? "Opulently furnished suites designed for utmost comfort, combining classic charm with contemporary amenities."
                      : "An exquisite culinary experience awaits, with gourmet creations crafted by our celebrated chefs."}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Services Section */}
      <motion.section
        id="services"
        className="max-w-7xl mx-auto px-4 sm:px-8 py-20 text-center"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.h2
          className="text-accent-gold text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold mb-4 tracking-tight relative inline-block pb-3"
          variants={textVariants}
        >
          Premium Amenities
        </motion.h2>
        <motion.span
          className="block h-1.5 bg-danger-red rounded-full mx-auto mb-16"
          variants={headingLineVariants}
        ></motion.span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map(({ icon, title, desc }) => (
            <motion.div
              key={title}
              variants={itemVariants}
              className="bg-secondary-dark rounded-xl shadow-soft-lg p-7 text-center cursor-pointer transform transition-all duration-500 hover:shadow-soft-xl hover:scale-105 border border-primary-dark hover:border-accent-gold group relative overflow-hidden"
              whileHover={{ rotateY: 3, rotateZ: 1, scale: 1.03 }}
            >
              <div className="relative z-10">
                <div className="text-danger-red text-6xl mb-5 flex items-center justify-center animate-subtle-pulse bg-primary-dark/70 rounded-full h-24 w-24 mx-auto shadow-inner border border-secondary-dark group-hover:border-accent-gold transition-colors duration-300">
                  {icon}
                </div>
                <h3 className="text-2xl font-heading font-semibold mb-3 text-accent-gold group-hover:text-text-light transition-colors duration-300">{title}</h3>
                <p className="text-text-muted text-base leading-relaxed font-body">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Highlights Section */}
      <motion.section
        id="highlights"
        className="max-w-7xl mx-auto bg-primary-dark px-4 sm:px-6 lg:px-8 py-20"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.h2
          className="text-accent-gold text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold mb-4 text-center tracking-tight relative inline-block pb-3"
          variants={textVariants}
        >
          Moments of Grandeur
        </motion.h2>
        <motion.span
          className="block h-1.5 bg-danger-red rounded-full mx-auto mb-16"
          variants={headingLineVariants}
        ></motion.span>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {highlights.map(({ img, title, desc }) => (
            <motion.div
              key={title}
              variants={itemVariants}
              className="bg-secondary-dark rounded-xl shadow-soft-lg overflow-hidden flex flex-col transform transition-all duration-500 hover:scale-[1.02] hover:shadow-soft-xl border border-primary-dark hover:border-accent-gold group"
              whileHover={{ y: -10, boxShadow: "0 15px 40px rgba(0,0,0,0.5)" }}
            >
              <div className="relative overflow-hidden h-60">
                <img src={img} alt={title} className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-115" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-2xl font-heading font-semibold mb-3 text-accent-gold group-hover:text-text-light transition-colors duration-300">{title}</h3>
                <p className="text-text-muted flex-grow text-base leading-relaxed font-body">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Testimonials */}
      <motion.section
        id="testimonials"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.h2
          className="text-accent-gold text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold mb-4 text-center tracking-tight relative inline-block pb-3"
          variants={textVariants}
        >
          Kind Words from Our Guests
        </motion.h2>
        <motion.span
          className="block h-1.5 bg-danger-red rounded-full mx-auto mb-16"
          variants={headingLineVariants}
        ></motion.span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {testimonials.map(({ text, author }) => (
            <motion.div
              key={author}
              variants={itemVariants}
              className="bg-secondary-dark rounded-xl shadow-soft-lg p-7 cursor-pointer hover:shadow-soft-xl transition-all duration-500 transform hover:-translate-y-3 border border-primary-dark hover:border-danger-red relative overflow-hidden group"
              whileHover={{ scale: 1.01, boxShadow: "0 12px 35px rgba(229, 49, 112, 0.3)" }}
            >
              <div className="absolute top-4 left-4 text-8xl text-primary-dark/60 opacity-80 z-0 select-none transform translate-x-[-15px] translate-y-[-15px] group-hover:text-danger-red/20 transition-colors duration-300">
                <FaQuoteRight />
              </div>
              <p className="text-text-muted text-lg italic mb-5 leading-relaxed relative z-10 font-body">"{text}"</p>
              <p className="text-accent-gold font-heading font-bold text-right text-xl relative z-10">— {author}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Gallery */}
      <motion.section
  id="gallery"
  className="bg-primary-dark px-4 sm:px-6 lg:px-8 py-20"
  variants={sectionVariants}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.1 }}
>
  <motion.h2
    className="text-accent-gold text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold mb-4 text-center tracking-tight relative inline-block pb-3"
    variants={textVariants}
  >
    Visual Diary of Splendor
  </motion.h2>
  <motion.span
    className="block h-1.5 bg-danger-red rounded-full mx-auto mb-16"
    variants={headingLineVariants}
  ></motion.span>

  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {galleryImages.map((src, idx) => (
      <motion.div
        key={idx}
        variants={itemVariants}
        className="relative group rounded-xl overflow-hidden shadow-soft-lg cursor-pointer border-2 border-transparent hover:border-accent-gold transition-all duration-500"
        onClick={() => setSelectedImage(src)}
        whileHover={{ scale: 1.05 }}
      >
        <img
          src={src}
          alt={`Gallery image ${idx + 1}`}
          className="object-cover w-full h-64 transition-transform duration-700 ease-in-out group-hover:scale-110"
        />
        <div
          className="absolute inset-0 bg-primary-dark/80 flex flex-col items-center justify-center text-text-light font-bold text-lg opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-400"
        >
          <FaSearchPlus className="h-10 w-10 mb-2 text-accent-gold" />
          <span className="font-heading text-xl">View Image</span>
        </div>
      </motion.div>
    ))}
  </div>
</motion.section>

{/* Lightbox Viewer */}
<AnimatePresence>
  {selectedImage && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-overlay-dark z-50 flex items-center justify-center p-4 backdrop-blur-md"
      onClick={closeLightbox}
    >
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={lightboxImageVariants}
        className="relative max-w-5xl w-full max-h-[90vh] overflow-hidden rounded-2xl shadow-soft-xl border-4 border-accent-gold"
        onClick={(e) => e.stopPropagation()}
      >
        <img src={selectedImage} alt="Enlarged" className="w-full h-full object-contain" />
        <motion.button
          onClick={closeLightbox}
          className="absolute top-5 right-5 text-text-light text-5xl font-bold bg-danger-red bg-opacity-80 rounded-full w-16 h-16 flex items-center justify-center transition-all duration-300 z-10 shadow-soft-lg border-2 border-text-light"
          aria-label="Close image"
          whileHover={{
            scale: 1.15,
            rotate: 90,
            backgroundColor: "#c21e56",
            color: "#fff",
            boxShadow: "var(--tw-shadow-button-red)",
          }}
          whileTap={{ scale: 0.9 }}
        >
          &times;
        </motion.button>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
    </div>
  );
}
