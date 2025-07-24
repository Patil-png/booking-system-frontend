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


// import React from 'react';
// import { useParams } from 'react-router-dom';
// import FoodBeverages from "./FoodBeverages"; 
// import EventWedding from "./EventWedding";
// import GuestRooms from "./GuestRooms";
// import SpecialOffers from "./SpecialOffers";

// const Seva = () => {
//   const { subseva } = useParams();

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
//         return <div>Invalid Seva selected.</div>;
//     }
//   };

//   return <>
//   <div>{rendersubseva()}</div>
//   </>;
// };

// export default Seva;

