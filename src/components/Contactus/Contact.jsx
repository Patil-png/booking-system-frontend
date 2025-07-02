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

// import React, { useState } from "react";
// import axios from "axios";
// import { motion } from "framer-motion";
// import ReCAPTCHA from "react-google-recaptcha";
// import {
//   FaPhone,
//   FaMapMarkerAlt,
//   FaEnvelope,
//   FaFacebook,
//   FaInstagram,
//   FaTwitter,
// } from "react-icons/fa";

// function Contact() {
//   const [captchaToken, setCaptchaToken] = useState(null);
//   const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     inquiryType: "",
//     message: "",
//   });

//   const [status, setStatus] = useState("");

//   const handleChange = (e) =>
//     setFormData({ ...formData, [e.target.name]: e.target.value });

//   const isValidPhone = (phone) => {
//     const phoneRegex = /^[6-9]\d{9}$/;
//     return phoneRegex.test(phone);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!captchaToken) {
//       setStatus("❌ Please complete the reCAPTCHA verification.");
//       return;
//     }

//     if (!isValidPhone(formData.phone)) {
//       setStatus("❌ Please enter a valid 10-digit Indian phone number.");
//       return;
//     }

//     try {
//       await axios.post("http://localhost:5000/api/contact", formData);
//       setStatus("✅ Message sent successfully!");
//       setFormData({
//         name: "",
//         email: "",
//         phone: "",
//         inquiryType: "",
//         message: "",
//       });
//       setCaptchaToken(null);
//     } catch (error) {
//       console.error("Error sending message:", error);
//       setStatus("❌ Something went wrong. Please try again.");
//     }
//   };

//   return (
//     <div className="bg-gray-100 py-12 px-4 min-h-screen">
//       <div className="max-w-6xl mx-auto flex flex-col md:flex-row shadow-2xl rounded-xl overflow-hidden bg-white">
//         {/* Left Info Panel */}
//         <motion.div
//           className="md:w-1/2 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white p-10 flex flex-col justify-center border-b-8 border-yellow-400"
//           initial={{ x: -100, opacity: 0 }}
//           animate={{ x: 0, opacity: 1 }}
//           transition={{ duration: 0.8, ease: "easeOut" }}
//         >
//           <h2 className="text-4xl font-bold mb-6 text-yellow-300 drop-shadow">
//             Gouri Inn
//           </h2>
//           <p className="flex items-center mb-4 text-gray-200">
//             <FaMapMarkerAlt className="mr-2 text-yellow-300" /> Sharda Chowk,
//             Amravati, Maharashtra
//           </p>
//           <p className="flex items-center mb-4 text-gray-200">
//             <FaPhone className="mr-2 text-yellow-300" /> +91 98765 43210
//           </p>
//           <p className="flex items-center mb-4 text-gray-200">
//             <FaEnvelope className="mr-2 text-yellow-300" /> contact@gouriinn.com
//           </p>
//           <div className="flex gap-5 mt-6">
//             <a href="#" className="hover:text-yellow-300">
//               <FaFacebook size={24} />
//             </a>
//             <a href="#" className="hover:text-yellow-300">
//               <FaInstagram size={24} />
//             </a>
//             <a href="#" className="hover:text-yellow-300">
//               <FaTwitter size={24} />
//             </a>
//           </div>
//         </motion.div>

//         {/* Right Form Panel */}
//         <motion.div
//           className="md:w-1/2 p-10"
//           initial={{ x: 100, opacity: 0 }}
//           animate={{ x: 0, opacity: 1 }}
//           transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
//         >
//           <h2 className="text-3xl font-bold mb-6 text-gray-800">Contact Us</h2>
//           {status && (
//             <motion.p
//               className={`mb-4 font-semibold ${
//                 status.startsWith("✅") ? "text-green-600" : "text-red-500"
//               }`}
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//             >
//               {status}
//             </motion.p>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-5">
//             {["name", "email", "phone"].map((field, idx) => (
//               <motion.input
//                 key={field}
//                 type={
//                   field === "email"
//                     ? "email"
//                     : field === "phone"
//                     ? "tel"
//                     : "text"
//                 }
//                 name={field}
//                 placeholder={`Your ${field.charAt(0).toUpperCase() + field.slice(1)}`}
//                 required
//                 value={formData[field]}
//                 onChange={handleChange}
//                 pattern={field === "phone" ? "[6-9]{1}[0-9]{9}" : undefined}
//                 maxLength={field === "phone" ? "10" : undefined}
//                 title={
//                   field === "phone"
//                     ? "Please enter a valid 10-digit Indian phone number"
//                     : undefined
//                 }
//                 className="w-full border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 initial={{ scale: 0.95, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 1 }}
//                 transition={{ delay: 0.3 + idx * 0.1 }}
//               />
//             ))}

