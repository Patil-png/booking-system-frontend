// src/components/Navbar/Navbar.jsx
import React, { useState } from 'react';
import { NavbarMenu } from '../../mockData/data';
import { MobileNumber } from '../../mockData/data';
import { FaFacebook, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { FiPhoneCall } from "react-icons/fi";
import { BsTelephoneFill } from "react-icons/bs";
import ResponseMenu from './ResponseMenu';
import { MdMenu } from "react-icons/md";
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="w-full shadow-md font-luxury bg-gradient-to-br from-[#fbfbfa] to-[#dabda6] ">
        <div className="container">
          {/* Top Header */}
          <div className="container justify-between items-center flex shadow-sm">
            <div className="text-2xl gap-2 items-center font-bold py-4 px-4 flex uppercase">
              <FiPhoneCall />
              <p>Gouri -</p>
              <p className="text-secondary">Inn</p>
            </div>
            <div className="hidden md:block font-semibold">
              <div className="flex gap-3">
                <div className="mt-4 text-primary">
                  <FiPhoneCall />
                </div>
                <p>Have any questions?</p>
              </div>
              <div className="flex pl-7">
                Free + <div className="text-primary font-sans">{MobileNumber}</div>
              </div>
            </div>
          </div>

          {/* Navbar Main */}
          <div className="container justify-between text-black items-center flex shadow-md">
            <div className="hidden md:block">
              <ul className="flex gap-6 items-center">
                {NavbarMenu.map((item) => (
                  <li
                    key={item.id}
                    className="relative group text-font_footer inline-block pb-1 font-semibold 
                      after:absolute after:left-0 after:bottom-0 after:h-[2px]
                      after:w-0 after:bg-primary after:transition-all after:duration-300
                      hover:after:w-full hover:text-primary"
                  >
                    {item.SevaMenu ? (
                      <>
                        <span className="cursor-pointer text-black font-semibold hover:text-primary">
                          {item.title}
                        </span>
                        <ul className="absolute left-0 top-full mt-1 bg-white opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-500 ease-in-out shadow-md rounded-lg w-48 z-50">
                          {item.SevaMenu.map((subItem) => (
                            <li key={subItem.id}>
                              <Link
                                to={`/Seva/${subItem.slug}`}
                                className="block text-black px-4 py-2 hover:bg-gray-100 duration-300 rounded-md"
                              >
                                {subItem.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </>
                    ) : (
                      <Link to={item.link} className="text-black font-semibold hover:text-primary">
                        {item.title}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Icons */}
            <div className="hidden md:block">
              <ul className="flex items-center py-2">
                {[FaInstagram, FaFacebook, FaLinkedinIn, BsTelephoneFill].map((Icon, i) => (
                  <li key={i}>
                    <Link to="/contact" className="inline-block py-1 px-3 hover:text-primary font-semibold">
                      <Icon />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Hamburger Menu Button */}
        <div
          className="fixed top-2 right-4 z-50 md:hidden bg-primary p-2 rounded-full"
          onClick={() => setOpen(!open)}
        >
          <MdMenu className="text-3xl text-white" />
        </div>
      </nav>

      <ResponseMenu open={open} setOpen={setOpen} />
    </>
  );
};

export default Navbar;
