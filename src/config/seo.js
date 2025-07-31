// SEO Configuration for StayLuxe Hotel Booking System

export const seoConfig = {
  // Site-wide SEO settings
  site: {
    name: 'StayLuxe Hotel',
    url: 'https://your-actual-domain.com', // ⚠️ REPLACE WITH YOUR DOMAIN
    description: 'Experience luxury redefined at StayLuxe Hotel. Book premium accommodations with 5-star amenities, fine dining, spa services, and exceptional hospitality.',
    keywords: 'luxury hotel, hotel booking, premium accommodation, 5-star hotel, luxury stay, hotel rooms, presidential suite, deluxe rooms, spa hotel, fine dining, hotel amenities, luxury accommodation',
    author: 'StayLuxe Hotel',
    language: 'en',
    region: 'IN',
    currency: 'INR',
    phone: '+91-9876543210', // ⚠️ REPLACE WITH YOUR PHONE
    email: 'info@stayluxe.com', // ⚠️ REPLACE WITH YOUR EMAIL
    address: {
      street: '123 Luxury Street', // ⚠️ REPLACE WITH YOUR ADDRESS
      city: 'Mumbai', // ⚠️ REPLACE WITH YOUR CITY
      state: 'Maharashtra', // ⚠️ REPLACE WITH YOUR STATE
      postalCode: '400001', // ⚠️ REPLACE WITH YOUR POSTAL CODE
      country: 'IN'
    },
    coordinates: {
      latitude: '19.0760', // ⚠️ REPLACE WITH YOUR LATITUDE
      longitude: '72.8777' // ⚠️ REPLACE WITH YOUR LONGITUDE
    },
    social: {
      facebook: 'https://facebook.com/stayluxe', // ⚠️ REPLACE WITH YOUR SOCIAL LINKS
      instagram: 'https://instagram.com/stayluxe',
      linkedin: 'https://linkedin.com/company/stayluxe',
      twitter: 'https://twitter.com/stayluxe'
    }
  },

  // Page-specific SEO configurations
  pages: {
    home: {
      title: 'Luxury Hotel Booking | Premium Accommodations & 5-Star Experience',
      description: 'Experience luxury redefined at StayLuxe Hotel. Book premium accommodations with 5-star amenities, fine dining, spa services, and exceptional hospitality. Best rates guaranteed.',
      keywords: 'luxury hotel, hotel booking, premium accommodation, 5-star hotel, luxury stay, hotel rooms, presidential suite, deluxe rooms, spa hotel, fine dining, hotel amenities, luxury accommodation',
      image: '/og-image.jpg',
      url: '/',
      priority: 1.0,
      changefreq: 'weekly'
    },

    rooms: {
      title: 'Luxury Hotel Rooms & Suites | Presidential, Deluxe, Executive',
      description: 'Explore our premium accommodations including Presidential Suites, Deluxe Rooms, and Executive Suites. Each room is designed for ultimate comfort and luxury.',
      keywords: 'luxury hotel rooms, executive suites, family suites, hotel accommodations, hotel rooms, hotel stay, presidential suite, deluxe room',
      image: '/RoomImages/deluxe.jpg',
      url: '/Rooms',
      priority: 0.9,
      changefreq: 'weekly'
    },

    booking: {
      title: 'Book Your Stay | Luxury Hotel Reservations',
      description: 'Secure your luxury stay at StayLuxe Hotel. Easy online booking with instant confirmation, flexible cancellation, and best rate guarantee.',
      keywords: 'hotel booking, luxury hotel reservation, book hotel room, online hotel booking, hotel reservation system',
      image: '/og-image.jpg',
      url: '/room-booking',
      priority: 0.9,
      changefreq: 'daily'
    },

    gallery: {
      title: 'Hotel Gallery | Luxury Accommodations & Amenities Photos',
      description: 'Browse our photo gallery showcasing luxury rooms, amenities, dining experiences, and beautiful hotel spaces at StayLuxe Hotel.',
      keywords: 'hotel gallery, luxury hotel photos, hotel amenities photos, room pictures, hotel interior photos',
      image: '/gallery-preview.jpg',
      url: '/gallery',
      priority: 0.8,
      changefreq: 'weekly'
    },

    contact: {
      title: 'Contact StayLuxe Hotel | Book Your Luxury Stay',
      description: 'Get in touch with StayLuxe Hotel. Contact us for reservations, inquiries, or special requests. We\'re here to make your stay exceptional.',
      keywords: 'contact hotel, hotel contact information, hotel phone number, hotel email, hotel address',
      image: '/og-image.jpg',
      url: '/contact',
      priority: 0.7,
      changefreq: 'monthly'
    },

    services: {
      eventWedding: {
        title: 'Events & Weddings | Luxury Hotel Venue',
        description: 'Host your dream wedding or special event at StayLuxe Hotel. Beautiful venues, expert planning, and exceptional service for unforgettable celebrations.',
        keywords: 'wedding venue, event space, hotel wedding, luxury wedding venue, corporate events, party venue',
        image: '/event-venue.jpg',
        url: '/Seva/EventWedding',
        priority: 0.8,
        changefreq: 'weekly'
      },

      foodBeverages: {
        title: 'Fine Dining & Beverages | Gourmet Restaurant',
        description: 'Savor exquisite cuisine at our award-winning restaurants. From fine dining to casual meals, experience culinary excellence at StayLuxe Hotel.',
        keywords: 'fine dining, gourmet restaurant, hotel restaurant, luxury dining, food and beverages, culinary experience',
        image: '/restaurant.jpg',
        url: '/Seva/FoodBeverages',
        priority: 0.8,
        changefreq: 'weekly'
      },

      specialOffers: {
        title: 'Special Offers & Packages | Luxury Hotel Deals',
        description: 'Discover exclusive offers and packages at StayLuxe Hotel. Special rates, seasonal deals, and luxury packages for your perfect stay.',
        keywords: 'hotel deals, special offers, luxury packages, hotel discounts, seasonal rates, promotional offers',
        image: '/special-offers.jpg',
        url: '/Seva/SpecialOffers',
        priority: 0.8,
        changefreq: 'daily'
      }
    },

    notFound: {
      title: 'Page Not Found | StayLuxe Hotel',
      description: 'The page you\'re looking for doesn\'t exist. Explore our luxury hotel accommodations and services.',
      keywords: '404, page not found, hotel booking, luxury accommodation',
      image: '/og-image.jpg',
      url: '/404',
      priority: 0.1,
      changefreq: 'monthly'
    }
  },

  // Structured data templates
  structuredData: {
    organization: {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "StayLuxe Hotel",
      "url": "https://your-domain.com",
      "logo": "https://your-domain.com/logo.png",
      "sameAs": [
        "https://facebook.com/stayluxe",
        "https://instagram.com/stayluxe",
        "https://linkedin.com/company/stayluxe"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+91-XXXXXXXXXX",
        "contactType": "customer service",
        "availableLanguage": "English"
      }
    },

    hotel: {
      "@context": "https://schema.org",
      "@type": "Hotel",
      "name": "StayLuxe Hotel",
      "description": "Experience luxury redefined at StayLuxe Hotel with premium accommodations, 5-star amenities, fine dining, and exceptional hospitality.",
      "url": "https://your-domain.com",
      "logo": "https://your-domain.com/logo.png",
      "image": "https://your-domain.com/hotel-image.jpg",
      "telephone": "+91-XXXXXXXXXX",
      "email": "info@stayluxe.com",
      "priceRange": "₹₹₹",
      "starRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5"
      },
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Your Street Address",
        "addressLocality": "Your City",
        "addressRegion": "Your State",
        "postalCode": "Your Postal Code",
        "addressCountry": "IN"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "YOUR_LATITUDE",
        "longitude": "YOUR_LONGITUDE"
      },
      "amenityFeature": [
        {
          "@type": "LocationFeatureSpecification",
          "name": "WiFi",
          "value": true
        },
        {
          "@type": "LocationFeatureSpecification",
          "name": "Spa",
          "value": true
        },
        {
          "@type": "LocationFeatureSpecification",
          "name": "Restaurant",
          "value": true
        },
        {
          "@type": "LocationFeatureSpecification",
          "name": "Parking",
          "value": true
        },
        {
          "@type": "LocationFeatureSpecification",
          "name": "Room Service",
          "value": true
        }
      ]
    },

    breadcrumb: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://your-domain.com"
        }
      ]
    }
  },

  // Open Graph configurations
  openGraph: {
    type: 'website',
    siteName: 'StayLuxe Hotel',
    locale: 'en_US',
    imageWidth: 1200,
    imageHeight: 630
  },

  // Twitter Card configurations
  twitter: {
    card: 'summary_large_image',
    site: '@stayluxe',
    creator: '@stayluxe'
  },

  // Analytics configurations
  analytics: {
    googleAnalytics: {
      measurementId: 'GA_MEASUREMENT_ID' // Replace with your GA4 ID
    },
    googleTagManager: {
      containerId: 'GTM_CONTAINER_ID' // Replace with your GTM ID
    }
  },

  // Performance configurations
  performance: {
    preloadCriticalResources: [
      '/favicon.png',
      '/RoomImages/deluxe.jpg',
      '/RoomImages/executive.jpg'
    ],
    preconnectDomains: [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      'https://checkout.razorpay.com'
    ]
  }
};

// Helper function to get page SEO config
export const getPageSEO = (pageName, customData = {}) => {
  const pageConfig = seoConfig.pages[pageName];
  if (!pageConfig) {
    console.warn(`SEO config not found for page: ${pageName}`);
    return seoConfig.pages.home;
  }
  
  return {
    ...pageConfig,
    ...customData
  };
};

// Helper function to generate structured data
export const generateStructuredData = (type, customData = {}) => {
  const baseData = seoConfig.structuredData[type];
  if (!baseData) {
    console.warn(`Structured data template not found for type: ${type}`);
    return {};
  }
  
  return {
    ...baseData,
    ...customData
  };
}; 