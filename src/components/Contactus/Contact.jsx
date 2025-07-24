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
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/contact`, formData);
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
            <h2 className="text-base xs:text-lg sm:text-xl font-bold text-gray-800 mb-4">Send Us a Message</h2>
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
                {[
                  { field: 'name', label: 'Name', type: 'text', placeholder: 'Enter your name' },
                  { field: 'email', label: 'Email Address', type: 'email', placeholder: 'your.email@example.com' },
                ].map(({ field, label, type, placeholder }) => (
                  <div key={field}>
                    <label className="block mb-2 text-xs xs:text-sm font-semibold text-gray-700">{label} *</label>
                    <input
                      type={type}
                      name={field}
                      required
                      value={formData[field]}
                      onChange={handleChange}
                      placeholder={placeholder}
                      className="w-full px-3 xs:px-4 py-2 xs:py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 bg-gray-50 text-gray-900 text-xs xs:text-sm sm:text-base font-medium"
                    />
                  </div>
                ))}
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 text-xs xs:text-sm font-semibold text-gray-700">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    pattern="[6-9]{1}[0-9]{9}"
                    maxLength="10"
                    placeholder="10-digit phone number"
                    className="w-full px-3 xs:px-4 py-2 xs:py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 bg-gray-50 text-gray-900 text-xs xs:text-sm sm:text-base font-medium"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-xs xs:text-sm font-semibold text-gray-700">Inquiry Type *</label>
                  <select
                    name="inquiryType"
                    required
                    value={formData.inquiryType}
                    onChange={handleChange}
                    className="w-full px-3 xs:px-4 py-2 xs:py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 bg-gray-50 text-gray-900 text-xs xs:text-sm sm:text-base font-medium"
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
                <label className="block mb-2 text-xs xs:text-sm font-semibold text-gray-700">Your Message *</label>
                <textarea
                  name="message"
                  rows="5"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your requirements or questions..."
                  className="w-full px-3 xs:px-4 py-2 xs:py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 bg-gray-50 text-gray-900 text-xs xs:text-sm sm:text-base font-medium resize-y"
                />
              </div>
              <div className="w-full flex justify-center items-center my-4 overflow-visible">
                <div className="mx-auto flex justify-center" style={{ transform: 'scale(0.8)', width: '100%', minWidth: 0 }}>
                  <ReCAPTCHA
                    sitekey={siteKey || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"}
                    onChange={(token) => setCaptchaToken(token)}
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={status === "Sending..."}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 xs:py-3 sm:py-4 px-6 rounded-xl font-semibold text-xs xs:text-sm sm:text-lg hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
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



// // src/components/Contact.jsx
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
//   FaPaperPlane,
//   FaHotel,
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

//   const isValidPhone = (phone) => /^[6-9]\d{9}$/.test(phone);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setStatus("Sending...");

//     if (!captchaToken) {
//       setStatus("❌ Please complete the reCAPTCHA verification.");
//       return;
//     }

//     if (!isValidPhone(formData.phone)) {
//       setStatus("❌ Please enter a valid 10-digit Indian phone number.");
//       return;
//     }

//     try {
//       await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/contact`, formData);
//       setStatus("✅ Message sent successfully! We'll get back to you soon.");
//       setFormData({
//         name: "",
//         email: "",
//         phone: "",
//         inquiryType: "",
//         message: "",
//       });
//       setCaptchaToken(null);
//       if (window.grecaptcha) window.grecaptcha.reset();
//     } catch (error) {
//       console.error("Error sending message:", error);
//       setStatus("❌ Something went wrong. Please try again later.");
//     }
//   };

//   const socialIcons = [
//     { Icon: FaFacebookF, href: "#", label: "Facebook" },
//     { Icon: FaInstagram, href: "#", label: "Instagram" },
//     { Icon: FaTwitter, href: "#", label: "Twitter" },
//     { Icon: FaLinkedinIn, href: "#", label: "LinkedIn" },
//   ];

//   const features = [
//     {
//       title: "24/7 Support",
//       description: "Round-the-clock assistance for all your needs",
//       icon: "🕒",
//       color: "from-blue-500 to-blue-600"
//     },
//     {
//       title: "Quick Response",
//       description: "We typically respond within 2-4 hours",
//       icon: "⚡",
//       color: "from-green-500 to-green-600"
//     },
//     {
//       title: "Expert Team",
//       description: "Professional staff ready to help you",
//       icon: "👥",
//       color: "from-purple-500 to-purple-600"
//     }
//   ];

//   return (
//     <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4 sm:px-6 md:px-8 overflow-x-hidden">
//       {/* Header */}
//       <motion.div
//         className="text-center mb-10 sm:mb-12"
//         initial={{ opacity: 0, y: -30 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.8 }}
//       >
//         <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-4 sm:mb-6">
//           <FaHotel className="text-white text-2xl" />
//         </div>
//         <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2">
//           Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Touch</span>
//         </h1>
//         <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto">
//           Ready to experience luxury at Gouri Inn? We're here to make your stay unforgettable.
//         </p>
//       </motion.div>

//       <div className="max-w-7xl mx-auto">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
//           {/* Contact Info Panel */}
//           <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-6 sm:p-8 md:p-12 text-white relative overflow-hidden">
//             <div className="absolute -top-20 -left-20 w-32 h-32 bg-blue-500 rounded-full opacity-10 blur-xl"></div>
//             <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-indigo-500 rounded-full opacity-10 blur-xl"></div>
//             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500 rounded-full opacity-5 blur-xl"></div>

