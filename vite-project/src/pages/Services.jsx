// src/pages/Services.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Stethoscope, 
  Heart, 
  Brain, 
  Microscope, 
  Scissors, 
  Activity,
  Search,
  Filter,
  Loader
} from 'lucide-react';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const categories = [
    { value: 'all', label: 'All Services' },
    { value: 'general', label: 'General Care' },
    { value: 'specialized', label: 'Specialized Medicine' },
    { value: 'diagnostics', label: 'Diagnostics & Emergency' },
    { value: 'grooming', label: 'Grooming' }
  ];

  const categoryIcons = {
    general: Stethoscope,
    specialized: Heart,
    diagnostics: Microscope,
    grooming: Scissors,
    emergency: Activity
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/services');
      setServices(response.data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = services.filter(service => {
    const matchesCategory = filter === 'all' || service.category === filter;
    const matchesSearch = service.name?.toLowerCase().includes(search.toLowerCase()) ||
                         service.description?.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader className="h-12 w-12 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Our Veterinary Services</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Comprehensive medical care for your pets, from routine wellness exams 
            to advanced specialized treatments.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search services..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setFilter(cat.value)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  filter === cat.value
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => {
            const Icon = categoryIcons[service.category] || Stethoscope;
            return (
              <Link
                key={service.id}
                to={`/services/${service.id}`}
                className="card p-6 hover:shadow-xl transition-shadow hover:-translate-y-1 duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-primary-100 rounded-full p-3">
                    <Icon className="h-6 w-6 text-primary-600" />
                  </div>
                  <span className="text-lg font-bold text-primary-600">
                    ${service.price}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{service.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">{service.duration_minutes} min</span>
                  <span className="text-primary-600 font-medium">Learn More →</span>
                </div>
              </Link>
            );
          })}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No services found matching your criteria.</p>
            <button
              onClick={() => {
                setFilter('all');
                setSearch('');
              }}
              className="text-primary-600 hover:underline mt-2"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;