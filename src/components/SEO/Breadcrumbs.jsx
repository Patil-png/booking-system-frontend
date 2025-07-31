import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaChevronRight, FaHome } from 'react-icons/fa';

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const breadcrumbMap = {
    'Rooms': 'Guest Rooms',
    'room-booking': 'Book Your Stay',
    'gallery': 'Photo Gallery',
    'contact': 'Contact Us',
    'Seva': 'Services',
    'EventWedding': 'Events & Weddings',
    'FoodBeverages': 'Food & Beverages',
    'GuestRooms': 'Guest Rooms',
    'SpecialOffers': 'Special Offers'
  };

  const breadcrumbs = [
    {
      name: 'Home',
      path: '/',
      icon: <FaHome className="w-4 h-4" />
    }
  ];

  let currentPath = '';
  pathnames.forEach((name, index) => {
    currentPath += `/${name}`;
    const displayName = breadcrumbMap[name] || name.charAt(0).toUpperCase() + name.slice(1);
    
    breadcrumbs.push({
      name: displayName,
      path: currentPath,
      isLast: index === pathnames.length - 1
    });
  });

  // Don't show breadcrumbs on homepage
  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200" aria-label="Breadcrumb">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ol className="flex items-center space-x-2 py-3 text-sm">
          {breadcrumbs.map((breadcrumb, index) => (
            <li key={breadcrumb.path} className="flex items-center">
              {index > 0 && (
                <FaChevronRight className="w-3 h-3 text-gray-400 mx-2" aria-hidden="true" />
              )}
              
              {breadcrumb.isLast ? (
                <span 
                  className="text-gray-500 font-medium"
                  aria-current="page"
                >
                  {breadcrumb.icon && <span className="mr-1">{breadcrumb.icon}</span>}
                  {breadcrumb.name}
                </span>
              ) : (
                <Link
                  to={breadcrumb.path}
                  className="text-gray-600 hover:text-gray-900 transition-colors duration-200 flex items-center"
                >
                  {breadcrumb.icon && <span className="mr-1">{breadcrumb.icon}</span>}
                  {breadcrumb.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
};

export default Breadcrumbs; 