//             {/* Inquiry Type dropdown */}
//             <select
//               name="inquiryType"
//               value={formData.inquiryType}
//               onChange={handleChange}
//               required
//               className="w-full border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="" disabled>Select Inquiry Type</option>
//               <option value="Booking">Booking</option>
//               <option value="Support">Support</option>
//               <option value="Feedback">Feedback</option>
//               <option value="Other">Other</option>
//             </select>

//             <motion.textarea
//               name="message"
//               placeholder="Your Message"
//               required
//               value={formData.message}
//               onChange={handleChange}
//               className="w-full border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               rows={5}
//               initial={{ scale: 0.95, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               transition={{ delay: 0.6 }}
//             />

//             {/* reCAPTCHA */}
//             <div className="mt-2">
//               <ReCAPTCHA sitekey={siteKey} onChange={(token) => setCaptchaToken(token)} />
//             </div>

//             <motion.button
//               type="submit"
//               className="bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition font-semibold shadow-md"
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.97 }}
//             >
//               Send Message
//             </motion.button>
//           </form>
//         </motion.div>
//       </div>
//     </div>
//   );
// }

// export default Contact;


// import React, { useState } from "react";
// import axios from "axios";
// import { motion } from "framer-motion";
// import ReCAPTCHA from "react-google-recaptcha";
// import {
//   FaPhone,
//   FaMapMarkerAlt,
//   FaEnvelope,
//   FaFacebook,
//   FaInstagram,
//   FaTwitter,
// } from "react-icons/fa";

// function Contact() {
//   const [captchaToken, setCaptchaToken] = useState(null);
//   const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     inquiryType: "", // ✅ added
//     message: "",
//   });

//   const [status, setStatus] = useState("");

//   const handleChange = (e) =>
//     setFormData({ ...formData, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!captchaToken) {
//       setStatus("Please complete the reCAPTCHA verification.");
//       return;
//     }

//     try {
//       await axios.post("http://localhost:5000/api/contact", formData);
//       setStatus("✅ Message sent successfully!");
//       setFormData({
//         name: "",
//         email: "",
//         phone: "",
//         inquiryType: "", // reset
//         message: "",
//       });
//       setCaptchaToken(null);
//     } catch (error) {
//       console.error("Error sending message:", error);
//       setStatus("❌ Something went wrong. Please try again.");
//     }
//   };

//   return (
//     <div className="bg-gray-100 py-12 px-4 min-h-screen">
//       <div className="max-w-6xl mx-auto flex flex-col md:flex-row shadow-2xl rounded-xl overflow-hidden bg-white">
//         {/* Left Info Panel */}
//         <motion.div
//           className="md:w-1/2 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white p-10 flex flex-col justify-center border-b-8 border-yellow-400"
//           initial={{ x: -100, opacity: 0 }}
//           animate={{ x: 0, opacity: 1 }}
//           transition={{ duration: 0.8, ease: "easeOut" }}
//         >
//           <h2 className="text-4xl font-bold mb-6 text-yellow-300 drop-shadow">
//             Gouri Inn
//           </h2>
//           <p className="flex items-center mb-4 text-gray-200">
//             <FaMapMarkerAlt className="mr-2 text-yellow-300" /> Sharda Chowk,
//             Amravati, Maharashtra
//           </p>
//           <p className="flex items-center mb-4 text-gray-200">
//             <FaPhone className="mr-2 text-yellow-300" /> +91 98765 43210
//           </p>
//           <p className="flex items-center mb-4 text-gray-200">
//             <FaEnvelope className="mr-2 text-yellow-300" /> contact@gouriinn.com
//           </p>
//           <div className="flex gap-5 mt-6">
//             <a href="#" className="hover:text-yellow-300">
//               <FaFacebook size={24} />
//             </a>
//             <a href="#" className="hover:text-yellow-300">
//               <FaInstagram size={24} />
//             </a>
//             <a href="#" className="hover:text-yellow-300">
//               <FaTwitter size={24} />
//             </a>
//           </div>
//         </motion.div>

