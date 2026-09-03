// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  PawPrint, 
  Phone, 
  Mail, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube,
  Clock,
  Heart,
  Award,
  Shield
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Shop', path: '/shop' },
    { name: 'Appointments', path: '/appointments' },
    { name: 'Boarding', path: '/boarding' },
    { name: 'Grooming', path: '/grooming' },
    { name: 'Mobile Visit', path: '/mobile-visit' },
    { name: 'Adoption', path: '/adoption' },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <PawPrint className="h-8 w-8 text-primary-500" />
              <span className="text-xl font-bold text-white">Animal House</span>
            </div>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              Premier companion animal hospital and pet care center serving pets since 1974.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Award className="h-4 w-4 text-primary-500" />
                <span>Serving pets for 50+ years</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Shield className="h-4 w-4 text-primary-500" />
                <span>State-of-the-art facility</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Heart className="h-4 w-4 text-primary-500" />
                <span>Compassionate care</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-400 hover:text-primary-400 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Our Services</h3>
            <ul className="space-y-2">
              <li><Link to="/services" className="text-sm text-gray-400 hover:text-primary-400 transition-colors">General Care</Link></li>
              <li><Link to="/services" className="text-sm text-gray-400 hover:text-primary-400 transition-colors">Specialized Medicine</Link></li>
              <li><Link to="/services" className="text-sm text-gray-400 hover:text-primary-400 transition-colors">Diagnostics & Emergency</Link></li>
              <li><Link to="/services" className="text-sm text-gray-400 hover:text-primary-400 transition-colors">Surgery</Link></li>
              <li><Link to="/services" className="text-sm text-gray-400 hover:text-primary-400 transition-colors">Cardiology</Link></li>
              <li><Link to="/services" className="text-sm text-gray-400 hover:text-primary-400 transition-colors">Dermatology</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-400">Zalka Highway</p>
                  <p className="text-sm text-gray-400">Lebanon</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-primary-500 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-400">+961 123 4567</p>
                  <p className="text-sm text-red-400 font-semibold">Emergency: 24/7</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary-500 flex-shrink-0" />
                <a href="mailto:info@animalhousehospital.com" className="text-sm text-gray-400 hover:text-primary-400 transition-colors">
                  info@animalhousehospital.com
                </a>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-primary-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-400">Mon-Fri: 8:00 AM - 8:00 PM</p>
                  <p className="text-sm text-gray-400">Sat: 9:00 AM - 6:00 PM</p>
                  <p className="text-sm text-red-400">Sun: Emergency Only</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social Media & Copyright */}
      <div className="border-t border-gray-800">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-primary-400 transition-colors duration-200"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-primary-400 transition-colors duration-200"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-primary-400 transition-colors duration-200"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-primary-400 transition-colors duration-200"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm text-gray-400">
                &copy; {currentYear} Animal House Hospital. All rights reserved.
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Serving pets with love and care since 1974
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;