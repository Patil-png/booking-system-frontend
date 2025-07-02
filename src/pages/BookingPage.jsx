// src/pages/BookingPage.jsx

import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import RoomBooking from '../components/BookingForm/RoomBooking';
import LawnBooking from '../components/BookingForm/LawnBooking';
import BookingNavbar from '../components/Navbar/BookingNavbar';

const BookingPage = () => {
  const [params] = useSearchParams();
  const defaultTab = params.get('type') || 'room';
  const [selectedTab, setSelectedTab] = useState(defaultTab);

  return (
    <>
      <BookingNavbar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      <div className="container mx-auto p-4">
        {selectedTab === 'lawn' ? <LawnBooking /> : <RoomBooking />}
      </div>
    </>
  );
};

export default BookingPage;

// import React, { useState } from 'react';
// import Navbar from '../components/Navbar';
// import RoomBooking from '../components/BookingForm/RoomBooking';
// import LawnBooking from '../components/BookingForm/LawnBooking';

// const BookingPage = () => {
//   const [selectedTab, setSelectedTab] = useState('room');

//   return (
//     <div>
//       <Navbar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
//       {selectedTab === 'room' ? <RoomBooking /> : <LawnBooking />}
//     </div>
//   );
// };

// export default BookingPage;
