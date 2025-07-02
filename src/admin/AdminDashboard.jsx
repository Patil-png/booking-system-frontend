//AdminDashboard.jsx

import { Routes, Route, Link } from "react-router-dom";
import DashboardHome from "./DashboardHome";
import AdminBlockedDates from "./AdminBlockedDates";
import ContactList from "./ContactList";
import AdminCustomBooking from "./AdminCustomBooking";
import AdminCustomLawnBooking from "./AdminCustomLawnBooking";


export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-gradient-to-r from-teal-400 to-green-500 p-4 shadow-md sticky top-0 z-50 flex justify-center gap-6">
        <Link
          to="/admin"
          className="text-white font-semibold hover:underline transition-transform hover:scale-105"
        >
          Dashboard
        </Link>
        <Link 
        to="/admin/blocked-dates"
        className="text-white font-semibold hover:underline transition-transform hover:scale-105"
        >
        Blocked Dates
        </Link>

        <Link
          to="/admin/contacts"
          className="text-white font-semibold hover:underline transition-transform hover:scale-105"
        >
          Contacts
        </Link>
        <Link
          to="/admin/gallery"
          className="text-white font-semibold hover:underline transition-transform hover:scale-105"
        >
          Gallery
        </Link>
        <Link
  to="/admin/custom-booking"
  className="text-white font-semibold hover:underline transition-transform hover:scale-105"
>
  Manual Booking
</Link>
<Link
  to="/admin/lawn-booking"
  className="text-white font-semibold hover:underline transition-transform hover:scale-105"
>
  Lawn Booking
</Link>


      </nav>

      <main className="p-6 animate-fade-in-down">
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="blocked-dates" element={<BlockedDatesPage />} />
          <Route path="contacts" element={<ContactList />} />
          <Route path="custom-booking" element={<AdminCustomBooking />} />
          <Route path="lawn-booking" element={<AdminCustomLawnBooking />} />
        </Routes>
      </main>
    </div>
  );
}

// Optional inner component
function BlockedDatesPage() {
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-center text-green-700 mb-6">
        Blocked Dates Management
      </h2>
      <div className="grid gap-10 md:grid-cols-2">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold text-gray-700 mb-4 text-center">
            Room Bookings
          </h3>
          <AdminBlockedDates type="Room" />
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold text-gray-700 mb-4 text-center">
            Lawn Bookings
          </h3>
          <AdminBlockedDates type="Lawn" />
        </div>
      </div>
    </div>
  );
}
