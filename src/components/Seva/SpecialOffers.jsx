import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const offers = [
  {
    id: 1,
    title: "Weekend Stay Offer",
    description: "Book a room for the weekend and get 20% off + complimentary breakfast.",
    image: "/RoomImages/weekend.jpg",
  },
  {
    id: 2,
    title: "Wedding Package",
    description: "Host your wedding at Gouri Inn and get a luxury suite + banquet discount.",
    image: "/RoomImages/weddingoffer.jpg",
  },
  {
    id: 3,
    title: "Food Combo Deal",
    description: "Enjoy a family meal combo at our restaurant starting just ₹499.",
    image: "/RoomImages/foodcombo.jpg",
  },
];

const SpecialOffers = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white pt-16 pb-24 px-4 md:px-12">
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold text-primary mb-4">Special Offers</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover our exclusive deals tailored to make your stay more rewarding.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8">
        {offers.map((offer, index) => (
          <motion.div
            key={offer.id}
            className="bg-gray-50 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2, duration: 0.5 }}
          >
            <img
              src={offer.image}
              alt={offer.title}
              className="w-full h-56 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold text-primary">{offer.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{offer.description}</p>
              <button
                onClick={() => navigate("/book")}
                className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition duration-300"
              >
                Book Now
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="text-center mt-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-primary mb-4">Don't Miss Out!</h2>
        <p className="text-gray-600 max-w-xl mx-auto">
          Offers valid for a limited time only. Reserve today and enjoy premium hospitality at unbeatable prices.
        </p>
      </motion.div>
    </div>
  );
};

export default SpecialOffers;



// import React from "react";
// import { motion } from "framer-motion";

// const offers = [
//   {
//     id: 1,
//     title: "Weekend Stay Offer",
//     description: "Book a room for the weekend and get 20% off + complimentary breakfast.",
//     image: "/RoomImages/weekend.jpg",
//     price: "₹1,999 / night",
//   },
//   {
//     id: 2,
//     title: "Wedding Package",
//     description: "Host your wedding at Gouri Inn and get a luxury suite + banquet discount.",
//     image: "/RoomImages/weddingoffer.jpg",
//     price: "Flat ₹10,000 off",
//   },
//   {
//     id: 3,
//     title: "Food Combo Deal",
//     description: "Enjoy a family meal combo at our restaurant starting just ₹499.",
//     image: "/RoomImages/foodcombo.jpg",
//     price: "From ₹499",
//   },
// ];

// const SpecialOffers = () => {
//   return (
//     <div className="bg-white pt-16 pb-24 px-4 md:px-12">
//       <motion.div
//         className="text-center mb-12"
//         initial={{ opacity: 0, y: 20 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         viewport={{ once: true }}
//         transition={{ duration: 0.6 }}
//       >
//         <h1 className="text-4xl font-bold text-primary mb-4">Special Offers</h1>
//         <p className="text-gray-600 max-w-2xl mx-auto">
//           Discover our exclusive deals tailored to make your stay more rewarding.
//         </p>
//       </motion.div>

//       <div className="grid md:grid-cols-3 gap-8">
//         {offers.map((offer, index) => (
//           <motion.div
//             key={offer.id}
//             className="bg-gray-50 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300"
//             initial={{ opacity: 0, y: 30 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ delay: index * 0.2, duration: 0.5 }}
//           >
//             <img
//               src={offer.image}
//               alt={offer.title}
//               className="w-full h-56 object-cover"
//             />
//             <div className="p-6">
//               <h3 className="text-xl font-semibold text-primary">{offer.title}</h3>
//               <p className="text-gray-500 text-sm my-2">{offer.price}</p>
//               <p className="text-gray-600 text-sm mb-4">{offer.description}</p>
//               <button className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition duration-300">
//                 Book Now
//               </button>
//             </div>
//           </motion.div>
//         ))}
//       </div>

//       <motion.div
//         className="text-center mt-16"
//         initial={{ opacity: 0 }}
//         whileInView={{ opacity: 1 }}
//         viewport={{ once: true }}
//         transition={{ duration: 0.5 }}
//       >
//         <h2 className="text-2xl font-bold text-primary mb-4">Don't Miss Out!</h2>
//         <p className="text-gray-600 max-w-xl mx-auto">
//           Offers valid for a limited time only. Reserve today and enjoy premium hospitality at unbeatable prices.
//         </p>
//       </motion.div>
//     </div>
//   );
// };

// export default SpecialOffers;


// // backend friendly
// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";

// const SpecialOffers = () => {
//   const [offers, setOffers] = useState([]);

//   useEffect(() => {
//     const fetchOffers = async () => {
//       try {
//         const response = await fetch('http://localhost:5000/api/special-offers');
//         if (!response.ok) {
//           throw new Error('Failed to fetch special offers');
//         }
//         const data = await response.json();
//         setOffers(data);
//       } catch (error) {
//         console.error("Error fetching special offers:", error);
//       }
//     };
//     fetchOffers();
//   }, []);

//   return (
//     <div className="bg-white pt-16 pb-24 px-4 md:px-12">
//       <motion.div
//         className="text-center mb-12"
//         initial={{ opacity: 0, y: 20 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         viewport={{ once: true }}
//         transition={{ duration: 0.6 }}
//       >
//         <h1 className="text-4xl font-bold text-primary mb-4">Exclusive Special Offers</h1>
//         <p className="text-gray-600 max-w-2xl mx-auto">
//           Discover our irresistible deals and packages designed to make your stay even more memorable and affordable.
//         </p>
//       </motion.div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//         {offers.map((offer, index) => (
//           <motion.div
//             key={offer.id}
//             className="bg-gray-50 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300"
//             initial={{ opacity: 0, y: 30 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ delay: index * 0.2, duration: 0.5 }}
//           >
//             <img
//               src={offer.image}
//               alt={offer.title}
//               className="w-full h-56 object-cover"
//             />
//             <div className="p-6">
//               <h3 className="text-xl font-semibold text-primary">{offer.title}</h3>
//               <p className="text-gray-500 text-sm my-2">{offer.price}</p>
//               <p className="text-gray-600 text-sm mb-4">{offer.description}</p>
//               <button className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition duration-300">
//                 Book Now
//               </button>
//             </div>
//           </motion.div>
//         ))}
//       </div>

//       <motion.div
//         className="text-center mt-16"
//         initial={{ opacity: 0 }}
//         whileInView={{ opacity: 1 }}
//         viewport={{ once: true }}
//         transition={{ duration: 0.5 }}
//       >
//         <h2 className="text-2xl font-bold text-primary mb-4">Don't Miss Out!</h2>
//         <p className="text-gray-600 max-w-xl mx-auto mb-6">
//           Our special offers are updated regularly. Keep an eye out for more exciting deals!
//         </p>
//         <a
//           href="/Contact"
//           className="bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-primary-dark transition-all duration-300"
//         >
//           Contact Us
//         </a>
//       </motion.div>
//     </div>
//   );
// };

// export default SpecialOffers;