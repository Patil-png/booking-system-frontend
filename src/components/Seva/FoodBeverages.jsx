import React from "react";
import { motion } from "framer-motion";

const foodItems = [
  {
    id: 1,
    name: "Royal Thali",
    description: "An assortment of handpicked traditional delicacies served in a royal presentation.",
    image: "/RoomImages/thali.jpg",
  },
  {
    id: 2,
    name: "Signature Mocktails",
    description: "Exotic flavors blended with finesse. A favorite among our guests.",
    image: "/RoomImages/mocktail.jpg",
  },
  {
    id: 3,
    name: "South Indian Breakfast",
    description: "Hot idlis, crispy dosas, and authentic sambar served fresh every morning.",
    image: "/RoomImages/southindian.jpg",
  },
];

const FoodBeverages = () => {
  return (
    <div className="bg-white pt-16 pb-24 px-4 md:px-12">
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold text-primary mb-4">Food & Beverages</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Indulge in a delightful culinary journey with carefully crafted dishes from our seasoned chefs.
        </p>
      </motion.div>

      <div className="grid gap-8 md:grid-cols-3">
        {foodItems.map((item, index) => (
          <motion.div
            key={item.id}
            className="bg-gray-50 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition duration-300"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2, duration: 0.5 }}
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-56 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold text-primary mb-2">{item.name}</h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="mt-16 text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl font-bold text-primary mb-4">Catering Services</h2>
        <p className="text-gray-600 max-w-xl mx-auto mb-6">
          Whether it's an intimate family gathering or a grand celebration, our catering team ensures every dish is a masterpiece.
        </p>
        <button className="bg-primary text-white px-6 py-2 rounded-lg shadow hover:bg-primary/90 transition duration-300">
          Explore Menu
        </button>
      </motion.div>
    </div>
  );
};

export default FoodBeverages;



// //backend friendly
// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";

// const FoodBeverages = () => {
//   const [foodItems, setFoodItems] = useState([]);

//   useEffect(() => {
//     const fetchFoodItems = async () => {
//       try {
//         const response = await fetch('http://localhost:5000/api/food-items');
//         if (!response.ok) {
//           throw new Error('Failed to fetch food items');
//         }
//         const data = await response.json();
//         setFoodItems(data);
//       } catch (error) {
//         console.error("Error fetching food items:", error);
//       }
//     };
//     fetchFoodItems();
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
//         <h1 className="text-4xl font-bold text-primary mb-4">Food & Beverages</h1>
//         <p className="text-gray-600 max-w-2xl mx-auto">
//           Delight your senses with our exquisite culinary offerings, prepared with passion and served with perfection.
//         </p>
//       </motion.div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//         {foodItems.map((item, index) => (
//           <motion.div
//             key={item.id}
//             className="bg-gray-50 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition duration-300"
//             initial={{ opacity: 0, y: 30 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ delay: index * 0.2, duration: 0.5 }}
//           >
//             <img
//               src={item.image}
//               alt={item.name}
//               className="w-full h-56 object-cover"
//             />
//             <div className="p-6">
//               <h3 className="text-xl font-semibold text-primary mb-2">{item.name}</h3>
//               <p className="text-gray-600">{item.description}</p>
//             </div>
//           </motion.div>
//         ))}
//       </div>

//       <motion.div
//         className="mt-16 text-center"
//         initial={{ opacity: 0, scale: 0.9 }}
//         whileInView={{ opacity: 1, scale: 1 }}
//         viewport={{ once: true }}
//         transition={{ duration: 0.6 }}
//       >
//         <h2 className="text-2xl font-bold text-primary mb-4">Catering Services</h2>
//         <p className="text-gray-600 max-w-xl mx-auto mb-6">
//           Whether it's an intimate family gathering or a grand celebration, our catering team ensures every dish is a masterpiece.
//         </p>
//         <a
//           href="/Contact"
//           className="bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-primary-dark transition-all duration-300"
//         >
//           Inquire Now
//         </a>
//       </motion.div>
//     </div>
//   );
// };

// export default FoodBeverages;