import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            Pet Lovers
          </Link>

          <div className="flex items-center space-x-4">
            <Link to="/" className={isActive('/') ? 'text-blue-600 font-bold border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'}>
              Home
            </Link>
            <Link to="/pets" className={isActive('/pets') ? 'text-blue-600 font-bold border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'}>
              Pets
            </Link>
            {user ? (
              <>
                <Link
                  to="/create-post"
                  className={isActive('/create-post') ? 'text-blue-600 font-bold border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'}
                >
                  Create Post
                </Link>
                <Link to="/about" className={isActive('/about') ? 'text-blue-600 font-bold border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'}>About Us</Link>
                <Link to="/profile" className={isActive('/profile') ? 'text-blue-600 font-bold border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'}>Profile</Link>
          <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
                  Logout
          </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={isActive('/login') ? 'text-blue-600 font-bold border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className={isActive('/register') ? 'bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700' : 'bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'}
                >
                  Register
                </Link>
              </>
            )}
        </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;