// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Navbar from './Components/Navbar/Navbar';
import Footer from './Components/Footer/Footer';
import Home from './Components/Home/Home';
import Gallery from './Components/Gallery/Gallery';
import Seva from './Components/Seva/Seva';
import Rooms from './Components/Rooms/Rooms';
import Contact from './Components/Contactus/Contact';
import NotFound from './Components/NotFound/NotFound';
import BookingPage from './pages/BookingPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import Contacts from './admin/Contacts.jsx';
import GalleryAdmin from './admin/GalleryAdmin';

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