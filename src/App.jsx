// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/Navbar/Navbar.jsx';
import Footer from './components/Footer/Footer';
import Home from './components/Home/Home';
import Gallery from './components/Gallery/Gallery';
import Seva from './components/Seva/Seva';
import Rooms from './components/Rooms/Rooms';
import Contact from './components/Contactus/Contact';
import NotFound from './components/NotFound/NotFound';
import BookingPage from './pages/BookingPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import Contacts from './admin/Contacts.jsx';
import GalleryAdmin from './admin/GalleryAdmin';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";


const isAdminAuthenticated = () => {
  return !!localStorage.getItem('adminToken');
};

export default function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Navbar />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/Seva/:subseva" element={<Seva />} />
        <Route path="/Rooms" element={<Rooms />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/book" element={<BookingPage />} />
        <Route path="/login" element={<AdminLogin />} />
        <Route path="*" element={<NotFound />} />

        {/* Admin Protected Routes */}
        {isAdminAuthenticated() ? (
          <>
            <Route path="/admin/*" element={<AdminDashboard />} />
            <Route path="/admin/contacts" element={<Contacts />} />
            <Route path="/admin/gallery" element={<GalleryAdmin />} />
          </>
        ) : (
          <>
            <Route path="/admin/*" element={<Navigate to="/login" replace />} />
            <Route path="/admin/contacts" element={<Navigate to="/login" replace />} />
            <Route path="/admin/gallery" element={<Navigate to="/login" replace />} />
          </>
        )}
      </Routes>

      <Footer />
    </>
  );
}

// import { Routes, Route, Navigate } from 'react-router-dom';
// import BookingPage from './pages/BookingPage';
// import AdminLogin from './pages/AdminLogin';
// import AdminDashboard from './admin/AdminDashboard';

// const isAdminAuthenticated = () => {
//   return !!localStorage.getItem('adminToken');
// };

// export default function App() {
//   return (
//     <Routes>
//       <Route path="/" element={<BookingPage />} />
//       <Route path="/login" element={<AdminLogin />} />
//       <Route
//         path="/admin/*"
//         element={
//           isAdminAuthenticated() ? (
//             <AdminDashboard />
//           ) : (
//             <Navigate to="/login" replace />
//           )
//         }
//       />
//     </Routes>
//   );
// }