//         {/* Right Form Panel */}
//         <motion.div
//           className="md:w-1/2 p-10"
//           initial={{ x: 100, opacity: 0 }}
//           animate={{ x: 0, opacity: 1 }}
//           transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
//         >
//           <h2 className="text-3xl font-bold mb-6 text-gray-800">Contact Us</h2>
//           {status && (
//             <motion.p
//               className={`mb-4 font-semibold ${
//                 status.startsWith("✅")
//                   ? "text-green-600"
//                   : "text-red-500"
//               }`}
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//             >
//               {status}
//             </motion.p>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-5">
//             {["name", "email", "phone"].map((field, idx) => (
//               <motion.input
//                 key={field}
//                 type={
//                   field === "email"
//                     ? "email"
//                     : field === "phone"
//                     ? "tel"
//                     : "text"
//                 }
//                 name={field}
//                 placeholder={`Your ${field.charAt(0).toUpperCase() + field.slice(1)}`}
//                 required
//                 value={formData[field]}
//                 onChange={handleChange}
//                 className="w-full border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 initial={{ scale: 0.95, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 1 }}
//                 transition={{ delay: 0.3 + idx * 0.1 }}
//               />
//             ))}

//             {/* ✅ Inquiry Type dropdown */}
//             <select
//               name="inquiryType"
//               value={formData.inquiryType}
//               onChange={handleChange}
//               required
//               className="w-full border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="" disabled>Select Inquiry Type</option>
//               <option value="Booking">Booking</option>
//               <option value="Support">Support</option>
//               <option value="Feedback">Feedback</option>
//               <option value="Other">Other</option>
//             </select>

//             <motion.textarea
//               name="message"
//               placeholder="Your Message"
//               required
//               value={formData.message}
//               onChange={handleChange}
//               className="w-full border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               rows={5}
//               initial={{ scale: 0.95, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               transition={{ delay: 0.6 }}
//             />

//             {/* reCAPTCHA */}
//             <div className="mt-2">
//               <ReCAPTCHA sitekey={siteKey} onChange={(token) => setCaptchaToken(token)} />
//             </div>

//             <motion.button
//               type="submit"
//               className="bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition font-semibold shadow-md"
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.97 }}
//             >
//               Send Message
//             </motion.button>
//           </form>
//         </motion.div>
//       </div>
//     </div>
//   );
// }

// export default Contact;



// import React, { useState } from "react";
// import axios from "axios";
// import { motion } from "framer-motion";
// import ReCAPTCHA from "react-google-recaptcha";
// import {
//   FaPhone,
//   FaMapMarkerAlt,
//   FaEnvelope,
//   FaFacebook,
//   FaInstagram,
//   FaTwitter,
// } from "react-icons/fa";

// function Contact() {
//   const [captchaToken, setCaptchaToken] = useState(null);
//   const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     message: "",
//   });

//   const [status, setStatus] = useState("");

//   const handleChange = (e) =>
//     setFormData({ ...formData, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!captchaToken) {
//       setStatus("Please complete the reCAPTCHA verification.");
//       return;
//     }

//     try {
//       await axios.post("http://localhost:5000/api/contact", formData);
//       setStatus("Message sent successfully!");
//       setFormData({ name: "", email: "", phone: "", message: "" });
//       setCaptchaToken(null); // reset captcha token
//     } catch (error) {
//       console.error("Error sending message:", error);
//       setStatus("Something went wrong. Please try again.");
//     }
//   };

//   return (
//     <div className="bg-gray-100 py-12 px-4 min-h-screen">
//       <div className="max-w-6xl mx-auto flex flex-col md:flex-row shadow-2xl rounded-xl overflow-hidden bg-white">
//         {/* Left Info Panel */}
//         <motion.div
//           className="md:w-1/2 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white p-10 flex flex-col justify-center border-b-8 border-yellow-400"
//           initial={{ x: -100, opacity: 0 }}
//           animate={{ x: 0, opacity: 1 }}
//           transition={{ duration: 0.8, ease: "easeOut" }}
//         >
//           <h2 className="text-4xl font-bold mb-6 text-yellow-300 drop-shadow">
//             Gouri Inn
//           </h2>
//           <p className="flex items-center mb-4 text-gray-200">
//             <FaMapMarkerAlt className="mr-2 text-yellow-300" /> Sharda Chowk,
//             Amravati, Maharashtra
//           </p>
//           <p className="flex items-center mb-4 text-gray-200">
//             <FaPhone className="mr-2 text-yellow-300" /> +91 98765 43210
//           </p>
//           <p className="flex items-center mb-4 text-gray-200">
//             <FaEnvelope className="mr-2 text-yellow-300" /> contact@gouriinn.com
//           </p>
//           <div className="flex gap-5 mt-6">
//             <a href="#" className="hover:text-yellow-300">
//               <FaFacebook size={24} />
//             </a>
//             <a href="#" className="hover:text-yellow-300">
//               <FaInstagram size={24} />
//             </a>
//             <a href="#" className="hover:text-yellow-300">
//               <FaTwitter size={24} />
//             </a>
//           </div>
//         </motion.div>

