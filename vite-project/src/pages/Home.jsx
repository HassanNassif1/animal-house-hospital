// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Stethoscope, 
  ShoppingBag, 
  Calendar, 
  Dog, 
  Scissors, 
  Truck, 
  Heart, 
  Phone, 
  Award, 
  Users, 
  Clock,
  ArrowRight
} from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: Stethoscope,
      title: 'Veterinary Services',
      description: 'Comprehensive care from wellness exams to specialized surgery',
      link: '/services'
    },
    {
      icon: ShoppingBag,
      title: 'Pet Shop',
      description: 'Premium food, accessories, toys, and supplements',
      link: '/shop'
    },
    {
      icon: Calendar,
      title: 'Appointments',
      description: 'Easy online booking for veterinary care',
      link: '/appointments'
    },
    {
      icon: Dog,
      title: 'Boarding',
      description: 'Luxury pet hotel accommodations',
      link: '/boarding'
    },
    {
      icon: Scissors,
      title: 'Grooming',
      description: 'Professional grooming services',
      link: '/grooming'
    },
    {
      icon: Truck,
      title: 'Mobile Vet',
      description: 'Convenient home visit services',
      link: '/mobile-visit'
    },
    {
      icon: Heart,
      title: 'Adoption',
      description: 'Find your new family member',
      link: '/adoption'
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="container-custom">
          <div className="max-w-3xl">
            <div className="flex items-center space-x-2 text-primary-200 mb-4">
              <Award className="h-6 w-6" />
              <span className="font-semibold">Serving pets since 1974</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Your Pet's Health is Our Priority
            </h1>
            <p className="text-xl text-primary-100 mb-8 leading-relaxed">
              Premier companion animal hospital providing state-of-the-art diagnostics, 
              medical services, grooming, boarding, and training.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/services" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors">
                Explore Services
              </Link>
              <Link to="/appointments" className="bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-800 transition-colors flex items-center space-x-2">
                <span>Book Appointment</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
            <div className="mt-8 flex items-center space-x-2 text-primary-200">
              <Phone className="h-5 w-5" />
              <span>Emergency Hotline: +961 123 4567</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <h2 className="section-title text-center mb-4">Our Services</h2>
          <p className="section-subtitle text-center mb-12">
            Comprehensive care for your beloved pets, from routine checkups to specialized treatments
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Link
                key={index}
                to={feature.link}
                className="card p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <feature.icon className="h-12 w-12 text-primary-600 mb-4" />
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;