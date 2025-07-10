// src/components/Contact.jsx
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
  FaPaperPlane,
  FaHotel,
} from "react-icons/fa";

function Contact() {
  const [captchaToken, setCaptchaToken] = useState(null);
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

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

  const isValidPhone = (phone) => /^[6-9]\d{9}$/.test(phone);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");

    if (!captchaToken) {
      setStatus("❌ Please complete the reCAPTCHA verification.");
      return;
    }

    if (!isValidPhone(formData.phone)) {
      setStatus("❌ Please enter a valid 10-digit Indian phone number.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/contact", formData);
      setStatus("✅ Message sent successfully! We'll get back to you soon.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        inquiryType: "",
        message: "",
      });
      setCaptchaToken(null);
      if (window.grecaptcha) window.grecaptcha.reset();
    } catch (error) {
      console.error("Error sending message:", error);
      setStatus("❌ Something went wrong. Please try again later.");
    }
  };

  const socialIcons = [
    { Icon: FaFacebookF, href: "#", label: "Facebook" },
    { Icon: FaInstagram, href: "#", label: "Instagram" },
    { Icon: FaTwitter, href: "#", label: "Twitter" },
    { Icon: FaLinkedinIn, href: "#", label: "LinkedIn" },
  ];

  const features = [
    {
      title: "24/7 Support",
      description: "Round-the-clock assistance for all your needs",
      icon: "🕒",
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Quick Response",
      description: "We typically respond within 2-4 hours",
      icon: "⚡",
      color: "from-green-500 to-green-600"
    },
    {
      title: "Expert Team",
      description: "Professional staff ready to help you",
      icon: "👥",
      color: "from-purple-500 to-purple-600"
    }
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4 sm:px-6 md:px-8 overflow-x-hidden">
      {/* Header */}
      <motion.div
        className="text-center mb-10 sm:mb-12"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-4 sm:mb-6">
          <FaHotel className="text-white text-2xl" />
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2">
          Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Touch</span>
        </h1>
        <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto">
          Ready to experience luxury at Gouri Inn? We're here to make your stay unforgettable.
        </p>
      </motion.div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Info Panel */}
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-6 sm:p-8 md:p-12 text-white relative overflow-hidden">
            <div className="absolute -top-20 -left-20 w-32 h-32 bg-blue-500 rounded-full opacity-10 blur-xl"></div>
            <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-indigo-500 rounded-full opacity-10 blur-xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500 rounded-full opacity-5 blur-xl"></div>

            <div className="relative z-10 space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300">
                  Gouri Inn
                </h2>
                <p className="text-gray-300 text-sm sm:text-base">
                  Experience luxury, comfort, and exceptional hospitality. We're here to help with any inquiries, bookings, or feedback.
                </p>
              </div>

              <div className="space-y-5 text-sm sm:text-base">
                {[
                  { Icon: FaMapMarkerAlt, text: "Sharda Chowk, Amravati, Maharashtra, India - 444601", color: "text-blue-300" },
                  { Icon: FaPhone, text: "+91 98765 43210", color: "text-green-300" },
                  { Icon: FaEnvelope, text: "contact@gouriinn.com", color: "text-purple-300" },
                ].map(({ Icon, text, color }, idx) => (
                  <div key={idx} className="flex items-start group cursor-pointer">
                    <Icon className={`mr-3 mt-1 ${color}`} size={18} />
                    <span className="text-gray-200 group-hover:text-white transition">{text}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-start gap-3 mt-4">
                {socialIcons.map(({ Icon, href, label }, index) => (
                  <a
                    key={label}
                    href={href}
                    className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/20 transition border border-white/20"
                    aria-label={label}
                  >
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form Panel */}
          <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 md:p-12 border border-gray-100">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-900">Send Us a Message</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-6"></div>

            {status && (
              <div
                className={`mb-6 p-4 rounded-xl border-l-4 ${
                  status.startsWith("✅")
                    ? "bg-green-50 border-green-400 text-green-800"
                    : status.startsWith("Sending")
                    ? "bg-blue-50 border-blue-400 text-blue-800"
                    : "bg-red-50 border-red-400 text-red-800"
                }`}
              >
                <p className="font-medium">{status}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {["name", "email"].map((field) => (
                  <div key={field}>
                    <label className="block mb-2 text-sm font-semibold text-gray-700">
                      {field.charAt(0).toUpperCase() + field.slice(1)} *
                    </label>
                    <input
                      type={field === "email" ? "email" : "text"}
                      name={field}
                      required
                      value={formData[field]}
                      onChange={handleChange}
                      placeholder={`Enter your ${field}`}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 bg-gray-50 text-gray-800"
                    />
                  </div>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    pattern="[6-9]{1}[0-9]{9}"
                    maxLength="10"
                    placeholder="10-digit phone number"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 bg-gray-50 text-gray-800"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">Inquiry Type *</label>
                  <select
                    name="inquiryType"
                    required
                    value={formData.inquiryType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 bg-gray-50 text-gray-800"
                  >
                    <option value="">Select inquiry type</option>
                    <option value="Booking">Booking</option>
                    <option value="Support">Support</option>
                    <option value="Feedback">Feedback</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">Your Message *</label>
                <textarea
                  name="message"
                  rows="5"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your requirements or questions..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 bg-gray-50 text-gray-800 resize-y"
                />
              </div>

              <div className="transform scale-[0.85] sm:scale-100 origin-left">
                <ReCAPTCHA
                  sitekey={siteKey || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"}
                  onChange={(token) => setCaptchaToken(token)}
                />
              </div>

              <button
                type="submit"
                disabled={status === "Sending..."}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 sm:py-4 px-6 rounded-xl font-semibold text-base sm:text-lg hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <FaPaperPlane />
                {status === "Sending..." ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 shadow-lg border text-center hover:shadow-xl transition"
            >
              <div className={`w-14 h-14 bg-gradient-to-r ${f.color} rounded-full mx-auto flex items-center justify-center text-2xl mb-4`}>
                {f.icon}
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">{f.title}</h3>
              <p className="text-sm sm:text-base text-gray-600">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
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
//   FaFacebookF,
//   FaInstagram,
//   FaTwitter,
//   FaLinkedinIn,
// } from "react-icons/fa";

// function Contact() {
//   const [captchaToken, setCaptchaToken] = useState(null);
//   const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY; // Ensure this is correctly configured in your .env

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
//     // Regex for 10-digit Indian phone numbers starting with 6-9
//     const phoneRegex = /^[6-9]\d{9}$/;
//     return phoneRegex.test(phone);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setStatus("Sending..."); // Provide immediate feedback

//     if (!captchaToken) {
//       setStatus("❌ Please complete the reCAPTCHA verification.");
//       return;
//     }

//     if (!isValidPhone(formData.phone)) {
//       setStatus("❌ Please enter a valid 10-digit Indian phone number.");
//       return;
//     }

//     try {
//       // You might want to include the captchaToken in your backend request
//       // axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/contact`, { ...formData, captchaToken });
//       await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/contact`, formData);
//       setStatus("✅ Message sent successfully! We'll get back to you soon.");
//       setFormData({
//         name: "",
//         email: "",
//         phone: "",
//         inquiryType: "",
//         message: "",
//       });
//       setCaptchaToken(null); // Reset reCAPTCHA
//       // Manually reset reCAPTCHA if necessary, depending on the library's behavior
//       if (window.grecaptcha) {
//         window.grecaptcha.reset();
//       }
//     } catch (error) {
//       console.error("Error sending message:", error);
//       setStatus("❌ Something went wrong. Please try again later.");
//     }
//   };

//   // Animation variants for sections
//   const containerVariants = {
//     hidden: { opacity: 0, scale: 0.95 },
//     visible: {
//       opacity: 1,
//       scale: 1,
//       transition: {
//         duration: 0.7,
//         ease: "easeOut",
//         when: "beforeChildren",
//         staggerChildren: 0.1,
//       },
//     },
//   };

//   // Animation variants for individual form fields/elements
//   const itemVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: {
//       y: 0,
//       opacity: 1,
//       transition: {
//         duration: 0.5,
//         ease: "easeOut",
//       },
//     },
//   };

//   return (
//     <div className="bg-gray-50 font-sans min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
//       <motion.div
//         className="max-w-7xl mx-auto flex flex-col md:flex-row bg-white rounded-2xl shadow-3xl overflow-hidden"
//         variants={containerVariants}
//         initial="hidden"
//         animate="visible"
//       >
//         {/* Left Info Panel */}
//         <motion.div
//           className="md:w-1/2 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-10 lg:p-14 flex flex-col justify-between relative overflow-hidden"
//           variants={itemVariants}
//         >
//           {/* Background circles for aesthetic */}
//           <div className="absolute -top-10 -left-10 w-48 h-48 bg-yellow-400 rounded-full opacity-10 blur-3xl"></div>
//           <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-pink-500 rounded-full opacity-10 blur-3xl"></div>

//           <div>
//             <h2 className="text-5xl font-extrabold mb-6 text-yellow-300 drop-shadow-lg leading-tight">
//               Gouri Inn
//             </h2>
//             <p className="text-gray-300 text-lg mb-8 leading-relaxed">
//               We're here to help! Reach out to us for any inquiries, bookings, or feedback.
//             </p>

//             <div className="space-y-5">
//               <p className="flex items-start text-gray-200 text-lg">
//                 <FaMapMarkerAlt className="mr-3 mt-1 text-yellow-300 flex-shrink-0" size={20} />{" "}
//                 Sharda Chowk, Amravati, Maharashtra, India - 444601
//               </p>
//               <p className="flex items-center text-gray-200 text-lg">
//                 <FaPhone className="mr-3 text-yellow-300" size={20} /> +91 98765 43210
//               </p>
//               <p className="flex items-center text-gray-200 text-lg">
//                 <FaEnvelope className="mr-3 text-yellow-300" size={20} /> contact@gouriinn.com
//               </p>
//             </div>
//           </div>

//           <div className="flex gap-6 mt-10 justify-center md:justify-start">
//             <motion.a
//               href="#"
//               className="text-gray-300 hover:text-yellow-300 transition-colors duration-300 transform hover:scale-125"
//               whileHover={{ scale: 1.2, y: -2 }}
//               whileTap={{ scale: 0.95 }}
//               aria-label="Facebook"
//             >
//               <FaFacebookF size={28} />
//             </motion.a>
//             <motion.a
//               href="#"
//               className="text-gray-300 hover:text-yellow-300 transition-colors duration-300 transform hover:scale-125"
//               whileHover={{ scale: 1.2, y: -2 }}
//               whileTap={{ scale: 0.95 }}
//               aria-label="Instagram"
//             >
//               <FaInstagram size={28} />
//             </motion.a>
//             <motion.a
//               href="#"
//               className="text-gray-300 hover:text-yellow-300 transition-colors duration-300 transform hover:scale-125"
//               whileHover={{ scale: 1.2, y: -2 }}
//               whileTap={{ scale: 0.95 }}
//               aria-label="Twitter"
//             >
//               <FaTwitter size={28} />
//             </motion.a>
//             <motion.a
//               href="#"
//               className="text-gray-300 hover:text-yellow-300 transition-colors duration-300 transform hover:scale-125"
//               whileHover={{ scale: 1.2, y: -2 }}
//               whileTap={{ scale: 0.95 }}
//               aria-label="LinkedIn"
//             >
//               <FaLinkedinIn size={28} />
//             </motion.a>
//           </div>
//         </motion.div>

//         {/* Right Form Panel */}
//         <motion.div
//           className="md:w-1/2 p-10 lg:p-14 bg-white"
//           variants={itemVariants}
//         >
//           <h2 className="text-4xl font-bold mb-8 text-gray-900 leading-tight">
//             Send Us a Message
//           </h2>
//           {status && (
//             <motion.p
//               className={`mb-6 text-lg font-semibold px-4 py-2 rounded-lg ${
//                 status.startsWith("✅")
//                   ? "bg-green-100 text-green-700"
//                   : "bg-red-100 text-red-700"
//               }`}
//               initial={{ opacity: 0, y: -10 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -10 }}
//               transition={{ duration: 0.3 }}
//             >
//               {status}
//             </motion.p>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-6">
//             {["name", "email", "phone"].map((field, idx) => (
//               <motion.div key={field} variants={itemVariants}>
//                 <label htmlFor={field} className="sr-only">
//                   {field.charAt(0).toUpperCase() + field.slice(1)}
//                 </label>
//                 <input
//                   type={
//                     field === "email" ? "email" : field === "phone" ? "tel" : "text"
//                   }
//                   name={field}
//                   id={field}
//                   placeholder={`Your ${field.charAt(0).toUpperCase() + field.slice(1)}`}
//                   required
//                   value={formData[field]}
//                   onChange={handleChange}
//                   pattern={field === "phone" ? "[6-9]{1}[0-9]{9}" : undefined}
//                   maxLength={field === "phone" ? "10" : undefined}
//                   title={
//                     field === "phone"
//                       ? "Please enter a valid 10-digit Indian phone number"
//                       : undefined
//                   }
//                   // MODIFIED CLASSES FOR BOX STYLE
//                   className="w-full border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-500 transition-all duration-300 text-lg"
//                 />
//               </motion.div>
//             ))}

//             {/* Inquiry Type dropdown */}
//             <motion.div variants={itemVariants}>
//               <label htmlFor="inquiryType" className="sr-only">
//                 Inquiry Type
//               </label>
//               <select
//                 name="inquiryType"
//                 id="inquiryType"
//                 value={formData.inquiryType}
//                 onChange={handleChange}
//                 required
//                 // MODIFIED CLASSES FOR BOX STYLE
//                 className="w-full border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 transition-all duration-300 text-lg appearance-none"
//               >
//                 <option value="" disabled>
//                   Select Inquiry Type
//                 </option>
//                 <option value="Booking">Booking</option>
//                 <option value="Support">Support</option>
//                 <option value="Feedback">Feedback</option>
//                 <option value="Other">Other</option>
//               </select>
//             </motion.div>

//             <motion.div variants={itemVariants}>
//               <label htmlFor="message" className="sr-only">
//                 Your Message
//               </label>
//               <textarea
//                 name="message"
//                 id="message"
//                 placeholder="Your Message"
//                 required
//                 value={formData.message}
//                 onChange={handleChange}
//                 // MODIFIED CLASSES FOR BOX STYLE
//                 className="w-full border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-500 transition-all duration-300 text-lg min-h-[120px] resize-y"
//                 rows={4}
//               />
//             </motion.div>

//             {/* reCAPTCHA */}
//             <motion.div className="mt-4" variants={itemVariants}>
//               <ReCAPTCHA sitekey={siteKey} onChange={(token) => setCaptchaToken(token)} />
//             </motion.div>

//             <motion.button
//               type="submit"
//               className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 transition-all duration-300 font-bold text-xl shadow-lg transform hover:scale-105 active:scale-98 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
//               whileHover={{ scale: 1.02, boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)" }}
//               whileTap={{ scale: 0.98 }}
//             >
//               Send Message
//             </motion.button>
//           </form>
//         </motion.div>
//       </motion.div>
//     </div>
//   );
// }

// export default Contact;