//         {/* Right Form Panel */}
//         <motion.div
//           className="md:w-1/2 p-10"
//           initial={{ x: 100, opacity: 0 }}
//           animate={{ x: 0, opacity: 1 }}
//           transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
//         >
//           <h2 className="text-3xl font-bold mb-6 text-gray-800">Contact Us</h2>
//           {status && (
//             <motion.p
//               className="mb-4 text-green-600 font-semibold"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//             >
//               {status}
//             </motion.p>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-5">
//             {["name", "email", "phone"].map((field, idx) => (
//               <motion.input
//                 key={field}
//                 type={
//                   field === "email"
//                     ? "email"
//                     : field === "phone"
//                     ? "tel"
//                     : "text"
//                 }
//                 name={field}
//                 placeholder={`Your ${field.charAt(0).toUpperCase() + field.slice(1)}`}
//                 required
//                 value={formData[field]}
//                 onChange={handleChange}
//                 className="w-full border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 initial={{ scale: 0.95, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 1 }}
//                 transition={{ delay: 0.3 + idx * 0.1 }}
//               />
//             ))}

//             <motion.textarea
//               name="message"
//               placeholder="Your Message"
//               required
//               value={formData.message}
//               onChange={handleChange}
//               className="w-full border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               rows={5}
//               initial={{ scale: 0.95, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               transition={{ delay: 0.6 }}
//             />

//             {/* reCAPTCHA */}
//             <div className="mt-2">
//               <ReCAPTCHA sitekey={siteKey} onChange={(token) => setCaptchaToken(token)} />
//             </div>

//             <motion.button
//               type="submit"
//               className="bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition font-semibold shadow-md"
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.97 }}
//             >
//               Send Message
//             </motion.button>
//           </form>
//         </motion.div>
//       </div>
//     </div>
//   );
// }

// export default Contact;


// import React, { useState } from "react";
// import axios from "axios";
// import { motion } from "framer-motion";
// import ReCAPTCHA from "react-google-recaptcha";

// import {
//   FaPhone,
//   FaMapMarkerAlt,
//   FaEnvelope,
//   FaFacebook,
//   FaInstagram,
//   FaTwitter,
// } from "react-icons/fa";

// function Contact() {

//   const [captchaToken, setCaptchaToken] = useState(null);
// const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;


//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     message: "",
//   });
//   const [status, setStatus] = useState("");

//   const handleChange = (e) =>
//     setFormData({ ...formData, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post("http://localhost:5000/api/contact", formData);
//       setStatus("Message sent successfully!");
//       setFormData({ name: "", email: "", phone: "", message: "" });
//     } catch (error) {
//       console.error("Error sending message:", error);
//       setStatus("Something went wrong. Please try again.");
//     }
//   };

//   return (
//     <div className="bg-gray-100 py-12 px-4 min-h-screen">
//       <div className="max-w-6xl mx-auto flex flex-col md:flex-row shadow-2xl rounded-xl overflow-hidden bg-white">
        
//         {/* Left Info Panel */}
//         <motion.div
//   className="md:w-1/2 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white p-10 flex flex-col justify-center border-b-8 border-yellow-400"
//   initial={{ x: -100, opacity: 0 }}
//   animate={{ x: 0, opacity: 1 }}
//   transition={{ duration: 0.8, ease: "easeOut" }}
// >
//   <h2 className="text-4xl font-bold mb-6 text-yellow-300 drop-shadow">
//     Gouri Inn
//   </h2>
//   <p className="flex items-center mb-4 text-gray-200">
//     <FaMapMarkerAlt className="mr-2 text-yellow-300" /> Sharda Chowk, Amravati, Maharashtra
//   </p>
//   <p className="flex items-center mb-4 text-gray-200">
//     <FaPhone className="mr-2 text-yellow-300" /> +91 98765 43210
//   </p>
//   <p className="flex items-center mb-4 text-gray-200">
//     <FaEnvelope className="mr-2 text-yellow-300" /> contact@gouriinn.com
//   </p>
//   <div className="flex gap-5 mt-6">
//     <a href="#" className="hover:text-yellow-300">
//       <FaFacebook size={24} />
//     </a>
//     <a href="#" className="hover:text-yellow-300">
//       <FaInstagram size={24} />
//     </a>
//     <a href="#" className="hover:text-yellow-300">
//       <FaTwitter size={24} />
//     </a>
//   </div>
// </motion.div>


