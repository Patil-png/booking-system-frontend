import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NavbarMenu } from '../../mockData/data'; // Assuming this path is correct
import { MdClose } from 'react-icons/md';
import { IoIosArrowDown } from "react-icons/io"; // Import arrow icon for dropdown
import { motion, AnimatePresence } from 'framer-motion';

const ResponseMenu = ({ open, setOpen }) => {
  const [activeMenuId, setActiveMenuId] = useState(null);
  const location = useLocation();

  // Close menu and reset active submenu when location changes
  useEffect(() => {
    setOpen(false);
    setActiveMenuId(null);
  }, [location.pathname, setOpen]); // Added setOpen to dependency array

  // Prevent body scrolling when menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    // Cleanup function to ensure scroll is re-enabled on unmount
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Toggle submenu open/close
  const toggleServicesMenu = (id) => {
    setActiveMenuId((prev) => (prev === id ? null : id));
  };

  // Framer Motion Variants

  // Main menu slide-in/out animation
  const menuVariants = {
    hidden: { x: '100%' },
    visible: {
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 280, // Slightly less stiff for smoother feel
        damping: 25, // More damping
      },
    },
    exit: {
      x: '100%',
      transition: { duration: 0.3, ease: 'easeOut' } // Smoother exit
    }
  };

  // Backdrop fade-in/out animation
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 0.6, transition: { duration: 0.3 } }, // Slightly darker backdrop
    exit: { opacity: 0, transition: { duration: 0.2 } }
  };

  // Submenu expand/collapse animation
  const submenuVariants = {
    collapsed: { height: 0, opacity: 0, transition: { duration: 0.3, ease: 'easeOut' } },
    expanded: {
      height: 'auto',
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: 'easeOut',
        when: 'beforeChildren', // Ensure parent expands before children animate
        staggerChildren: 0.08, // Stagger sub-menu items
      }
    }
  };

  // Submenu individual item fade-in
  const subMenuItemVariants = {
    collapsed: { opacity: 0, y: -10 },
    expanded: { opacity: 1, y: 0, transition: { duration: 0.2 } }
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              className="fixed inset-0 bg-black z-[99]"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={backdropVariants}
              onClick={() => setOpen(false)} // Close menu when backdrop is clicked
            />

            {/* Slide Menu Content */}
            <motion.div
              className="fixed top-0 right-0 h-full w-72 xs:w-64 sm:w-80 bg-white shadow-2xl z-[100] flex flex-col" // Added flex-col for better layout control
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={menuVariants}
            >
              {/* Close Button */}
              <div className="flex justify-end p-4 border-b border-gray-100">
                <button
                  onClick={() => setOpen(false)}
                  className="p-1 text-gray-600 rounded-full hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-focus"
                  aria-label="Close menu"
                >
                  <MdClose className="text-3xl text-gray-700" /> {/* Larger icon */}
                </button>
              </div>

              {/* Menu Items */}
              <nav className="flex-grow overflow-y-auto py-6 px-6"> {/* Added flex-grow and overflow-y-auto */}
                <ul className="flex flex-col space-y-2 sm:space-y-3">
                  {NavbarMenu.map((item) => (
                    <li key={item.id} className="pb-1"> {/* Added bottom padding to list item */}
                      {item.SevaMenu ? (
                        <>
                          <button
                            onClick={() => toggleServicesMenu(item.id)}
                            className="w-full flex justify-between items-center py-2 text-left font-semibold text-lg text-gray-800 hover:text-green-600 transition-colors duration-200 focus:outline-none"
                            aria-expanded={activeMenuId === item.id}
                            aria-controls={`submenu-${item.id}`}
                          >
                            {item.title}
                            <motion.div
                              animate={{ rotate: activeMenuId === item.id ? 180 : 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <IoIosArrowDown className="text-xl text-gray-500" />
                            </motion.div>
                          </button>

                          <AnimatePresence initial={false}>
                            {activeMenuId === item.id && (
                              <motion.ul
                                id={`submenu-${item.id}`}
                                key="submenu"
                                initial="collapsed"
                                animate="expanded"
                                exit="collapsed"
                                variants={submenuVariants}
                                className="ml-4 mt-2 space-y-1 sm:space-y-2 overflow-hidden border-l-2 border-green-200 pl-3"
                              >
                                {item.SevaMenu.map((subItem) => (
                                  <motion.li key={subItem.id} variants={subMenuItemVariants}>
                                    <Link
                                      to={subItem.link}
                                      className="block py-1 text-base text-gray-700 hover:text-green-600 hover:ml-1 transition-all duration-200 ease-in-out"
                                    >
                                      {subItem.title}
                                    </Link>
                                  </motion.li>
                                ))}
                              </motion.ul>
                            )}
                          </AnimatePresence>
                        </>
                      ) : (
                        <Link
                          to={item.link}
                          className="block py-2 font-semibold text-lg text-gray-800 hover:text-green-600 transition-colors duration-200 focus:outline-none"
                        >
                          {item.title}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Optional: Add a footer or branding here */}
              <div className="p-6 text-center text-sm text-gray-500 border-t border-gray-100">
                &copy; {new Date().getFullYear()} Gouri Inn. All rights reserved.
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ResponseMenu;  

// import React, { useState, useEffect } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { NavbarMenu } from '../../mockData/data';
// import { MdClose } from 'react-icons/md';

// const ResponseMenu = ({ open, setOpen }) => {
//   const [activeMenuId, setActiveMenuId] = useState(null);
//   const location = useLocation();

//   useEffect(() => {
//     setOpen(false);
//     setActiveMenuId(null);
//   }, [location.pathname]);

//   const toggleServicesMenu = (id) => {
//     setActiveMenuId((prev) => (prev === id ? null : id));
//   };

//   return (
//     <>
//       <div
//         onClick={() => setOpen(false)}
//         className={`fixed inset-0 bg-black bg-opacity-40 z-30 transition-opacity duration-300 ${
//           open ? 'opacity-100 visible' : 'opacity-0 invisible'
//         }`}
//       ></div>

//       <div
//         className={`fixed top-0 right-0 h-full w-72 bg-white shadow-lg z-40 transform transition-transform duration-300 ease-in-out ${
//           open ? 'translate-x-0' : 'translate-x-full'
//         }`}
//       >
//         <div className="flex justify-end p-4">
//           <button onClick={() => setOpen(false)}>
//             <MdClose className="text-2xl text-gray-600 hover:text-primary" />
//           </button>
//         </div>

//         <ul className="flex flex-col px-6 space-y-4">
//           {NavbarMenu.map((item) => (
//             <li key={item.id}>
//               {item.SevaMenu ? (
//                 <>
//                   <button
//                     onClick={() => toggleServicesMenu(item.id)}
//                     className="w-full text-left font-semibold text-gray-800 hover:text-primary"
//                   >
//                     {item.title}
//                   </button>
//                   <div
//                     className={`overflow-hidden transition-all duration-300 ease-in-out ${
//                       activeMenuId === item.id ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
//                     }`}
//                   >
//                     <ul className="ml-3 mt-2 space-y-2">
//                       {item.SevaMenu.map((subItem) => (
//                         <li key={subItem.id}>
//                           <Link
//                             to={subItem.link}
//                             className="block text-sm text-gray-700 hover:text-primary"
//                           >
//                             {subItem.title}
//                           </Link>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 </>
//               ) : (
//                 <Link
//                   to={item.link}
//                   className="block font-semibold text-gray-800 hover:text-primary"
//                 >
//                   {item.title}
//                 </Link>
//               )}
//             </li>
//           ))}
//         </ul>
//       </div>
//     </>
//   );
// };

// export default ResponseMenu;

// //backend friendly 
// import React, { useState, useEffect } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { NavbarMenu } from '../../mockData/data'; // Still using local data for mobile menu structure
// import { MdClose } from 'react-icons/md';

// const ResponseMenu = ({ open, setOpen }) => {
//   const [activeMenuId, setActiveMenuId] = useState(null);
//   const location = useLocation();

//   useEffect(() => {
//     // Close mobile menu and reset active submenu when route changes
//     setOpen(false);
//     setActiveMenuId(null);
//   }, [location.pathname, setOpen]); // Added setOpen to dependency array

//   const toggleServicesMenu = (id) => {
//     setActiveMenuId((prev) => (prev === id ? null : id));
//   };

//   return (
//     <>
//       <div
//         onClick={() => setOpen(false)}
//         className={`fixed inset-0 bg-black bg-opacity-40 z-30 transition-opacity duration-300 ${
//           open ? 'opacity-100 visible' : 'opacity-0 invisible'
//         }`}
//       ></div>

//       <div
//         className={`fixed top-0 right-0 h-full w-72 bg-white shadow-lg z-40 transform transition-transform duration-300 ease-in-out ${
//           open ? 'translate-x-0' : 'translate-x-full'
//         }`}
//       >
//         <div className="flex justify-end p-4">
//           <button onClick={() => setOpen(false)}>
//             <MdClose className="text-2xl text-gray-800" />
//           </button>
//         </div>

//         <ul className="p-4 space-y-4">
//           {NavbarMenu.map((item) => ( // Using NavbarMenu from local data for now
//             <li key={item.id} className="border-b border-gray-200 pb-2">
//               {item.SevaMenu ? (
//                 <>
//                   <button
//                     onClick={() => toggleServicesMenu(item.id)}
//                     className="w-full text-left font-semibold text-gray-800 hover:text-primary"
//                   >
//                     {item.title}
//                   </button>
//                   <div
//                     className={`overflow-hidden transition-all duration-300 ease-in-out ${
//                       activeMenuId === item.id ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
//                     }`}
//                   >
//                     <ul className="ml-3 mt-2 space-y-2">
//                       {item.SevaMenu.map((subItem) => (
//                         <li key={subItem.id}>
//                           <Link
//                             to={subItem.link}
//                             className="block text-sm text-gray-700 hover:text-primary"
//                             onClick={() => setOpen(false)} // Close menu on sub-item click
//                           >
//                             {subItem.title}
//                           </Link>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 </>
//               ) : (
//                 <Link
//                   to={item.link}
//                   className="block font-semibold text-gray-800 hover:text-primary"
//                   onClick={() => setOpen(false)} // Close menu on regular item click
//                 >
//                   {item.title}
//                 </Link>
//               )}
//             </li>
//           ))}
//         </ul>
//       </div>
//     </>
//   );
// };

// export default ResponseMenu;