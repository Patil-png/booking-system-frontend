import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHome, FaBed, FaPhone, FaArrowLeft } from 'react-icons/fa';
import SEOHead from '../SEO/SEOHead';

const NotFound = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Page Not Found - StayLuxe Hotel",
    "description": "The page you're looking for doesn't exist. Explore our luxury hotel accommodations and services.",
    "url": "https://your-domain.com/404"
  };

  return (
    <>
      <SEOHead 
        title="Page Not Found | StayLuxe Hotel"
        description="The page you're looking for doesn't exist. Explore our luxury hotel accommodations and services."
        keywords="404, page not found, hotel booking, luxury accommodation"
        structuredData={structuredData}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-[#f8f5f0] to-[#e8e0d0] flex items-center justify-center px-4">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* 404 Number */}
            <div className="text-8xl md:text-9xl font-bold text-[#7a5a2f] mb-4">
              404
            </div>
            
            {/* Error Message */}
            <h1 className="text-3xl md:text-4xl font-bold text-[#3d2c1e] mb-4">
              Oops! Page Not Found
            </h1>
            
            <p className="text-lg text-[#6b5b4a] mb-8 max-w-md mx-auto">
              The page you're looking for doesn't exist. But don't worry, you can still explore our luxury accommodations and services.
            </p>
            
            {/* Navigation Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Link
                to="/"
                className="flex items-center justify-center gap-2 bg-[#7a5a2f] text-white px-6 py-3 rounded-lg hover:bg-[#b88a2b] transition-colors duration-300"
              >
                <FaHome className="w-5 h-5" />
                <span>Go Home</span>
              </Link>
              
              <Link
                to="/Rooms"
                className="flex items-center justify-center gap-2 bg-white text-[#7a5a2f] border-2 border-[#7a5a2f] px-6 py-3 rounded-lg hover:bg-[#7a5a2f] hover:text-white transition-colors duration-300"
              >
                <FaBed className="w-5 h-5" />
                <span>View Rooms</span>
              </Link>
              
              <Link
                to="/contact"
                className="flex items-center justify-center gap-2 bg-white text-[#7a5a2f] border-2 border-[#7a5a2f] px-6 py-3 rounded-lg hover:bg-[#7a5a2f] hover:text-white transition-colors duration-300"
              >
                <FaPhone className="w-5 h-5" />
                <span>Contact Us</span>
              </Link>
            </div>
            
            {/* Back Button */}
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 text-[#7a5a2f] hover:text-[#b88a2b] transition-colors duration-300 mx-auto"
            >
              <FaArrowLeft className="w-4 h-4" />
              <span>Go Back</span>
            </button>
            
            {/* Additional Help */}
            <div className="mt-12 p-6 bg-white rounded-lg shadow-sm border border-[#e0cba8]">
              <h2 className="text-xl font-semibold text-[#3d2c1e] mb-3">
                Need Help?
              </h2>
              <p className="text-[#6b5b4a] mb-4">
                If you're looking for something specific, try these popular pages:
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <Link
                  to="/room-booking"
                  className="text-[#7a5a2f] hover:text-[#b88a2b] underline"
                >
                  Book a Room
                </Link>
                <span className="text-[#6b5b4a]">•</span>
                <Link
                  to="/gallery"
                  className="text-[#7a5a2f] hover:text-[#b88a2b] underline"
                >
                  Photo Gallery
                </Link>
                <span className="text-[#6b5b4a]">•</span>
                <Link
                  to="/Seva/EventWedding"
                  className="text-[#7a5a2f] hover:text-[#b88a2b] underline"
                >
                  Events & Weddings
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
