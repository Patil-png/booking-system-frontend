import React from 'react';
import { useParams } from 'react-router-dom';
import FoodBeverages from "./FoodBeverages"; 
import EventWedding from "./EventWedding";
import GuestRooms from "./GuestRooms";
import SpecialOffers from "./SpecialOffers";

const Seva = () => {
  const { subseva } = useParams();

  const rendersubseva = () => {
    switch (subseva) {
      case 'FoodBeverages':
        return <FoodBeverages />;
      case 'EventWedding':
        return <EventWedding />;
      case 'GuestRooms':
        return <GuestRooms />;
      case 'SpecialOffers':
        return <SpecialOffers />;
      default:
        return <div>Invalid Seva selected.</div>;
    }
  };

  return <>
  <div>{rendersubseva()}</div>
  </>;
};

export default Seva;


// import React, { useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import FoodBeverages from "./FoodBeverages";
// import EventWedding from "./EventWedding";
// import GuestRooms from "./GuestRooms";
// import SpecialOffers from "./SpecialOffers";

// const Seva = () => {
//   const { subseva } = useParams();
//   const navigate = useNavigate();

//   // Define a list of valid sub-seva slugs
//   const validSevas = ['FoodBeverages', 'EventWedding', 'GuestRooms', 'SpecialOffers'];

//   useEffect(() => {
//     // If subseva is not provided or is not in the list of valid sevas,
//     // redirect to a default subseva (e.g., FoodBeverages)
//     if (!subseva || !validSevas.includes(subseva)) {
//       navigate('/Seva/FoodBeverages', { replace: true }); // Use replace to avoid adding to history
//     }
//   }, [subseva, navigate, validSevas]); // Added validSevas to dependency array

//   const rendersubseva = () => {
//     switch (subseva) {
//       case 'FoodBeverages':
//         return <FoodBeverages />;
//       case 'EventWedding':
//         return <EventWedding />;
//       case 'GuestRooms':
//         return <GuestRooms />;
//       case 'SpecialOffers':
//         return <SpecialOffers />;
//       default:
//         // This default case should ideally only be hit during the initial render
//         // before the useEffect redirect takes place for invalid/missing subseva.
//         return <div>Loading Seva...</div>;
//     }
//   };

//   return <>{rendersubseva()}</>;
// };

// export default Seva;