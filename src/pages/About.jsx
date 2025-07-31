import React from 'react';
import { Helmet } from 'react-helmet-async';

const About = () => {
  return (
    <>
      <Helmet>
        <title>About Gouri Inn - Luxury Hotel & Resort</title>
        <meta name="description" content="Learn about Gouri Inn's history, amenities, and commitment to luxury hospitality. Discover why guests choose us for their perfect stay." />
        <meta name="keywords" content="about Gouri Inn, hotel history, luxury amenities, hospitality, guest services" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-white">
            <h1 className="text-4xl md:text-6xl font-bold text-center mb-8">
              About Gouri Inn
            </h1>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8">
              <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
              <p className="text-lg leading-relaxed mb-6">
                Gouri Inn has been providing exceptional hospitality services since our establishment. 
                We pride ourselves on offering a perfect blend of luxury, comfort, and traditional 
                Indian hospitality. Our commitment to excellence has made us a preferred choice 
                for travelers seeking quality accommodation.
              </p>
              
              <p className="text-lg leading-relaxed mb-6">
                Located in the heart of the city, Gouri Inn offers easy access to major attractions, 
                business centers, and transportation hubs. Our strategic location combined with 
                world-class amenities ensures a memorable stay for all our guests.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <h3 className="text-xl font-semibold mb-4">Our Mission</h3>
                <p className="leading-relaxed">
                  To provide exceptional hospitality experiences that exceed guest expectations 
                  through personalized service, luxurious amenities, and warm Indian hospitality.
                </p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <h3 className="text-xl font-semibold mb-4">Our Vision</h3>
                <p className="leading-relaxed">
                  To become the leading luxury hotel brand known for exceptional service, 
                  innovative amenities, and unforgettable guest experiences.
                </p>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8">
              <h2 className="text-2xl font-semibold mb-6">Why Choose Gouri Inn?</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-4xl mb-4">🏨</div>
                  <h4 className="font-semibold mb-2">Luxury Rooms</h4>
                  <p className="text-sm">Spacious, well-appointed rooms with modern amenities</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-4">🍽️</div>
                  <h4 className="font-semibold mb-2">Fine Dining</h4>
                  <p className="text-sm">Exquisite restaurants serving local and international cuisine</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-4">🚗</div>
                  <h4 className="font-semibold mb-2">Free Parking</h4>
                  <p className="text-sm">Secure parking facilities for all guests</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-4">📶</div>
                  <h4 className="font-semibold mb-2">Free WiFi</h4>
                  <p className="text-sm">High-speed internet throughout the property</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-4">🎯</div>
                  <h4 className="font-semibold mb-2">Prime Location</h4>
                  <p className="text-sm">Central location with easy access to attractions</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-4">👥</div>
                  <h4 className="font-semibold mb-2">24/7 Service</h4>
                  <p className="text-sm">Round-the-clock concierge and room service</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Address</h4>
                  <p className="mb-4">Your Street Address<br />Your City, State - XXXXXX<br />India</p>
                  
                  <h4 className="font-semibold mb-2">Phone</h4>
                  <p className="mb-4">+91-XXXXXXXXXX</p>
                  
                  <h4 className="font-semibold mb-2">Email</h4>
                  <p>info@gouriinn.com</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Check-in/Check-out</h4>
                  <p className="mb-4">Check-in: 2:00 PM<br />Check-out: 11:00 AM</p>
                  
                  <h4 className="font-semibold mb-2">Reception Hours</h4>
                  <p className="mb-4">24/7 Front Desk Service</p>
                  
                  <h4 className="font-semibold mb-2">Languages</h4>
                  <p>English, Hindi, Local Languages</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About; 