//         {/* Right Form Panel */}
//         <motion.div
//           className="md:w-1/2 p-10"
//           initial={{ x: 100, opacity: 0 }}
//           animate={{ x: 0, opacity: 1 }}
//           transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
//         >
//           <h2 className="text-3xl font-bold mb-6 text-gray-800">Contact Us</h2>
//           {status && (
//             <motion.p
//               className="mb-4 text-green-600 font-semibold"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//             >
//               {status}
//             </motion.p>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-5">
//             {["name", "email", "phone"].map((field, idx) => (
//               <motion.input
//                 key={field}
//                 type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
//                 name={field}
//                 placeholder={`Your ${field.charAt(0).toUpperCase() + field.slice(1)}`}
//                 required
//                 value={formData[field]}
//                 onChange={handleChange}
//                 className="w-full border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 initial={{ scale: 0.95, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 1 }}
//                 transition={{ delay: 0.3 + idx * 0.1 }}
//               />
//             ))}

//             <motion.textarea
//               name="message"
//               placeholder="Your Message"
//               required
//               value={formData.message}
//               onChange={handleChange}
//               className="w-full border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               rows={5}
//               initial={{ scale: 0.95, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               transition={{ delay: 0.6 }}
//             />

//             <motion.button
//               type="submit"
//               className="bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition font-semibold shadow-md"
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.97 }}
//             >
//               Send Message
//             </motion.button>
//           </form>
//         </motion.div>
//       </div>
//     </div>
//   );
// }

// export default Contact;


// import React, { useState } from "react";
// import axios from "axios";

// function Contact() {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     message: "",
//   });

//   const [status, setStatus] = useState("");

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post("http://localhost:5000/api/contact", formData);
//       setStatus("Message sent successfully!");
//       setFormData({ name: "", email: "", phone: "", message: "" });
//     } catch (error) {
//       console.error("Error sending message:", error);
//       setStatus("Something went wrong. Please try again.");
//     }
//   };

//   return (
//     <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded">
//       <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
//       {status && <p className="mb-4 text-sm text-blue-600">{status}</p>}
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input
//           type="text"
//           name="name"
//           placeholder="Your Name"
//           required
//           value={formData.name}
//           onChange={handleChange}
//           className="w-full border px-3 py-2 rounded"
//         />
//         <input
//           type="email"
//           name="email"
//           placeholder="Your Email"
//           required
//           value={formData.email}
//           onChange={handleChange}
//           className="w-full border px-3 py-2 rounded"
//         />
//         <input
//           type="tel"
//           name="phone"
//           placeholder="Your Phone"
//           required
//           value={formData.phone}
//           onChange={handleChange}
//           className="w-full border px-3 py-2 rounded"
//         />
//         <textarea
//           name="message"
//           placeholder="Your Message"
//           required
//           value={formData.message}
//           onChange={handleChange}
//           className="w-full border px-3 py-2 rounded"
//         />
//         <button
//           type="submit"
//           className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
//         >
//           Send Message
//         </button>
//       </form>
//     </div>
//   );
// }

// export default Contact;


// import React, { useState } from 'react';
// import axios from 'axios';
// import ReCAPTCHA from 'react-google-recaptcha';
// import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';

