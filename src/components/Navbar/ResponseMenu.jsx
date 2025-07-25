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
    hidden: { x: '100%', opacity: 0, scale: 0.98 },
    visible: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 120,
        damping: 18,
        mass: 0.7,
        when: 'beforeChildren',
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
    exit: {
      x: '100%',
      opacity: 0,
      scale: 0.98,
      transition: { duration: 0.32, ease: 'easeInOut' }
    }
  };

  // Backdrop fade-in/out animation with blur
  const backdropVariants = {
    hidden: { opacity: 0, backdropFilter: 'blur(0px)' },
    visible: { opacity: 0.7, backdropFilter: 'blur(4px)', transition: { duration: 0.35 } },
    exit: { opacity: 0, backdropFilter: 'blur(0px)', transition: { duration: 0.2 } }
  };

  // Submenu expand/collapse animation
  const submenuVariants = {
    collapsed: { height: 0, opacity: 0, transition: { duration: 0.28, ease: 'easeOut' } },
    expanded: {
      height: 'auto',
      opacity: 1,
      transition: {
        duration: 0.38,
        ease: 'easeOut',
        when: 'beforeChildren',
        staggerChildren: 0.09,
      }
    }
  };

  // Submenu individual item fade-in/slide
  const subMenuItemVariants = {
    collapsed: { opacity: 0, y: -12 },
    expanded: { opacity: 1, y: 0, transition: { duration: 0.22 } }
  };

  // Menu item animation (staggered)
  const menuItemVariants = {
    hidden: { opacity: 0, x: 40 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: 0.09 * i, duration: 0.42, type: 'spring', stiffness: 170, damping: 16 }
    })
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              className="fixed inset-0 bg-black z-[99] backdrop-blur-sm"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={backdropVariants}
              onClick={() => setOpen(false)} // Close menu when backdrop is clicked
            />

            {/* Slide Menu Content */}
            <motion.div
              className="fixed top-0 right-0 h-full w-72 xs:w-64 sm:w-80 bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900/90 bg-opacity-90 shadow-2xl z-[100] flex flex-col border-l-2 border-purple-400/40 backdrop-blur-xl"
              style={{ boxShadow: '0 8px 40px 0 #a78bfa55, 0 1.5px 8px 0 #0008' }}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={menuVariants}
            >
              {/* Close Button */}
              <div className="flex justify-end p-4 border-b border-purple-400/20">
                <motion.button
                  onClick={() => setOpen(false)}
                  className="p-1 rounded-full bg-gradient-to-br from-purple-700 to-gray-900 shadow-lg hover:scale-110 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  aria-label="Close menu"
                  initial={{ scale: 0.7, rotate: -30, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  exit={{ scale: 0.7, rotate: 30, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                  whileTap={{ scale: 0.85, rotate: 20 }}
                  whileHover={{ scale: 1.15, boxShadow: "0 0 16px 2px #a78bfa" }}
                >
                  <MdClose className="text-2xl text-white drop-shadow" />
                </motion.button>
              </div>

              {/* Menu Items */}
              <nav className="flex-grow overflow-y-auto py-6 px-6">
                <ul className="flex flex-col space-y-2 sm:space-y-3">
                  {NavbarMenu.map((item, i) => (
                    <motion.li
                      key={item.id}
                      className="pb-1"
                      variants={menuItemVariants}
                      initial="hidden"
                      animate="visible"
                      custom={i}
                      whileHover={{ scale: 1.08, x: 8, color: '#a78bfa' }}
                      transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                    >
                      {item.SevaMenu ? (
                        <>
                          <button
                            onClick={() => toggleServicesMenu(item.id)}
                            className={`w-full flex justify-between items-center py-2 text-left font-semibold text-lg ${activeMenuId === item.id ? 'text-purple-400' : 'text-gray-100'} hover:text-purple-300 transition-colors duration-200 focus:outline-none`}
                            aria-expanded={activeMenuId === item.id}
                            aria-controls={`submenu-${item.id}`}
                          >
                            {item.title}
                            <motion.div
                              animate={{ rotate: activeMenuId === item.id ? 180 : 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <IoIosArrowDown className="text-xl text-purple-300" />
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
                                className="ml-4 mt-2 space-y-1 sm:space-y-2 overflow-hidden border-l-2 border-purple-400/40 pl-3"
                              >
                                {item.SevaMenu.map((subItem, j) => (
                                  <motion.li key={subItem.id} variants={subMenuItemVariants} whileHover={{ scale: 1.08, x: 6, color: '#a78bfa' }}>
                                    <Link
                                      to={subItem.link}
                                      className="block py-1 text-base text-gray-200 hover:text-purple-300 hover:ml-1 transition-all duration-200 ease-in-out"
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
                          className="block py-2 font-semibold text-lg text-gray-100 hover:text-purple-300 transition-colors duration-200 focus:outline-none"
                        >
                          {item.title}
                        </Link>
                      )}
                    </motion.li>
                  ))}
                </ul>
              </nav>

              {/* Optional: Add a footer or branding here */}
              <div className="p-6 text-center text-xs text-purple-200 border-t border-purple-400/20 tracking-wide">
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
// import { NavbarMenu } from '../../mockData/data'; // Assuming this path is correct
// import { MdClose } from 'react-icons/md';
// import { IoIosArrowDown } from "react-icons/io"; // Import arrow icon for dropdown
// import { motion, AnimatePresence } from 'framer-motion';

// const ResponseMenu = ({ open, setOpen }) => {
//   const [activeMenuId, setActiveMenuId] = useState(null);
//   const location = useLocation();

//   // Close menu and reset active submenu when location changes
//   useEffect(() => {
//     setOpen(false);
//     setActiveMenuId(null);
//   }, [location.pathname, setOpen]); // Added setOpen to dependency array

//   // Prevent body scrolling when menu is open
//   useEffect(() => {
//     document.body.style.overflow = open ? 'hidden' : '';
//     // Cleanup function to ensure scroll is re-enabled on unmount
//     return () => {
//       document.body.style.overflow = '';
//     };
//   }, [open]);

//   // Toggle submenu open/close
//   const toggleServicesMenu = (id) => {
//     setActiveMenuId((prev) => (prev === id ? null : id));
//   };

//   // Framer Motion Variants

//   // Main menu slide-in/out animation
//   const menuVariants = {
//     hidden: { x: '100%', opacity: 0 },
//     visible: {
//       x: 0,
//       opacity: 1,
//       transition: {
//         type: 'spring',
//         stiffness: 180,
//         damping: 22,
//       },
//     },
//     exit: {
//       x: '100%',
//       opacity: 0,
//       transition: { duration: 0.3, ease: 'easeOut' }
//     }
//   };

//   // Backdrop fade-in/out animation
//   const backdropVariants = {
//     hidden: { opacity: 0 },
//     visible: { opacity: 0.7, transition: { duration: 0.3 } },
//     exit: { opacity: 0, transition: { duration: 0.2 } }
//   };

//   // Submenu expand/collapse animation
//   const submenuVariants = {
//     collapsed: { height: 0, opacity: 0, transition: { duration: 0.3, ease: 'easeOut' } },
//     expanded: {
//       height: 'auto',
//       opacity: 1,
//       transition: {
//         duration: 0.4,
//         ease: 'easeOut',
//         when: 'beforeChildren', // Ensure parent expands before children animate
//         staggerChildren: 0.08, // Stagger sub-menu items
//       }
//     }
//   };

//   // Submenu individual item fade-in
//   const subMenuItemVariants = {
//     collapsed: { opacity: 0, y: -10 },
//     expanded: { opacity: 1, y: 0, transition: { duration: 0.2 } }
//   };

//   // Menu item animation
//   const menuItemVariants = {
//     hidden: { opacity: 0, x: 40 },
//     visible: (i) => ({
//       opacity: 1,
//       x: 0,
//       transition: { delay: 0.08 * i, duration: 0.4, type: 'spring', stiffness: 200 }
//     })
//   };

//   return (
//     <>
//       <AnimatePresence>
//         {open && (
//           <>
//             {/* Backdrop Overlay */}
//             <motion.div
//               className="fixed inset-0 bg-black z-[99]"
//               initial="hidden"
//               animate="visible"
//               exit="exit"
//               variants={backdropVariants}
//               onClick={() => setOpen(false)} // Close menu when backdrop is clicked
//             />

//             {/* Slide Menu Content */}
//             <motion.div
//               className="fixed top-0 right-0 h-full w-72 xs:w-64 sm:w-80 bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900/90 bg-opacity-90 shadow-2xl z-[100] flex flex-col border-l-2 border-purple-400/40 backdrop-blur-xl"
//               style={{ boxShadow: '0 8px 40px 0 #a78bfa55, 0 1.5px 8px 0 #0008' }}
//               initial="hidden"
//               animate="visible"
//               exit="exit"
//               variants={menuVariants}
//             >
//               {/* Close Button */}
//               <div className="flex justify-end p-4 border-b border-purple-400/20">
//                 <motion.button
//                   onClick={() => setOpen(false)}
//                   className="p-1 rounded-full bg-gradient-to-br from-purple-700 to-gray-900 shadow-lg hover:scale-110 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
//                   aria-label="Close menu"
//                   whileTap={{ scale: 0.85, rotate: 20 }}
//                   whileHover={{ scale: 1.15, boxShadow: "0 0 16px 2px #a78bfa" }}
//                 >
//                   <MdClose className="text-2xl text-white drop-shadow" />
//                 </motion.button>
//               </div>

//               {/* Menu Items */}
//               <nav className="flex-grow overflow-y-auto py-6 px-6">
//                 <ul className="flex flex-col space-y-2 sm:space-y-3">
//                   {NavbarMenu.map((item, i) => (
//                     <motion.li
//                       key={item.id}
//                       className="pb-1"
//                       variants={menuItemVariants}
//                       initial="hidden"
//                       animate="visible"
//                       custom={i}
//                       whileHover={{ scale: 1.08, x: 8, color: '#a78bfa' }}
//                       transition={{ type: 'spring', stiffness: 300, damping: 18 }}
//                     >
//                       {item.SevaMenu ? (
//                         <>
//                           <button
//                             onClick={() => toggleServicesMenu(item.id)}
//                             className={`w-full flex justify-between items-center py-2 text-left font-semibold text-lg ${activeMenuId === item.id ? 'text-purple-400' : 'text-gray-100'} hover:text-purple-300 transition-colors duration-200 focus:outline-none`}
//                             aria-expanded={activeMenuId === item.id}
//                             aria-controls={`submenu-${item.id}`}
//                           >
//                             {item.title}
//                             <motion.div
//                               animate={{ rotate: activeMenuId === item.id ? 180 : 0 }}
//                               transition={{ duration: 0.3 }}
//                             >
//                               <IoIosArrowDown className="text-xl text-purple-300" />
//                             </motion.div>
//                           </button>

//                           <AnimatePresence initial={false}>
//                             {activeMenuId === item.id && (
//                               <motion.ul
//                                 id={`submenu-${item.id}`}
//                                 key="submenu"
//                                 initial="collapsed"
//                                 animate="expanded"
//                                 exit="collapsed"
//                                 variants={submenuVariants}
//                                 className="ml-4 mt-2 space-y-1 sm:space-y-2 overflow-hidden border-l-2 border-purple-400/40 pl-3"
//                               >
//                                 {item.SevaMenu.map((subItem, j) => (
//                                   <motion.li key={subItem.id} variants={subMenuItemVariants} whileHover={{ scale: 1.08, x: 6, color: '#a78bfa' }}>
//                                     <Link
//                                       to={subItem.link}
//                                       className="block py-1 text-base text-gray-200 hover:text-purple-300 hover:ml-1 transition-all duration-200 ease-in-out"
//                                     >
//                                       {subItem.title}
//                                     </Link>
//                                   </motion.li>
//                                 ))}
//                               </motion.ul>
//                             )}
//                           </AnimatePresence>
//                         </>
//                       ) : (
//                         <Link
//                           to={item.link}
//                           className="block py-2 font-semibold text-lg text-gray-100 hover:text-purple-300 transition-colors duration-200 focus:outline-none"
//                         >
//                           {item.title}
//                         </Link>
//                       )}
//                     </motion.li>
//                   ))}
//                 </ul>
//               </nav>

//               {/* Optional: Add a footer or branding here */}
//               <div className="p-6 text-center text-xs text-purple-200 border-t border-purple-400/20 tracking-wide">
//                 &copy; {new Date().getFullYear()} Gouri Inn. All rights reserved.
//               </div>
//             </motion.div>
//           </>
//         )}
//       </AnimatePresence>
//     </>
//   );
// };

// export default ResponseMenu;  
