// src/components/Navbar/ResponseMenu.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NavbarMenu } from '../../mockData/data';
import { MdClose } from 'react-icons/md';

const ResponseMenu = ({ open, setOpen }) => {
  const [activeMenuId, setActiveMenuId] = useState(null);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
    setActiveMenuId(null);
  }, [location.pathname]);

  const toggleServicesMenu = (id) => {
    setActiveMenuId((prev) => (prev === id ? null : id));
  };

  return (
    <>
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 bg-black bg-opacity-40 z-30 transition-opacity duration-300 ${open ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
      />
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white shadow-lg z-40 transform transition-transform duration-300 ease-in-out ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex justify-end p-4">
          <button onClick={() => setOpen(false)}>
            <MdClose className="text-2xl text-gray-600 hover:text-primary" />
          </button>
        </div>

        <ul className="flex flex-col px-6 space-y-4">
          {NavbarMenu.map((item) => (
            <li key={item.id}>
              {item.SevaMenu ? (
                <>
                  <button
                    onClick={() => toggleServicesMenu(item.id)}
                    className="w-full text-left font-semibold text-gray-800 hover:text-primary"
                  >
                    {item.title}
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      activeMenuId === item.id ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <ul className="ml-3 mt-2 space-y-2">
                      {item.SevaMenu.map((subItem) => (
                        <li key={subItem.id}>
                          <Link
                            to={subItem.link}
                            className="block text-sm text-gray-700 hover:text-primary"
                          >
                            {subItem.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : (
                <Link
                  to={item.link}
                  className="block font-semibold text-gray-800 hover:text-primary"
                >
                  {item.title}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
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