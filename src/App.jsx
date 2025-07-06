// src/App.jsx
import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/Navbar/Navbar';
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
import Contacts from './admin/Contacts';
import GalleryAdmin from './admin/GalleryAdmin';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    setIsAuthenticated(!!token);
  }, [location.pathname]); // re-evaluate on route change

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

        {/* Booking Routes */}
        <Route path="/book" element={<Navigate to="/room-booking" replace />} />
        <Route path="/room-booking" element={<BookingPage />} />

        {/* Admin Auth */}
        <Route path="/login" element={<AdminLogin />} />

        {/* Protected Admin Routes */}
        {isAuthenticated ? (
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

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
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