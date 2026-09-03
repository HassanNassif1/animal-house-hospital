// src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import animalhouseLogo from '../img/animalhousehospital.webp';
import {
  Menu,
  X,
  ShoppingCart,
  User,
  PawPrint,
  Phone,
  Heart,
  LogOut,
  Home,
  Stethoscope,
  ShoppingBag,
  Calendar,
  Dog,
  Scissors,
  Truck
} from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Services', path: '/services', icon: Stethoscope },
    { name: 'Shop', path: '/shop', icon: ShoppingBag },
    { name: 'Appointments', path: '/appointments', icon: Calendar },
    { name: 'Boarding', path: '/boarding', icon: Dog },
    { name: 'Grooming', path: '/grooming', icon: Scissors },
    { name: 'Mobile Visit', path: '/mobile-visit', icon: Truck },
    { name: 'Adoption', path: '/adoption', icon: Heart },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
    setShowMobileMenu(false);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-100">
      <div className="container-custom">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
            <PawPrint className="h-8 w-8 text-primary-600" />
        <img
  src={animalhouseLogo}
  alt="Animal House Hospital"
  className="h-4 w-auto object-contain hidden sm:inline"
/>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-gray-700 hover:text-primary-600 transition-colors duration-200 flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-primary-50 text-sm font-medium"
              >
                <link.icon className="h-4 w-4" />
                <span>{link.name}</span>
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-3">
            {/* Emergency Hotline */}
            <div className="hidden md:flex items-center space-x-1 text-red-600 bg-red-50 px-3 py-1.5 rounded-lg">
              <Phone className="h-4 w-4" />
              <span className="text-xs font-semibold">Emergency: +961 123 4567</span>
            </div>

            {/* Cart */}
            <Link to="/cart" className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ShoppingCart className="h-5 w-5 text-gray-700" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {getTotalItems()}
                </span>
              )}
            </Link>

            {/* Auth buttons */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <User className="h-5 w-5" />
                  <span className="hidden sm:inline text-sm font-medium">{user?.fullName?.split(' ')[0]}</span>
                </button>
                {isOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-100">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 hover:bg-gray-50 flex items-center space-x-2 text-sm"
                      onClick={() => setIsOpen(false)}
                    >
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                    <Link
                      to="/bookings"
                      className="block px-4 py-2 hover:bg-gray-50 flex items-center space-x-2 text-sm"
                      onClick={() => setIsOpen(false)}
                    >
                      <Calendar className="h-4 w-4" />
                      <span>My Bookings</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2 text-sm text-red-600"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-primary-600 text-sm font-medium px-3 py-1.5"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary text-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {showMobileMenu ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {showMobileMenu && (
          <div className="lg:hidden py-4 border-t border-gray-100">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="block py-2.5 px-2 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg flex items-center space-x-2 text-sm font-medium"
                onClick={() => setShowMobileMenu(false)}
              >
                <link.icon className="h-5 w-5" />
                <span>{link.name}</span>
              </Link>
            ))}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-2 text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                <Phone className="h-5 w-5" />
                <span className="font-semibold text-sm">Emergency: +961 123 4567</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;