// const ContactForm = () => {
//   const [captchaToken, setCaptchaToken] = useState("");
//   const [form, setForm] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     inquiryType: 'Booking',
//     message: '',
//   });
//   const [loading, setLoading] = useState(false);
//   const [status, setStatus] = useState({ success: '', error: '' });

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleCaptchaChange = (token) => {
//     setCaptchaToken(token);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setStatus({ success: '', error: '' });

//     if (!captchaToken) {
//       setStatus({ success: '', error: 'Please complete the reCAPTCHA challenge.' });
//       setLoading(false);
//       return;
//     }

//     try {
//       const res = await axios.post('http://localhost:5000/api/contact', {
//         ...form,
//         captchaToken,
//       });

//       setStatus({ success: res.data.message, error: '' });
//       setForm({ name: '', email: '', phone: '', inquiryType: 'Booking', message: '' });
//       setCaptchaToken("");
//     } catch (err) {
//       setStatus({
//         success: '',
//         error: err.response?.data?.error || 'Something went wrong.',
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-red-50  flex items-center justify-center px-4 py-12">
//       <div className="max-w-7xl w-full flex flex-col md:flex-row bg-white bg-opacity-90 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden">
        
//         {/* LEFT PANEL - Contact Info */}
//         <div className="md:w-1/2 p-8 md:p-12 bg-indigo-800 text-white flex flex-col justify-center space-y-6">
//           <h2 className="text-4xl font-extrabold mb-2">Get in Touch</h2>
//           <p className="text-lg max-w-md">
//             We'd love to hear from you! Reach out with any questions or bookings.
//           </p>

//           <div className="space-y-4 text-sm md:text-base">
//             <div>
//               <strong>Address:</strong><br />
//               123 Hotel Street,<br />
//               Dream City, DC 45678
//             </div>
//             <div>
//               <strong>Phone:</strong><br />
//               +1 (555) 123-4567
//             </div>
//             <div>
//               <strong>Email:</strong><br />
//               contact@hotelname.com
//             </div>
//           </div>

//           <div>
//             <strong>Follow us:</strong>
//             <div className="flex space-x-6 mt-3 text-2xl">
//               <a
//                 href="https://facebook.com/yourhotel"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 aria-label="Facebook"
//                 className="hover:text-indigo-300 transition"
//               >
//                 <FaFacebookF />
//               </a>
//               <a
//                 href="https://instagram.com/yourhotel"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 aria-label="Instagram"
//                 className="hover:text-pink-400 transition"
//               >
//                 <FaInstagram />
//               </a>
//               <a
//                 href="https://twitter.com/yourhotel"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 aria-label="Twitter"
//                 className="hover:text-blue-400 transition"
//               >
//                 <FaTwitter />
//               </a>
//             </div>
//           </div>
          
//           {/* You can add a small embedded map or image here if you want */}
//         </div>

//         {/* RIGHT PANEL - Contact Form */}
//         <form
//           onSubmit={handleSubmit}
//           className="md:w-1/2 w-full p-8 md:p-12"
//         >
//           <h2 className="text-3xl font-extrabold mb-6 text-gray-900 tracking-wide text-center md:text-left">
//             Contact Us
//           </h2>

//           {status.success && <div className="text-green-700 mb-4 font-semibold text-center md:text-left">{status.success}</div>}
//           {status.error && <div className="text-red-600 mb-4 font-semibold text-center md:text-left">{status.error}</div>}

//           <input
//             type="text"
//             name="name"
//             placeholder="Name"
//             value={form.name}
//             onChange={handleChange}
//             required
//             className="w-full p-3 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
//           />
//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={form.email}
//             onChange={handleChange}
//             required
//             className="w-full p-3 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
//           />
//           <input
//             type="text"
//             name="phone"
//             placeholder="Phone"
//             value={form.phone}
//             onChange={handleChange}
//             className="w-full p-3 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
//           />
//           <select
//             name="inquiryType"
//             value={form.inquiryType}
//             onChange={handleChange}
//             className="w-full p-3 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
//           >
//             <option value="Booking">Booking</option>
//             <option value="Feedback">Feedback</option>
//             <option value="Support">Support</option>
//             <option value="Other">Other</option>
//           </select>
//           <textarea
//             name="message"
//             placeholder="Your message"
//             value={form.message}
//             onChange={handleChange}
//             required
//             rows={5}
//             className="w-full p-3 mb-6 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none"
//           />

//           {/* Google reCAPTCHA */}
//           <div className="mb-6 flex justify-center">
//             <ReCAPTCHA
//               sitekey="6LcrDE8rAAAAAH39AobZt2fdZglUMsY_kEUAaTkm"
//               onChange={handleCaptchaChange}
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-400 transition font-semibold text-lg"
//           >
//             {loading ? 'Sending...' : 'Submit'}
//           </button>
//         </form>

//       </div>

//       <style >{`
//         @keyframes fade-in-up {
//           0% {
//             opacity: 0;
//             transform: translateY(20px);
//           }
//           100% {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//         form {
//           animation-name: fade-in-up;
//           animation-fill-mode: forwards;
//           animation-timing-function: ease-out;
//           animation-duration: 800ms;
//         }
//         @media (max-width: 768px) {
//           .max-w-7xl {
//             flex-direction: column;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default ContactForm;

