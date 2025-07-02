
import React, { useState, useEffect, useRef } from "react";
import Slider from "react-slick";
import { motion, AnimatePresence } from "framer-motion";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const fallbackImage = "/fallback.jpg"; // ✅ local fallback

const Gallery = () => {
  const [images, setImages] = useState([]);
  const BASE_URL = import.meta.env.VITE_API_URL;
  const sliderRef = useRef(null);
  const [activeTab, setActiveTab] = useState("all");
  const [allFetchedImages, setAllFetchedImages] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [fullScreenOpen, setFullScreenOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
  const fetchImages = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/gallery`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      const processedData = data.map(item => ({
  ...item,
  image: item.image?.startsWith("http")
    ? item.image
    : `${import.meta.env.VITE_API_URL}${item.image}`,
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
        className={`${className} custom-arrow left-4 z-10 !flex items-center justify-center bg-teal-500 text-white rounded-full p-2 cursor-pointer shadow-lg`}
        style={{ ...style, display: "flex", width: '40px', height: '40px' }}
        onClick={onClick}
        whileHover={{ scale: 1.15, backgroundColor: '#2dd4bf', boxShadow: '0 8px 16px rgba(0,0,0,0.4)' }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </motion.div>
    );
  }

  function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <motion.div
        className={`${className} custom-arrow right-4 z-10 !flex items-center justify-center bg-teal-500 text-white rounded-full p-2 cursor-pointer shadow-lg`}
        style={{ ...style, display: "flex", width: '40px', height: '40px' }}
        onClick={onClick}
        whileHover={{ scale: 1.15, backgroundColor: '#2dd4bf', boxShadow: '0 8px 16px rgba(0,0,0,0.4)' }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.3 }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </motion.div>
    );
  }

  const openFullScreen = () => setFullScreenOpen(true);
  const closeFullScreen = () => setFullScreenOpen(false);
const handleImageError = (e) => {
  e.target.src = fallbackImage;
  e.target.onerror = null; // prevent infinite error loop
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-teal-300 text-2xl animate-pulse">
        <svg className="animate-spin h-10 w-10 mb-4 text-teal-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Fetching beautiful moments...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-red-800 text-white text-xl p-4 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="font-bold mb-2">Oops! Couldn't load the gallery.</p>
        <p>Error: {error}</p>
        <p className="mt-4 text-lg">Please check your connection or try again later.</p>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen overflow-hidden bg-gradient-to-br from-gray-950 to-gray-800 text-white font-sans"
      initial="hidden"
      animate="visible"
      variants={staggerContainerVariants}
    >
      {/* Header */}
      <header className="py-8 px-4 text-center bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-2xl border-b-4 border-teal-600 relative overflow-hidden">
        {/* Subtle geometric background pattern for header */}
        <motion.div
          className="absolute inset-0 z-0 opacity-10"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            ease: "linear",
            repeat: Infinity,
          }}
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 2px, transparent 2px, transparent 10px)',
            backgroundSize: '20px 20px',
          }}
        />
        <motion.h1
          className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-teal-400 uppercase tracking-wider relative z-10 drop-shadow-xl"
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 120, damping: 10 }}
        >
          Gallery
        </motion.h1>
        <motion.p
          className="text-gray-300 text-sm md:text-base mt-2 relative z-10"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Exploring the beauty of Gouri inn
        </motion.p>
      </header>

      {/* Navigation Tabs */}
      <motion.nav
        className="flex justify-center gap-3 sm:gap-4 mt-8 mb-12 flex-wrap px-4"
        variants={staggerContainerVariants}
      >
        {["all", "room", "lawn"].map((tab) => (
          <motion.button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 text-sm sm:text-base font-bold rounded-full border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-teal-500 focus:ring-opacity-50
              ${activeTab === tab
                ? "bg-teal-500 text-white border-teal-500 shadow-xl transform scale-110"
                : "text-teal-300 border-teal-300 hover:bg-teal-400 hover:text-white hover:shadow-lg"
              }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            variants={itemVariants}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </motion.button>
        ))}
      </motion.nav>

      {/* Conditional Rendering for No Images */}
      {images.length === 0 && !loading && !error ? (
        <motion.div
          className="text-center text-gray-400 text-xl py-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p>No images found for this category. Please try another tab.</p>
        </motion.div>
      ) : (
        <>
          {/* Main Slider */}
          <motion.div
            className="max-w-5xl mx-auto px-4 mb-10 relative"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <Slider ref={sliderRef} {...sliderSettings}>
              {images.map((img, idx) => (
                <div key={img._id || idx} className="px-1 focus:outline-none">
                  <motion.img
                    src={img.image}
                    alt={img.alt || `Slide ${idx + 1}`}
                    onClick={openFullScreen}
                    onError={handleImageError}
                    className="w-full h-[280px] sm:h-[450px] md:h-[550px] object-cover rounded-xl border-4 border-gray-700 hover:border-teal-400 cursor-pointer transition duration-300 shadow-xl"
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  />
                  {img.alt && (
                    <motion.p
                      className="text-center text-gray-300 mt-3 text-base md:text-lg font-light italic"
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
                className="absolute top-4 right-4 bg-gray-700 bg-opacity-80 text-teal-300 px-3 py-1 rounded-full text-sm z-10 font-semibold"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
              >
                {selectedIndex + 1} / {images.length}
              </motion.div>
            )}
          </motion.div>

          {/* Thumbnails */}
          <motion.div
            className="max-w-6xl mx-auto px-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mb-16"
            variants={staggerContainerVariants}
          >
            {images.map((img, idx) => (
              <motion.div
                key={img._id || idx}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                className={`rounded-lg overflow-hidden border-3 ${
                  selectedIndex === idx ? "border-teal-400 shadow-2xl" : "border-gray-700 hover:border-teal-300"
                } cursor-pointer transition-all duration-300 flex items-center justify-center`}
                onClick={() => {
                  setSelectedIndex(idx);
                  sliderRef.current?.slickGoTo(idx);
                }}
                variants={itemVariants}
              >
                <img
                  src={img.image}
                  alt={img.alt || `Thumb ${idx + 1}`}
                  className="w-full h-28 object-cover transform hover:scale-115 transition duration-300"
                  onError={handleImageError}
                />
              </motion.div>
            ))}
          </motion.div>
        </>
      )}


      {/* Lightbox */}
      <AnimatePresence>
        {fullScreenOpen && images[selectedIndex] && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-95 flex justify-center items-center z-50 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeFullScreen}
          >
            <motion.img
              src={images[selectedIndex].image}
              alt={images[selectedIndex].alt || "Full Image"}
              initial={{ scale: 0.7, rotateY: 90, opacity: 0 }}
              animate={{ scale: 1, rotateY: 0, opacity: 1 }}
              exit={{ scale: 0.7, rotateY: -90, opacity: 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 15 }}
              className="max-w-full max-h-[90vh] rounded-xl shadow-2xl border-4 border-teal-400 object-contain"
              onClick={(e) => e.stopPropagation()}
              onError={handleImageError}
            />
            <motion.button
              onClick={closeFullScreen}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white text-3xl font-bold bg-teal-600 rounded-full w-12 h-12 flex items-center justify-center hover:bg-red-600 transition-all duration-300 z-50 shadow-xl"
              aria-label="Close image"
              whileHover={{ scale: 1.15, rotate: 90, backgroundColor: '#dc2626', boxShadow: '0 8px 20px rgba(0,0,0,0.6)' }} // Spin and turn red on hover
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            >
              &times;
            </motion.button>
            <motion.div
              className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-lg bg-gray-800 bg-opacity-70 px-5 py-2 rounded-full hidden sm:block font-medium"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ delay: 0.2 }}
            >
              {images[selectedIndex].alt || `Image ${selectedIndex + 1}`}
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

// const fallbackImage = "https://via.placeholder.com/600x400?text=Image+Not+Found";

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
//         const response = await fetch("http://localhost:5000/api/gallery-images");
//         if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
//         const data = await response.json();
//         setAllFetchedImages(data);
//         setImages(data);
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
//     sliderRef.current?.slickGoTo(0);
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
//   };

//   const openFullScreen = () => setFullScreenOpen(true);
//   const closeFullScreen = () => setFullScreenOpen(false);
//   const handleImageError = (e) => {
//     e.target.src = fallbackImage;
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-[#0f172a] text-yellow-400 text-2xl">
//         Loading gallery...
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-red-800 text-white text-xl">
//         Error: {error}
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen overflow-hidden bg-[#101010] text-white font-serif">
//       <header className="py-6 px-4 text-center bg-gradient-to-r from-[#1e1e2f] via-[#3d3d5c] to-[#f5c242] shadow-xl border-b-2 border-[#fcd34d]"
// >
//         <h1 className="text-2xl md:text-3xl font-bold text-yellow-300 uppercase tracking-wide">
//           Taj Gallery Showcase
//         </h1>
//       </header>

//       <nav className="flex justify-center gap-4 mt-6 mb-10 flex-wrap px-4">
//         {["all", "room", "lawn"].map((tab) => (
//           <button
//             key={tab}
//             onClick={() => setActiveTab(tab)}
//             className={`px-5 py-2 text-sm md:text-base font-semibold rounded-full border-2 transition-all duration-300 ${
//               activeTab === tab
//                 ? "bg-yellow-400 text-black border-yellow-400"
//                 : "text-yellow-300 border-yellow-300 hover:bg-yellow-400 hover:text-black"
//             }`}
//           >
//             {tab.charAt(0).toUpperCase() + tab.slice(1)}
//           </button>
//         ))}
//       </nav>

//       {/* Slider */}
//       <div className="max-w-5xl mx-auto px-4 mb-10">
//         <Slider ref={sliderRef} {...sliderSettings}>
//           {images.map((img, idx) => (
//             <div key={img._id || idx}>
//               <img
//                 src={img.image}
//                 alt={img.alt || `Slide ${idx}`}
//                 onClick={openFullScreen}
//                 onError={handleImageError}
//                 className="w-full h-[220px] sm:h-[360px] md:h-[420px] object-cover rounded-xl border-4 border-transparent hover:border-yellow-400 cursor-pointer transition duration-300"
//               />
//             </div>
//           ))}
//         </Slider>
//       </div>

//       {/* Thumbnails */}
//       <div className="max-w-6xl mx-auto px-4 grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-3 mb-16">
//         {images.map((img, idx) => (
//           <motion.div
//             key={img._id || idx}
//             whileHover={{ scale: 1.05 }}
//             className={`rounded-md overflow-hidden border-2 ${
//               selectedIndex === idx ? "border-yellow-400" : "border-transparent"
//             } cursor-pointer transition`}
//             onClick={() => {
//               setSelectedIndex(idx);
//               sliderRef.current?.slickGoTo(idx);
//             }}
//           >
//             <img
//               src={img.image}
//               alt={img.alt || `Thumb ${idx}`}
//               className="w-full h-20 object-cover"
//               onError={handleImageError}
//             />
//           </motion.div>
//         ))}
//       </div>

//       {/* Lightbox */}
//       <AnimatePresence>
//         {fullScreenOpen && images[selectedIndex] && (
//           <motion.div
//             className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50 p-4"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             onClick={closeFullScreen}
//           >
//             <motion.img
//               src={images[selectedIndex].image}
//               alt={images[selectedIndex].alt || "Full Image"}
//               initial={{ scale: 0.9 }}
//               animate={{ scale: 1 }}
//               exit={{ scale: 0.9 }}
//               className="max-w-full max-h-full rounded-xl shadow-2xl"
//               onClick={(e) => e.stopPropagation()}
//             />
//             <button
//               onClick={closeFullScreen}
//               className="absolute top-5 right-5 text-white text-2xl font-bold bg-yellow-500 rounded-full w-10 h-10 flex items-center justify-center hover:bg-yellow-400"
//             >
//               &times;
//             </button>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default Gallery;


// // Gallery.jsx

// import React, { useState, useEffect, useRef } from "react";
// import Slider from "react-slick";
// import { motion, AnimatePresence } from "framer-motion";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

// const fallbackImage = "https://via.placeholder.com/600x400?text=Image+Not+Found";

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
//         const response = await fetch("http://localhost:5000/api/gallery-images");
//         if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
//         const data = await response.json();
//         setAllFetchedImages(data);
//         setImages(data);
//       } catch (err) {
//         setError(err.message || "Failed to load images.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchImages();
//   }, []);

//   useEffect(() => {
//     const filtered = activeTab === "all"
//       ? allFetchedImages
//       : allFetchedImages.filter(img => img.category?.toLowerCase() === activeTab.toLowerCase());

//     setImages(filtered);
//     setSelectedIndex(0);
//     sliderRef.current?.slickGoTo(0);
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
//   };

//   const openFullScreen = () => setFullScreenOpen(true);
//   const closeFullScreen = () => setFullScreenOpen(false);

//   const handleImageError = (e) => {
//     e.target.src = fallbackImage;
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-[#0f172a] text-yellow-400 text-2xl">
//         <div className="spinner"></div>
//         Loading gallery...
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-red-800 text-white text-xl">
//         Error: {error}
//       </div>
//     );
//   }

//   return (
//     <div className="overflow-hidden min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-white font-sans">
//       <header className="py-6 px-2 bg-gradient-to-r from-[#a4508b] via-[#5f0a87] to-[#2f0743] shadow-lg text-center">
//         <h1 className="text-xl font-extrabold tracking-wider md:text-xl lg:text-2xl">
//           PHOTOS & AMENITIES
//         </h1>
//       </header>

//       <nav className="flex justify-center space-x-8 my-8">
//         {["all", "room", "lawn"].map((tab) => (
//           <button
//             key={tab}
//             onClick={() => setActiveTab(tab)}
//             className={`px-5 py-2 rounded-full text-lg font-semibold transition-all duration-300 ${
//               activeTab === tab
//                 ? "bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white shadow-lg"
//                 : "text-purple-300 hover:bg-purple-600 hover:text-white"
//             }`}
//           >
//             {tab.charAt(0).toUpperCase() + tab.slice(1)}
//           </button>
//         ))}
//       </nav>

//       {images.length > 0 ? (
//         <>
//           <div className="max-w-4xl mx-auto mb-8 px-2">
//             <Slider ref={sliderRef} {...sliderSettings}>
//               {images.map((img, idx) => (
//                 <div key={img._id || idx}>
//                   <img
//                     src={img.image}
//                     alt={img.alt || `Slide ${idx}`}
//                     className="w-full h-[400px] object-cover cursor-pointer rounded-xl border-4 border-transparent hover:border-purple-600"
//                     onClick={openFullScreen}
//                     onError={handleImageError}
//                   />
//                 </div>
//               ))}
//             </Slider>
//           </div>

//           <div className="max-w-6xl mx-auto px-6 mt-8 grid grid-cols-3 sm:grid-cols-6 gap-4">
//             {images.map((img, idx) => (
//               <motion.div
//                 key={img._id || idx}
//                 onClick={() => {
//                   setSelectedIndex(idx);
//                   sliderRef.current?.slickGoTo(idx);
//                 }}
//                 className="cursor-pointer rounded-xl overflow-hidden border-2 border-transparent hover:border-fuchsia-500 transition shadow-lg"
//                 whileHover={{ scale: 1.1 }}
//               >
//                 <img
//                   src={img.image}
//                   alt={img.alt || `Thumbnail ${idx + 1}`}
//                   className={`w-full h-24 object-cover ${selectedIndex === idx ? "border-fuchsia-500 border-2" : ""}`}
//                   onError={handleImageError}
//                 />
//               </motion.div>
//             ))}
//           </div>

//           <AnimatePresence>
//             {fullScreenOpen && images[selectedIndex] && (
//               <motion.div
//                 className="fixed inset-0 bg-black bg-opacity-95 flex justify-center items-center z-50 p-4"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 onClick={closeFullScreen}
//               >
//                 <motion.img
//                   src={images[selectedIndex].image}
//                   alt={images[selectedIndex].alt || "Full Screen Image"}
//                   className="max-h-full max-w-full rounded-lg shadow-2xl"
//                   initial={{ scale: 0.9 }}
//                   animate={{ scale: 1 }}
//                   exit={{ scale: 0.9 }}
//                   onClick={(e) => e.stopPropagation()}
//                   onError={handleImageError}
//                 />
//                 <button
//                   onClick={closeFullScreen}
//                   className="absolute top-8 right-8 text-white text-3xl pb-2 font-bold bg-purple-700 rounded-full w-10 h-10 flex justify-center items-center hover:bg-purple-800"
//                 >
//                   &times;
//                 </button>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </>
//       ) : (
//         <div className="text-center text-gray-400 py-20 text-xl">
//           No images to display in this category.
//         </div>
//       )}
//       <br />
//       <br />
//     </div>
//   );
// };

// export default Gallery;