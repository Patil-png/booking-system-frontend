import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Home from "./components/Home/Home";
import Gallery from "./components/Gallery/Gallery";
import Seva from "./components/Seva/Seva";
import Rooms from "./components/Rooms/Rooms";
import Contact from "./components/Contactus/Contact";
import BookingPage from "./pages/BookingPage";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import Contacts from "./admin/Contacts";
import GalleryAdmin from "./admin/GalleryAdmin";
import NotFound from "./components/NotFound/NotFound";
import Breadcrumbs from "./components/SEO/Breadcrumbs";

const isAdminAuthenticated = () => {
  return !!localStorage.getItem('adminToken');
};

function AppLayout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/executive-assistant');

  return (
    <>
      <Toaster position="top-right" />
      {!isAdminRoute && <Navbar />}
      {!isAdminRoute && <Breadcrumbs />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/Seva/:subseva" element={<Seva />} />
        <Route path="/Rooms" element={<Rooms />} />
        <Route path="/contact" element={<Contact />} />

        {/* Booking Routes */}
        <Route path="/book" element={<Navigate to="/room-booking" replace />} />
        <Route path="/booking" element={<Navigate to="/room-booking" replace />} />
        <Route path="/room-booking" element={<BookingPage />} />

        {/* Admin Auth */}
        <Route path="/login" element={<AdminLogin />} />

        {/* Executive Assistant Protected Routes */}
        {isAdminAuthenticated() ? (
          <>
            <Route path="/executive-assistant/*" element={<AdminDashboard />} />
            <Route path="/executive-assistant/contacts" element={<Contacts />} />
            <Route path="/executive-assistant/gallery" element={<GalleryAdmin />} />
          </>
        ) : (
          <>
            <Route path="/executive-assistant/*" element={<Navigate to="/login" replace />} />
            <Route path="/executive-assistant/contacts" element={<Navigate to="/login" replace />} />
            <Route path="/executive-assistant/gallery" element={<Navigate to="/login" replace />} />
          </>
        )}

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {!isAdminRoute && <Footer />}
    </>
  );
}

export default function App() {
  return <AppLayout />;
}