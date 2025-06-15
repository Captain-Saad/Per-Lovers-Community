import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false); // State for mobile menu

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsOpen(false); // Close menu on logout
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            Pet Lovers
          </Link>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
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

      {/* Mobile menu dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg pb-4">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className={isActive('/') ? 'block px-3 py-2 rounded-md text-base font-medium text-blue-600 bg-blue-50' : 'block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50'}
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/pets"
              className={isActive('/pets') ? 'block px-3 py-2 rounded-md text-base font-medium text-blue-600 bg-blue-50' : 'block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50'}
              onClick={() => setIsOpen(false)}
            >
              Pets
            </Link>
            {user ? (
              <>
                <Link
                  to="/create-post"
                  className={isActive('/create-post') ? 'block px-3 py-2 rounded-md text-base font-medium text-blue-600 bg-blue-50' : 'block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50'}
                  onClick={() => setIsOpen(false)}
                >
                  Create Post
                </Link>
                <Link
                  to="/about"
                  className={isActive('/about') ? 'block px-3 py-2 rounded-md text-base font-medium text-blue-600 bg-blue-50' : 'block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50'}
                  onClick={() => setIsOpen(false)}
                >
                  About Us
                </Link>
                <Link
                  to="/profile"
                  className={isActive('/profile') ? 'block px-3 py-2 rounded-md text-base font-medium text-blue-600 bg-blue-50' : 'block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50'}
                  onClick={() => setIsOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium bg-red-500 text-white hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={isActive('/login') ? 'block px-3 py-2 rounded-md text-base font-medium text-blue-600 bg-blue-50' : 'block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50'}
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className={isActive('/register') ? 'block px-3 py-2 rounded-md text-base font-medium bg-blue-600 text-white hover:bg-blue-700' : 'block px-3 py-2 rounded-md text-base font-medium bg-blue-600 text-white hover:bg-blue-700'}
                  onClick={() => setIsOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;