import React, { useState } from 'react';
import { NavbarMenu } from '../../mockData/data';
import { MobileNumber } from '../../mockData/data';
import { FaFacebook, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { FiPhoneCall } from "react-icons/fi";
import { BsTelephoneFill } from "react-icons/bs";
import ResponseMenu from './ResponseMenu';
import { MdMenu, MdClose } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.nav
        className="w-full font-luxury bg-white/40 backdrop-blur-xl shadow-xl border-b border-purple-200/40 sticky top-0 z-50"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, type: 'spring', stiffness: 120 }}
      >
        <div className="container bg">
          {/* Top Header */}
          <div className="container justify-between items-center flex shadow-none">
            <motion.div
              className="py-2 px-2 flex flex-row items-center gap-2 w-full xs:w-auto text-center xs:text-left justify-start md:justify-start ml-3 md:ml-0"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2, type: 'spring', stiffness: 120 }}
            >
              <img src={logo} alt="Gouri-inn Logo" className="h-8 xs:h-10 sm:h-12 w-auto ml-0" style={{ maxWidth: '60px' }} />
              <span className="text-base xs:text-lg sm:text-xl md:text-2xl font-extrabold font-luxury text-black tracking-wide md:tracking-wider leading-tight mt-0 ml-2">Gouri-inn</span>
            </motion.div>
            <motion.div
              className="hidden md:block font-semibold"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3, type: 'spring', stiffness: 120 }}
            >
              <div className="flex gap-3 items-center">
                <motion.div
                  whileHover={{ scale: 1.2, color: '#a78bfa' }}
                  className="mt-4 text-primary"
                >
                  <FiPhoneCall />
                </motion.div>
                <p>Have any questions?</p>
              </div>
              <div className="flex pl-7">
                Free + <div className="text-primary font-sans">{MobileNumber}</div>
              </div>
            </motion.div>
          </div>

          {/* Navbar Main */}
          <div className="container justify-between text-black items-center flex shadow-none">
            <div className="hidden md:block">
              <motion.ul
                className="flex gap-6 items-center"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.08 } }
                }}
              >
                {NavbarMenu.map((item, i) => (
                  <motion.li
                    key={item.id}
                    className="relative group text-font_footer inline-block pb-1 font-semibold"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * i, duration: 0.4, type: 'spring', stiffness: 200 }}
                    whileHover={{ scale: 1.08, y: -2 }}
                  >
                    {item.SevaMenu ? (
                      <>
                        <motion.span
                          className="cursor-pointer font-semibold relative group gradient-gold gradient-gold-hover"
                          transition={{ type: 'spring', stiffness: 300 }}
                        >
                          {item.title}
                          <motion.span
                            className="absolute left-0 -bottom-1 h-[3px] w-0 group-hover:w-full bg-gradient-to-r from-pink-400 via-purple-400 to-yellow-300 rounded-full"
                            initial={{ width: 0 }}
                            whileHover={{ width: '100%' }}
                            transition={{ duration: 0.35, ease: 'easeInOut' }}
                          />
                        </motion.span>
                        <ul className="absolute left-0 top-full mt-1 bg-white/90 backdrop-blur-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-500 ease-in-out shadow-xl rounded-2xl w-48 z-50 border border-purple-200/40">
                          {item.SevaMenu.map((subItem) => (
                            <li key={subItem.id}>
                              <Link
                                to={`/Seva/${subItem.slug}`}
                                className="block px-4 py-2 hover:bg-purple-50 duration-300 rounded-xl gradient-gold gradient-gold-hover"
                              >
                                {subItem.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </>
                    ) : (
                      <motion.span
                        className="font-semibold relative group cursor-pointer gradient-gold gradient-gold-hover"
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        <Link to={item.link}>{item.title}</Link>
                        <motion.span
                          className="absolute left-0 -bottom-1 h-[3px] w-0 group-hover:w-full bg-gradient-to-r from-pink-400 via-purple-400 to-yellow-300 rounded-full"
                          initial={{ width: 0 }}
                          whileHover={{ width: '100%' }}
                          transition={{ duration: 0.35, ease: 'easeInOut' }}
                        />
                      </motion.span>
                    )}
                  </motion.li>
                ))}
              </motion.ul>
            </div>

            {/* Icons */}
            <div className="hidden md:block">
              <motion.ul className="flex items-center py-2 gap-1"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.08 } }
                }}
              >
                {[FaInstagram, FaFacebook, FaLinkedinIn, BsTelephoneFill].map((Icon, i) => (
                  <motion.li
                    key={i}
                    whileHover={{ scale: 1.18, color: '#a78bfa' }}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * i, duration: 0.4, type: 'spring', stiffness: 200 }}
                  >
                    <Link to="/contact" className="inline-block py-1 px-3 hover:text-primary font-semibold">
                      <Icon />
                    </Link>
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </div>
        </div>

        {/* Hamburger Menu Button */}
        <motion.div
          className="fixed top-2 right-4 z-50 md:hidden p-2 rounded-full shadow-2xl cursor-pointer bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900 border-2 border-purple-400/40"
          onClick={() => setOpen(!open)}
          whileTap={{ scale: 0.92, boxShadow: "0 0 0 12px #a78bfa55" }}
          whileHover={{ scale: 1.12, boxShadow: "0 0 32px 8px #a78bfa" }}
          animate={open ? { rotate: 180, background: 'linear-gradient(135deg, #18181b 60%, #a78bfa 100%)', boxShadow: "0 0 32px 8px #a78bfa" } : { rotate: 0, background: 'linear-gradient(135deg, #18181b 60%, #312e81 100%)', boxShadow: "0 0 24px 4px #312e81" }}
          transition={{ type: 'spring', stiffness: 300, damping: 18 }}
          style={{ transition: 'background 0.5s' }}
        >
          <AnimatePresence mode="wait" initial={false}>
            {open ? (
              <motion.span
                key="close"
                initial={{ scale: 0.7, rotate: -90, opacity: 0 }}
                animate={{ scale: 1.1, rotate: 0, opacity: 1 }}
                exit={{ scale: 0.7, rotate: 90, opacity: 0 }}
                transition={{ duration: 0.3, type: 'spring' }}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <MdClose className="text-xl text-white drop-shadow-lg" />
              </motion.span>
            ) : (
              <motion.span
                key="menu"
                initial={{ scale: 0.7, rotate: 90, opacity: 0 }}
                animate={{ scale: 1.1, rotate: 0, opacity: 1 }}
                exit={{ scale: 0.7, rotate: -90, opacity: 0 }}
                transition={{ duration: 0.3, type: 'spring' }}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <MdMenu className="text-xl text-white drop-shadow-lg" />
              </motion.span>
            )}
          </AnimatePresence>
          {/* Animated pulse ring */}
          <motion.span
            className="absolute inset-0 rounded-full pointer-events-none"
            animate={{
              boxShadow: open
                ? [
                    "0 0 0 0 #a78bfa55",
                    "0 0 0 12px #a78bfa22",
                    "0 0 0 24px #a78bfa00",
                    "0 0 0 0 #a78bfa00"
                  ]
                : [
                    "0 0 0 0 #312e8155",
                    "0 0 0 12px #312e8122",
                    "0 0 0 24px #312e8100",
                    "0 0 0 0 #312e8100"
                  ]
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      </motion.nav>

      <ResponseMenu open={open} setOpen={setOpen} />
    </>
  );
};

export default Navbar; 

// // src/components/Navbar/Navbar.jsx
// import React, { useState } from 'react';
// import { NavbarMenu } from '../../mockData/data';
// import { MobileNumber } from '../../mockData/data';
// import { FaFacebook, FaInstagram, FaLinkedinIn } from "react-icons/fa";
// import { FiPhoneCall } from "react-icons/fi";
// import { BsTelephoneFill } from "react-icons/bs";
// import ResponseMenu from './ResponseMenu';
// import { MdMenu } from "react-icons/md";
// import { Link } from 'react-router-dom';

// const Navbar = () => {
//   const [open, setOpen] = useState(false);

//   return (
//     <>
//       <nav className="w-full shadow-md font-luxury bg-gradient-to-br from-[#fbfbfa] to-[#dabda6] ">
//         <div className="container">
//           {/* Top Header */}
//           <div className="container justify-between items-center flex shadow-sm">
//             <div className="text-2xl gap-2 items-center font-bold py-4 px-4 flex uppercase">
//               <FiPhoneCall />
//               <p>Gouri -</p>
//               <p className="text-secondary">Inn</p>
//             </div>
//             <div className="hidden md:block font-semibold">
//               <div className="flex gap-3">
//                 <div className="mt-4 text-primary">
//                   <FiPhoneCall />
//                 </div>
//                 <p>Have any questions?</p>
//               </div>
//               <div className="flex pl-7">
//                 Free + <div className="text-primary font-sans">{MobileNumber}</div>
//               </div>
//             </div>
//           </div>

//           {/* Navbar Main */}
//           <div className="container justify-between text-black items-center flex shadow-md">
//             <div className="hidden md:block">
//               <ul className="flex gap-6 items-center">
//                 {NavbarMenu.map((item) => (
//                   <li
//                     key={item.id}
//                     className="relative group text-font_footer inline-block pb-1 font-semibold 
//                       after:absolute after:left-0 after:bottom-0 after:h-[2px]
//                       after:w-0 after:bg-primary after:transition-all after:duration-300
//                       hover:after:w-full hover:text-primary"
//                   >
//                     {item.SevaMenu ? (
//                       <>
//                         <span className="cursor-pointer text-black font-semibold hover:text-primary">
//                           {item.title}
//                         </span>
//                         <ul className="absolute left-0 top-full mt-1 bg-white opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-500 ease-in-out shadow-md rounded-lg w-48 z-50">
//                           {item.SevaMenu.map((subItem) => (
//                             <li key={subItem.id}>
//                               <Link
//                                 to={`/Seva/${subItem.slug}`}
//                                 className="block text-black px-4 py-2 hover:bg-gray-100 duration-300 rounded-md"
//                               >
//                                 {subItem.title}
//                               </Link>
//                             </li>
//                           ))}
//                         </ul>
//                       </>
//                     ) : (
//                       <Link to={item.link} className="text-black font-semibold hover:text-primary">
//                         {item.title}
//                       </Link>
//                     )}
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             {/* Icons */}
//             <div className="hidden md:block">
//               <ul className="flex items-center py-2">
//                 {[FaInstagram, FaFacebook, FaLinkedinIn, BsTelephoneFill].map((Icon, i) => (
//                   <li key={i}>
//                     <Link to="/contact" className="inline-block py-1 px-3 hover:text-primary font-semibold">
//                       <Icon />
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         </div>

//         {/* Hamburger Menu Button */}
//         <div
//           className="fixed top-2 right-4 z-50 md:hidden bg-primary p-2 rounded-full"
//           onClick={() => setOpen(!open)}
//         >
//           <MdMenu className="text-3xl text-white" />
//         </div>
//       </nav>

//       <ResponseMenu open={open} setOpen={setOpen} />
//     </>
//   );
// };

// export default Navbar;
