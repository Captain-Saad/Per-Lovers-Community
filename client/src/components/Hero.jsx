import React from 'react';
import { Link } from 'react-router-dom';
import heroBackground from '../assets/krista-mangulsone-9gz3wfHr65U-unsplash.jpg'; // Corrected filename

const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${heroBackground})`,
          filter: "brightness(0.7)" // Adjust brightness for better text contrast
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-white px-4">
        <h1 className="text-5xl md:text-6xl font-bold text-center mb-6">
          Welcome to Pet Lovers Community
        </h1>
        <p className="text-xl md:text-2xl text-center mb-8 max-w-2xl">
          Share your pet stories, connect with other pet lovers, and find your perfect companion.
        </p>
        <div className="flex gap-4">
          <Link
            to="/pets"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors duration-200"
          >
            Explore Pets
          </Link>
          <Link
            to="/create-post"
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors duration-200"
          >
            Share Your Story
          </Link>
          </div>
      </div>
    </div>
  );
};

export default Hero;