import React, { useState, useEffect, useRef } from "react";
import Slider from "react-slick";
import { motion, AnimatePresence } from "framer-motion";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const fallbackImage = "/fallback.jpg";

const Gallery = () => {
  const sliderRef = useRef(null);
  const [activeTab, setActiveTab] = useState("all");
  const [allFetchedImages, setAllFetchedImages] = useState([]);
  const [images, setImages] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [fullScreenOpen, setFullScreenOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/gallery-images`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        const processedData = data.map(item => ({
          ...item,
          image: item.image || fallbackImage,
          category: item.category || 'uncategorized',
          alt: item.alt || 'Gallery image',
        }));
        setAllFetchedImages(processedData);
        setImages(processedData);
      } catch (err) {
        setError(err.message || "Failed to load images.");
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  useEffect(() => {
    const filtered =
      activeTab === "all"
        ? allFetchedImages
        : allFetchedImages.filter((img) => img.category?.toLowerCase() === activeTab.toLowerCase());

    setImages(filtered);
    setSelectedIndex(0);
    setTimeout(() => {
      sliderRef.current?.slickGoTo(0, true);
    }, 50);
  }, [activeTab, allFetchedImages]);

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    fade: true,
    beforeChange: (_, next) => setSelectedIndex(next),
    prevArrow: <SamplePrevArrow />,
    nextArrow: <SampleNextArrow />,
  };

  function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <motion.div
        className={`${className} custom-arrow left-2 sm:left-4 z-20 !flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full p-2 cursor-pointer shadow-xl hover:shadow-2xl backdrop-blur-sm`}
        style={{ 
          ...style, 
          display: "flex", 
          width: '48px', 
          height: '48px',
          background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'
        }}
        onClick={onClick}
        whileHover={{ 
          scale: 1.15, 
          boxShadow: '0 12px 24px rgba(59, 130, 246, 0.5)',
          background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)'
        }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
        </svg>
      </motion.div>
    );
  }

  function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <motion.div
        className={`${className} custom-arrow right-2 sm:right-4 z-20 !flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full p-2 cursor-pointer shadow-xl hover:shadow-2xl backdrop-blur-sm`}
        style={{ 
          ...style, 
          display: "flex", 
          width: '48px', 
          height: '48px',
          background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'
        }}
        onClick={onClick}
        whileHover={{ 
          scale: 1.15, 
          boxShadow: '0 12px 24px rgba(59, 130, 246, 0.5)',
          background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)'
        }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.3 }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      </motion.div>
    );
  }

  const openFullScreen = () => setFullScreenOpen(true);
  const closeFullScreen = () => setFullScreenOpen(false);
  const handleImageError = (e) => {
    e.target.src = fallbackImage;
    e.target.onerror = null;
  };

  const staggerContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white px-4">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative mb-8">
            <motion.div
              className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-0 w-20 h-20 border-4 border-purple-500 border-b-transparent rounded-full mx-auto"
              animate={{ rotate: -360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
          </div>
          <motion.h2
            className="text-2xl sm:text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Loading Gallery
          </motion.h2>
          <p className="text-gray-300 text-lg">Fetching beautiful moments...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-900 via-red-800 to-red-900 text-white px-4">
        <motion.div
          className="text-center max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="mb-6"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5, repeat: 3 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </motion.div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Gallery Unavailable</h2>
          <p className="text-red-200 mb-2">Error: {error}</p>
          <p className="text-red-300">Please check your connection or try again later.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 text-white font-sans"
      initial="hidden"
      animate="visible"
      variants={staggerContainerVariants}
    >
      <header className="relative py-6 sm:py-12 px-4 text-center bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 shadow-2xl border-b border-blue-500/30 overflow-hidden">
        <motion.div
          className="absolute inset-0 opacity-10"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            ease: "linear",
            repeat: Infinity,
          }}
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.1) 0px, rgba(255,255,255,0.1) 2px, transparent 2px, transparent 12px)',
            backgroundSize: '24px 24px',
          }}
        />
        
        <motion.div
          className="absolute top-8 left-8 w-4 h-4 bg-blue-400 rounded-full opacity-60"
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-8 right-8 w-6 h-6 bg-purple-400 rounded-full opacity-40"
          animate={{
            y: [0, 15, 0],
            x: [0, -15, 0],
            scale: [1, 0.8, 1],
          }}
          transition={{ duration: 5, repeat: Infinity }}
        />

        <motion.h1
          className="text-3xl sm:text-5xl lg:text-6xl font-extrabold mb-2 sm:mb-4 relative z-10"
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 120, damping: 10 }}
        >
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-2xl">
            Gallery
          </span>
        </motion.h1>
        <motion.p
          className="text-gray-300 text-sm sm:text-lg lg:text-xl relative z-10 max-w-2xl mx-auto leading-relaxed"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Discover the enchanting beauty and elegant spaces of Gouri Inn
        </motion.p>
      </header>

      <motion.nav
        className="flex flex-nowrap justify-center gap-2 sm:gap-6 mt-8 sm:mt-12 mb-8 sm:mb-16 flex-wrap px-2"
        variants={staggerContainerVariants}
      >
        {["all", "room", "lawn"].map((tab) => (
          <motion.button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 sm:px-6 py-2 sm:py-3 text-xs sm:text-base lg:text-lg font-bold rounded-full border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/50 backdrop-blur-sm whitespace-nowrap
              ${activeTab === tab
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent shadow-xl shadow-blue-500/25 scale-105"
                : "text-blue-300 border-blue-400/50 bg-white/5 hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-purple-600/20 hover:text-white hover:shadow-lg hover:border-blue-300"
              }`}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            variants={itemVariants}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {activeTab === tab && (
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-lg"
                layoutId="activeTab"
              />
            )}
          </motion.button>
        ))}
      </motion.nav>

      {images.length === 0 && !loading && !error ? (
        <motion.div
          className="text-center py-20 px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="mb-6"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </motion.div>
          <p className="text-gray-400 text-xl sm:text-2xl font-medium">No images found for this category</p>
          <p className="text-gray-500 mt-2">Try selecting a different category above</p>
        </motion.div>
      ) : (
        <>
          <motion.div
            className="max-w-6xl mx-auto px-4 mb-12 sm:mb-16 relative"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 p-2 sm:p-4">
              <Slider ref={sliderRef} {...sliderSettings}>
                {images.map((img, idx) => (
                  <div key={img._id || idx} className="px-1 focus:outline-none">
                    <motion.div
                      className="relative group cursor-pointer"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                      onClick={openFullScreen}
                    >
                      <img
                        src={img.image}
                        alt={img.alt || `Slide ${idx + 1}`}
                        onError={handleImageError}
                        className="w-full h-[300px] sm:h-[450px] lg:h-[600px] object-cover rounded-xl shadow-xl"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        whileHover={{ scale: 1.1 }}
                      >
                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                          </svg>
                        </div>
                      </motion.div>
                    </motion.div>
                    {img.alt && (
                      <motion.p
                        className="text-center text-gray-300 mt-4 text-base sm:text-lg font-light italic px-4"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        {img.alt}
                      </motion.p>
                    )}
                  </div>
                ))}
              </Slider>
              {images.length > 0 && (
                <motion.div
                  className="absolute top-4 sm:top-6 right-4 sm:right-6 bg-black/50 backdrop-blur-sm text-white px-3 sm:px-4 py-2 rounded-full text-sm sm:text-base z-10 font-semibold border border-white/20"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  {selectedIndex + 1} / {images.length}
                </motion.div>
              )}
            </div>
          </motion.div>

          <motion.div
            className="max-w-6xl mx-auto px-4 mb-16 sm:mb-20"
            variants={staggerContainerVariants}
          >
            <motion.h3
              className="text-2xl sm:text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
              variants={itemVariants}
            >
              Quick View
            </motion.h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4">
              {images.map((img, idx) => (
                <motion.div
                  key={img._id || idx}
                  whileHover={{ scale: 1.08, y: -4 }}
                  whileTap={{ scale: 0.92 }}
                  className={`relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300 group ${
                    selectedIndex === idx 
                      ? "ring-4 ring-blue-500 shadow-2xl shadow-blue-500/25" 
                      : "ring-2 ring-white/20 hover:ring-blue-400/50 shadow-lg"
                  }`}
                  onClick={() => {
                    setSelectedIndex(idx);
                    sliderRef.current?.slickGoTo(idx);
                  }}
                  variants={itemVariants}
                >
                  <img
                    src={img.image}
                    alt={img.alt || `Thumb ${idx + 1}`}
                    onError={handleImageError}
                    className="w-full h-20 sm:h-24 lg:h-28 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {selectedIndex === idx && (
                    <motion.div
                      className="absolute inset-0 bg-blue-500/20 flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="bg-blue-500 rounded-full p-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </>
      )}

      <AnimatePresence>
        {fullScreenOpen && images[selectedIndex] && (
          <motion.div
            className="fixed inset-0 bg-black/95 backdrop-blur-lg flex justify-center items-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeFullScreen}
          >
            <motion.div
              className="relative max-w-full max-h-full flex items-center justify-center"
              initial={{ scale: 0.7, rotateY: 90, opacity: 0 }}
              animate={{ scale: 1, rotateY: 0, opacity: 1 }}
              exit={{ scale: 0.7, rotateY: -90, opacity: 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 15 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={images[selectedIndex].image}
                alt={images[selectedIndex].alt || "Full Image"}
                onError={handleImageError}
                className="max-w-full max-h-[90vh] rounded-2xl shadow-2xl object-contain border-4 border-white/20"
              />
              
              <motion.button
                onClick={closeFullScreen}
                className="absolute top-4 right-4 text-white bg-red-500/80 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center hover:bg-red-600 transition-all duration-300 z-50 shadow-xl border-2 border-white/20"
                aria-label="Close image"
                whileHover={{ 
                  scale: 1.15, 
                  rotate: 90, 
                  backgroundColor: 'rgba(239, 68, 68, 0.9)',
                  boxShadow: '0 8px 32px rgba(239, 68, 68, 0.4)'
                }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>

              <motion.div
                className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white text-base sm:text-lg bg-black/50 backdrop-blur-sm px-6 py-3 rounded-full font-medium border border-white/20 max-w-sm text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ delay: 0.2 }}
              >
                {images[selectedIndex].alt || `Image ${selectedIndex + 1}`}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Gallery;



// import React, { useState, useEffect, useRef } from "react";
// import Slider from "react-slick";
// import { motion, AnimatePresence } from "framer-motion";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

// const fallbackImage = "/fallback.jpg"; // if you have a local fallback image

// const Gallery = () => {
//   const sliderRef = useRef(null);
//   const [activeTab, setActiveTab] = useState("all");
//   const [allFetchedImages, setAllFetchedImages] = useState([]);
//   const [images, setImages] = useState([]);
//   const [selectedIndex, setSelectedIndex] = useState(0);
//   const [fullScreenOpen, setFullScreenOpen] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchImages = async () => {
//       try {
//         setLoading(true);
//         setError(null);
//         const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/gallery-images`);
//         if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
//         const data = await response.json();
//         // Ensure data has necessary properties, or add fallbacks
//         const processedData = data.map(item => ({
//           ...item,
//           image: item.image || fallbackImage, // Ensure image URL exists
//           category: item.category || 'uncategorized', // Ensure category exists
//           alt: item.alt || 'Gallery image', // Ensure alt text exists
//         }));
//         setAllFetchedImages(processedData);
//         setImages(processedData);
//       } catch (err) {
//         setError(err.message || "Failed to load images.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchImages();
//   }, []);

//   useEffect(() => {
//     const filtered =
//       activeTab === "all"
//         ? allFetchedImages
//         : allFetchedImages.filter((img) => img.category?.toLowerCase() === activeTab.toLowerCase());

//     setImages(filtered);
//     setSelectedIndex(0);
//     // Use setTimeout to ensure slickGoTo is called after images state potentially updates,
//     // which can sometimes cause a flicker or incorrect slide if not synchronized.
//     setTimeout(() => {
//       sliderRef.current?.slickGoTo(0, true); // `true` for immediate jump without animation
//     }, 50); // Small delay
//   }, [activeTab, allFetchedImages]);

//   const sliderSettings = {
//     dots: false,
//     infinite: true,
//     speed: 600,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     arrows: true,
//     fade: true,
//     beforeChange: (_, next) => setSelectedIndex(next),
//     // Custom arrow icons for a more polished look
//     prevArrow: <SamplePrevArrow />,
//     nextArrow: <SampleNextArrow />,
//   };

//   // Custom Arrows for Slick Carousel
//   function SamplePrevArrow(props) {
//     const { className, style, onClick } = props;
//     return (
//       <motion.div
//         className={`${className} custom-arrow left-2 sm:left-4 z-20 !flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full p-2 cursor-pointer shadow-xl hover:shadow-2xl backdrop-blur-sm`}
//         style={{ 
//           ...style, 
//           display: "flex", 
//           width: '48px', 
//           height: '48px',
//           background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'
//         }}
//         onClick={onClick}
//         whileHover={{ 
//           scale: 1.15, 
//           boxShadow: '0 12px 24px rgba(59, 130, 246, 0.5)',
//           background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)'
//         }}
//         whileTap={{ scale: 0.9 }}
//         initial={{ opacity: 0, x: -20 }}
//         animate={{ opacity: 1, x: 0 }}
//         exit={{ opacity: 0, x: -20 }}
//         transition={{ duration: 0.3 }}
//       >
//         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
//         </svg>
//       </motion.div>
//     );
//   }

//   function SampleNextArrow(props) {
//     const { className, style, onClick } = props;
//     return (
//       <motion.div
//         className={`${className} custom-arrow right-2 sm:right-4 z-20 !flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full p-2 cursor-pointer shadow-xl hover:shadow-2xl backdrop-blur-sm`}
//         style={{ 
//           ...style, 
//           display: "flex", 
//           width: '48px', 
//           height: '48px',
//           background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'
//         }}
//         onClick={onClick}
//         whileHover={{ 
//           scale: 1.15, 
//           boxShadow: '0 12px 24px rgba(59, 130, 246, 0.5)',
//           background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)'
//         }}
//         whileTap={{ scale: 0.9 }}
//         initial={{ opacity: 0, x: 20 }}
//         animate={{ opacity: 1, x: 0 }}
//         exit={{ opacity: 0, x: 20 }}
//         transition={{ duration: 0.3 }}
//       >
//         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
//         </svg>
//       </motion.div>
//     );
//   }

//   const openFullScreen = () => setFullScreenOpen(true);
//   const closeFullScreen = () => setFullScreenOpen(false);
//   const handleImageError = (e) => {
//     e.target.src = fallbackImage;
//     e.target.onerror = null; // Prevent endless loop if fallback also fails
//   };

//   const staggerContainerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1,
//       },
//     },
//   };

//   const itemVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: { y: 0, opacity: 1 },
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white px-4">
//         <motion.div
//           className="text-center"
//           initial={{ opacity: 0, scale: 0.8 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.6 }}
//         >
//           <div className="relative mb-8">
//             <motion.div
//               className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"
//               animate={{ rotate: 360 }}
//               transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//             />
//             <motion.div
//               className="absolute inset-0 w-20 h-20 border-4 border-purple-500 border-b-transparent rounded-full mx-auto"
//               animate={{ rotate: -360 }}
//               transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
//             />
//           </div>
//           <motion.h2
//             className="text-2xl sm:text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
//             animate={{ opacity: [0.5, 1, 0.5] }}
//             transition={{ duration: 2, repeat: Infinity }}
//           >
//             Loading Gallery
//           </motion.h2>
//           <p className="text-gray-300 text-lg">Fetching beautiful moments...</p>
//         </motion.div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-900 via-red-800 to-red-900 text-white px-4">
//         <motion.div
//           className="text-center max-w-md"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//         >
//           <motion.div
//             className="mb-6"
//             animate={{ rotate: [0, 10, -10, 0] }}
//             transition={{ duration: 0.5, repeat: 3 }}
//           >
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//           </motion.div>
//           <h2 className="text-2xl sm:text-3xl font-bold mb-4">Gallery Unavailable</h2>
//           <p className="text-red-200 mb-2">Error: {error}</p>
//           <p className="text-red-300">Please check your connection or try again later.</p>
//         </motion.div>
//       </div>
//     );
//   }

//   return (
//     <motion.div
//       className="min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 text-white font-sans"
//       initial="hidden"
//       animate="visible"
//       variants={staggerContainerVariants}
//     >
//       {/* Header */}
//       <header className="relative py-12 sm:py-16 px-4 text-center bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 shadow-2xl border-b border-blue-500/30 overflow-hidden">
//         {/* Animated background pattern */}
//         <motion.div
//           className="absolute inset-0 opacity-10"
//           animate={{
//             backgroundPosition: ['0% 0%', '100% 100%'],
//           }}
//           transition={{
//             duration: 20,
//             ease: "linear",
//             repeat: Infinity,
//           }}
//           style={{
//             backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.1) 0px, rgba(255,255,255,0.1) 2px, transparent 2px, transparent 12px)',
//             backgroundSize: '24px 24px',
//           }}
//         />
        
//         {/* Floating decorative elements */}
//         <motion.div
//           className="absolute top-8 left-8 w-4 h-4 bg-blue-400 rounded-full opacity-60"
//           animate={{
//             y: [0, -20, 0],
//             x: [0, 10, 0],
//             scale: [1, 1.2, 1],
//           }}
//           transition={{ duration: 4, repeat: Infinity }}
//         />
//         <motion.div
//           className="absolute bottom-8 right-8 w-6 h-6 bg-purple-400 rounded-full opacity-40"
//           animate={{
//             y: [0, 15, 0],
//             x: [0, -15, 0],
//             scale: [1, 0.8, 1],
//           }}
//           transition={{ duration: 5, repeat: Infinity }}
//         />

//         <motion.h1
//           className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 relative z-10"
//           initial={{ y: -60, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ duration: 0.8, type: "spring", stiffness: 120, damping: 10 }}
//         >
//           <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-2xl">
//             Gallery
//           </span>
//         </motion.h1>
//         <motion.p
//           className="text-gray-300 text-base sm:text-lg lg:text-xl relative z-10 max-w-2xl mx-auto leading-relaxed"
//           initial={{ y: -30, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ duration: 0.8, delay: 0.2 }}
//         >
//           Discover the enchanting beauty and elegant spaces of Gouri Inn
//         </motion.p>
//       </header>

//       {/* Navigation Tabs */}
//       <motion.nav
//         className="flex justify-center gap-3 sm:gap-6 mt-8 sm:mt-12 mb-8 sm:mb-16 flex-wrap px-4"
//         variants={staggerContainerVariants}
//       >
//         {["all", "room", "lawn"].map((tab) => (
//           <motion.button
//             key={tab}
//             onClick={() => setActiveTab(tab)}
//             className={`px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base lg:text-lg font-bold rounded-full border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/50 backdrop-blur-sm
//               ${activeTab === tab
//                 ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent shadow-xl shadow-blue-500/25 scale-105"
//                 : "text-blue-300 border-blue-400/50 bg-white/5 hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-purple-600/20 hover:text-white hover:shadow-lg hover:border-blue-300"
//               }`}
//             whileHover={{ scale: 1.05, y: -2 }}
//             whileTap={{ scale: 0.95 }}
//             variants={itemVariants}
//           >
//             {tab.charAt(0).toUpperCase() + tab.slice(1)}
//             {activeTab === tab && (
//               <motion.div
//                 className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-lg"
//                 layoutId="activeTab"
//               />
//             )}
//           </motion.button>
//         ))}
//       </motion.nav>

//       {/* Conditional Rendering for No Images */}
//       {images.length === 0 && !loading && !error ? (
//         <motion.div
//           className="text-center py-20 px-4"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//         >
//           <motion.div
//             className="mb-6"
//             animate={{ rotate: [0, 10, -10, 0] }}
//             transition={{ duration: 2, repeat: Infinity }}
//           >
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//             </svg>
//           </motion.div>
//           <p className="text-gray-400 text-xl sm:text-2xl font-medium">No images found for this category</p>
//           <p className="text-gray-500 mt-2">Try selecting a different category above</p>
//         </motion.div>
//       ) : (
//         <>
//           {/* Main Slider */}
//           <motion.div
//             className="max-w-6xl mx-auto px-4 mb-12 sm:mb-16 relative"
//             initial={{ opacity: 0, y: 50 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.7, delay: 0.3 }}
//           >
//             <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 p-2 sm:p-4">
//               <Slider ref={sliderRef} {...sliderSettings}>
//                 {images.map((img, idx) => (
//                   <div key={img._id || idx} className="px-1 focus:outline-none">
//                     <motion.div
//                       className="relative group cursor-pointer"
//                       whileHover={{ scale: 1.02 }}
//                       transition={{ duration: 0.3 }}
//                       onClick={openFullScreen}
//                     >
//                       <img
//                         src={img.image}
//                         alt={img.alt || `Slide ${idx + 1}`}
//                         onError={handleImageError}
//                         className="w-full h-[300px] sm:h-[450px] lg:h-[600px] object-cover rounded-xl shadow-xl"
//                       />
//                       <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//                       <motion.div
//                         className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
//                         whileHover={{ scale: 1.1 }}
//                       >
//                         <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
//                           <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
//                           </svg>
//                         </div>
//                       </motion.div>
//                     </motion.div>
//                     {img.alt && (
//                       <motion.p
//                         className="text-center text-gray-300 mt-4 text-base sm:text-lg font-light italic px-4"
//                         initial={{ opacity: 0, y: 10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ delay: 0.5 }}
//                       >
//                         {img.alt}
//                       </motion.p>
//                     )}
//                   </div>
//                 ))}
//               </Slider>
//               {images.length > 0 && (
//                 <motion.div
//                   className="absolute top-4 sm:top-6 right-4 sm:right-6 bg-black/50 backdrop-blur-sm text-white px-3 sm:px-4 py-2 rounded-full text-sm sm:text-base z-10 font-semibold border border-white/20"
//                   initial={{ opacity: 0, x: 20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ delay: 0.8 }}
//                 >
//                   {selectedIndex + 1} / {images.length}
//                 </motion.div>
//               )}
//             </div>
//           </motion.div>

//           {/* Thumbnails */}
//           <motion.div
//             className="max-w-6xl mx-auto px-4 mb-16 sm:mb-20"
//             variants={staggerContainerVariants}
//           >
//             <motion.h3
//               className="text-2xl sm:text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
//               variants={itemVariants}
//             >
//               Quick View
//             </motion.h3>
//             <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4">
//               {images.map((img, idx) => (
//                 <motion.div
//                   key={img._id || idx}
//                   whileHover={{ scale: 1.08, y: -4 }}
//                   whileTap={{ scale: 0.92 }}
//                   className={`relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300 group ${
//                     selectedIndex === idx 
//                       ? "ring-4 ring-blue-500 shadow-2xl shadow-blue-500/25" 
//                       : "ring-2 ring-white/20 hover:ring-blue-400/50 shadow-lg"
//                   }`}
//                   onClick={() => {
//                     setSelectedIndex(idx);
//                     sliderRef.current?.slickGoTo(idx);
//                   }}
//                   variants={itemVariants}
//                 >
//                   <img
//                     src={img.image}
//                     alt={img.alt || `Thumb ${idx + 1}`}
//                     onError={handleImageError}
//                     className="w-full h-20 sm:h-24 lg:h-28 object-cover transition-transform duration-300 group-hover:scale-110"
//                   />
//                   <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//                   {selectedIndex === idx && (
//                     <motion.div
//                       className="absolute inset-0 bg-blue-500/20 flex items-center justify-center"
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                       transition={{ duration: 0.2 }}
//                     >
//                       <div className="bg-blue-500 rounded-full p-1">
//                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                         </svg>
//                       </div>
//                     </motion.div>
//                   )}
//                 </motion.div>
//               ))}
//             </div>
//           </motion.div>
//         </>
//       )}

//       {/* Lightbox */}
//       <AnimatePresence>
//         {fullScreenOpen && images[selectedIndex] && (
//           <motion.div
//             className="fixed inset-0 bg-black/95 backdrop-blur-lg flex justify-center items-center z-50 p-4"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             onClick={closeFullScreen}
//           >
//             <motion.div
//               className="relative max-w-full max-h-full flex items-center justify-center"
//               initial={{ scale: 0.7, rotateY: 90, opacity: 0 }}
//               animate={{ scale: 1, rotateY: 0, opacity: 1 }}
//               exit={{ scale: 0.7, rotateY: -90, opacity: 0 }}
//               transition={{ type: "spring", stiffness: 120, damping: 15 }}
//               onClick={(e) => e.stopPropagation()}
//             >
//               <img
//                 src={images[selectedIndex].image}
//                 alt={images[selectedIndex].alt || "Full Image"}
//                 onError={handleImageError}
//                 className="max-w-full max-h-[90vh] rounded-2xl shadow-2xl object-contain border-4 border-white/20"
//               />
              
//               {/* Close button */}
//               <motion.button
//                 onClick={closeFullScreen}
//                 className="absolute top-4 right-4 text-white bg-red-500/80 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center hover:bg-red-600 transition-all duration-300 z-50 shadow-xl border-2 border-white/20"
//                 aria-label="Close image"
//                 whileHover={{ 
//                   scale: 1.15, 
//                   rotate: 90, 
//                   backgroundColor: 'rgba(239, 68, 68, 0.9)',
//                   boxShadow: '0 8px 32px rgba(239, 68, 68, 0.4)'
//                 }}
//                 whileTap={{ scale: 0.9 }}
//                 initial={{ opacity: 0, scale: 0 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0 }}
//                 transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </motion.button>

//               {/* Image caption */}
//               <motion.div
//                 className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white text-base sm:text-lg bg-black/50 backdrop-blur-sm px-6 py-3 rounded-full font-medium border border-white/20 max-w-sm text-center"
//                 initial={{ opacity: 0, y: 30 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: 30 }}
//                 transition={{ delay: 0.2 }}
//               >
//                 {images[selectedIndex].alt || `Image ${selectedIndex + 1}`}
//               </motion.div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </motion.div>
//   );
// };

// export default Gallery;
