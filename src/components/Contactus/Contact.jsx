import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import ReCAPTCHA from "react-google-recaptcha";
import {
  FaPhone,
  FaMapMarkerAlt,
  FaEnvelope,
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
} from "react-icons/fa";

function Contact() {
  const [captchaToken, setCaptchaToken] = useState(null);
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY; // Ensure this is correctly configured in your .env

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    inquiryType: "",
    message: "",
  });

  const [status, setStatus] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const isValidPhone = (phone) => {
    // Regex for 10-digit Indian phone numbers starting with 6-9
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending..."); // Provide immediate feedback

    if (!captchaToken) {
      setStatus("❌ Please complete the reCAPTCHA verification.");
      return;
    }

    if (!isValidPhone(formData.phone)) {
      setStatus("❌ Please enter a valid 10-digit Indian phone number.");
      return;
    }

    try {
      // You might want to include the captchaToken in your backend request
      // axios.post("http://localhost:5000/api/contact", { ...formData, captchaToken });
      await axios.post("http://localhost:5000/api/contact", formData);
      setStatus("✅ Message sent successfully! We'll get back to you soon.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        inquiryType: "",
        message: "",
      });
      setCaptchaToken(null); // Reset reCAPTCHA
      // Manually reset reCAPTCHA if necessary, depending on the library's behavior
      if (window.grecaptcha) {
        window.grecaptcha.reset();
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setStatus("❌ Something went wrong. Please try again later.");
    }
  };

  // Animation variants for sections
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  // Animation variants for individual form fields/elements
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="bg-gray-50 font-sans min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-7xl mx-auto flex flex-col md:flex-row bg-white rounded-2xl shadow-3xl overflow-hidden"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Left Info Panel */}
        <motion.div
          className="md:w-1/2 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-10 lg:p-14 flex flex-col justify-between relative overflow-hidden"
          variants={itemVariants}
        >
          {/* Background circles for aesthetic */}
          <div className="absolute -top-10 -left-10 w-48 h-48 bg-yellow-400 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-pink-500 rounded-full opacity-10 blur-3xl"></div>

          <div>
            <h2 className="text-5xl font-extrabold mb-6 text-yellow-300 drop-shadow-lg leading-tight">
              Gouri Inn
            </h2>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              We're here to help! Reach out to us for any inquiries, bookings, or feedback.
            </p>

            <div className="space-y-5">
              <p className="flex items-start text-gray-200 text-lg">
                <FaMapMarkerAlt className="mr-3 mt-1 text-yellow-300 flex-shrink-0" size={20} />{" "}
                Sharda Chowk, Amravati, Maharashtra, India - 444601
              </p>
              <p className="flex items-center text-gray-200 text-lg">
                <FaPhone className="mr-3 text-yellow-300" size={20} /> +91 98765 43210
              </p>
              <p className="flex items-center text-gray-200 text-lg">
                <FaEnvelope className="mr-3 text-yellow-300" size={20} /> contact@gouriinn.com
              </p>
            </div>
          </div>

          <div className="flex gap-6 mt-10 justify-center md:justify-start">
            <motion.a
              href="#"
              className="text-gray-300 hover:text-yellow-300 transition-colors duration-300 transform hover:scale-125"
              whileHover={{ scale: 1.2, y: -2 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Facebook"
            >
              <FaFacebookF size={28} />
            </motion.a>
            <motion.a
              href="#"
              className="text-gray-300 hover:text-yellow-300 transition-colors duration-300 transform hover:scale-125"
              whileHover={{ scale: 1.2, y: -2 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Instagram"
            >
              <FaInstagram size={28} />
            </motion.a>
            <motion.a
              href="#"
              className="text-gray-300 hover:text-yellow-300 transition-colors duration-300 transform hover:scale-125"
              whileHover={{ scale: 1.2, y: -2 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Twitter"
            >
              <FaTwitter size={28} />
            </motion.a>
            <motion.a
              href="#"
              className="text-gray-300 hover:text-yellow-300 transition-colors duration-300 transform hover:scale-125"
              whileHover={{ scale: 1.2, y: -2 }}
              whileTap={{ scale: 0.95 }}
              aria-label="LinkedIn"
            >
              <FaLinkedinIn size={28} />
            </motion.a>
          </div>
        </motion.div>

        {/* Right Form Panel */}
        <motion.div
          className="md:w-1/2 p-10 lg:p-14 bg-white"
          variants={itemVariants}
        >
          <h2 className="text-4xl font-bold mb-8 text-gray-900 leading-tight">
            Send Us a Message
          </h2>
          {status && (
            <motion.p
              className={`mb-6 text-lg font-semibold px-4 py-2 rounded-lg ${
                status.startsWith("✅")
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {status}
            </motion.p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {["name", "email", "phone"].map((field, idx) => (
              <motion.div key={field} variants={itemVariants}>
                <label htmlFor={field} className="sr-only">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  type={
                    field === "email" ? "email" : field === "phone" ? "tel" : "text"
                  }
                  name={field}
                  id={field}
                  placeholder={`Your ${field.charAt(0).toUpperCase() + field.slice(1)}`}
                  required
                  value={formData[field]}
                  onChange={handleChange}
                  pattern={field === "phone" ? "[6-9]{1}[0-9]{9}" : undefined}
                  maxLength={field === "phone" ? "10" : undefined}
                  title={
                    field === "phone"
                      ? "Please enter a valid 10-digit Indian phone number"
                      : undefined
                  }
                  // MODIFIED CLASSES FOR BOX STYLE
                  className="w-full border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-500 transition-all duration-300 text-lg"
                />
              </motion.div>
            ))}

            {/* Inquiry Type dropdown */}
            <motion.div variants={itemVariants}>
              <label htmlFor="inquiryType" className="sr-only">
                Inquiry Type
              </label>
              <select
                name="inquiryType"
                id="inquiryType"
                value={formData.inquiryType}
                onChange={handleChange}
                required
                // MODIFIED CLASSES FOR BOX STYLE
                className="w-full border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 transition-all duration-300 text-lg appearance-none"
              >
                <option value="" disabled>
                  Select Inquiry Type
                </option>
                <option value="Booking">Booking</option>
                <option value="Support">Support</option>
                <option value="Feedback">Feedback</option>
                <option value="Other">Other</option>
              </select>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label htmlFor="message" className="sr-only">
                Your Message
              </label>
              <textarea
                name="message"
                id="message"
                placeholder="Your Message"
                required
                value={formData.message}
                onChange={handleChange}
                // MODIFIED CLASSES FOR BOX STYLE
                className="w-full border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-500 transition-all duration-300 text-lg min-h-[120px] resize-y"
                rows={4}
              />
            </motion.div>

            {/* reCAPTCHA */}
            <motion.div className="mt-4" variants={itemVariants}>
              <ReCAPTCHA sitekey={siteKey} onChange={(token) => setCaptchaToken(token)} />
            </motion.div>

            <motion.button
              type="submit"
              className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 transition-all duration-300 font-bold text-xl shadow-lg transform hover:scale-105 active:scale-98 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              whileHover={{ scale: 1.02, boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)" }}
              whileTap={{ scale: 0.98 }}
            >
              Send Message
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Contact;