//             <div className="relative z-10 space-y-6">
//               <div>
//                 <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300">
//                   Gouri Inn
//                 </h2>
//                 <p className="text-gray-300 text-sm sm:text-base">
//                   Experience luxury, comfort, and exceptional hospitality. We're here to help with any inquiries, bookings, or feedback.
//                 </p>
//               </div>

//               <div className="space-y-5 text-sm sm:text-base">
//                 {[
//                   { Icon: FaMapMarkerAlt, text: "Sharda Chowk, Amravati, Maharashtra, India - 444601", color: "text-blue-300" },
//                   { Icon: FaPhone, text: "+91 98765 43210", color: "text-green-300" },
//                   { Icon: FaEnvelope, text: "contact@gouriinn.com", color: "text-purple-300" },
//                 ].map(({ Icon, text, color }, idx) => (
//                   <div key={idx} className="flex items-start group cursor-pointer">
//                     <Icon className={`mr-3 mt-1 ${color}`} size={18} />
//                     <span className="text-gray-200 group-hover:text-white transition">{text}</span>
//                   </div>
//                 ))}
//               </div>

//               <div className="flex justify-start gap-3 mt-4">
//                 {socialIcons.map(({ Icon, href, label }, index) => (
//                   <a
//                     key={label}
//                     href={href}
//                     className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/20 transition border border-white/20"
//                     aria-label={label}
//                   >
//                     <Icon size={18} />
//                   </a>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Contact Form Panel */}
//           <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 md:p-12 border border-gray-100">
//             <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-900">Send Us a Message</h2>
//             <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-6"></div>

//             {status && (
//               <div
//                 className={`mb-6 p-4 rounded-xl border-l-4 ${
//                   status.startsWith("✅")
//                     ? "bg-green-50 border-green-400 text-green-800"
//                     : status.startsWith("Sending")
//                     ? "bg-blue-50 border-blue-400 text-blue-800"
//                     : "bg-red-50 border-red-400 text-red-800"
//                 }`}
//               >
//                 <p className="font-medium">{status}</p>
//               </div>
//             )}

//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div className="grid md:grid-cols-2 gap-6">
//                 {["name", "email"].map((field) => (
//                   <div key={field}>
//                     <label className="block mb-2 text-sm font-semibold text-gray-700">
//                       {field.charAt(0).toUpperCase() + field.slice(1)} *
//                     </label>
//                     <input
//                       type={field === "email" ? "email" : "text"}
//                       name={field}
//                       required
//                       value={formData[field]}
//                       onChange={handleChange}
//                       placeholder={`Enter your ${field}`}
//                       className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 bg-gray-50 text-gray-800"
//                     />
//                   </div>
//                 ))}
//               </div>

//               <div className="grid md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block mb-2 text-sm font-semibold text-gray-700">Phone Number *</label>
//                   <input
//                     type="tel"
//                     name="phone"
//                     required
//                     value={formData.phone}
//                     onChange={handleChange}
//                     pattern="[6-9]{1}[0-9]{9}"
//                     maxLength="10"
//                     placeholder="10-digit phone number"
//                     className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 bg-gray-50 text-gray-800"
//                   />
//                 </div>

//                 <div>
//                   <label className="block mb-2 text-sm font-semibold text-gray-700">Inquiry Type *</label>
//                   <select
//                     name="inquiryType"
//                     required
//                     value={formData.inquiryType}
//                     onChange={handleChange}
//                     className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 bg-gray-50 text-gray-800"
//                   >
//                     <option value="">Select inquiry type</option>
//                     <option value="Booking">Booking</option>
//                     <option value="Support">Support</option>
//                     <option value="Feedback">Feedback</option>
//                     <option value="Other">Other</option>
//                   </select>
//                 </div>
//               </div>

//               <div>
//                 <label className="block mb-2 text-sm font-semibold text-gray-700">Your Message *</label>
//                 <textarea
//                   name="message"
//                   rows="5"
//                   required
//                   value={formData.message}
//                   onChange={handleChange}
//                   placeholder="Tell us about your requirements or questions..."
//                   className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 bg-gray-50 text-gray-800 resize-y"
//                 />
//               </div>

//               <div className="transform scale-[0.85] sm:scale-100 origin-left">
//                 <ReCAPTCHA
//                   sitekey={siteKey || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"}
//                   onChange={(token) => setCaptchaToken(token)}
//                 />
//               </div>

//               <button
//                 type="submit"
//                 disabled={status === "Sending..."}
//                 className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 sm:py-4 px-6 rounded-xl font-semibold text-base sm:text-lg hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
//               >
//                 <FaPaperPlane />
//                 {status === "Sending..." ? "Sending..." : "Send Message"}
//               </button>
//             </form>
//           </div>
//         </div>

//         {/* Features Section */}
//         <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
//           {features.map((f, i) => (
//             <div
//               key={i}
//               className="bg-white rounded-2xl p-6 shadow-lg border text-center hover:shadow-xl transition"
//             >
//               <div className={`w-14 h-14 bg-gradient-to-r ${f.color} rounded-full mx-auto flex items-center justify-center text-2xl mb-4`}>
//                 {f.icon}
//               </div>
//               <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">{f.title}</h3>
//               <p className="text-sm sm:text-base text-gray-600">{f.description}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Contact;
