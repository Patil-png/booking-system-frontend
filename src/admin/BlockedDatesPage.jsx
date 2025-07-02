// 📁 src/pages/admin/BlockedDatesPage.jsx
import AdminBlockedDates from "./AdminBlockedDates";

export default function BlockedDatesPage() {
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
