// src/pages/Boarding.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  Dog,
  Calendar,
  Clock,
  Users,
  Shield,
  Heart,
  Star,
  Wifi,
  Tv,
  Bath,
  Coffee,
  MapPin,
  Phone,
  Mail,
  Loader,
  CheckCircle
} from 'lucide-react';

const Boarding = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [pets, setPets] = useState([]);
  const [fetchingData, setFetchingData] = useState(true);
  
  const [formData, setFormData] = useState({
    petId: '',
    checkIn: '',
    checkOut: '',
    specialRequirements: '',
    emergencyContact: ''
  });

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      setFetchingData(true);
      if (isAuthenticated) {
        const response = await axios.get('/api/pets');
        setPets(response.data);
      }
    } catch (error) {
      console.error('Error fetching pets:', error);
    } finally {
      setFetchingData(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to book boarding');
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      await axios.post('/api/bookings', {
        petId: parseInt(formData.petId),
        bookingType: 'boarding',
        startDate: formData.checkIn,
        endDate: formData.checkOut,
        notes: formData.specialRequirements
      });

      toast.success('Boarding request submitted! We will contact you shortly.');
      setFormData({
        petId: '',
        checkIn: '',
        checkOut: '',
        specialRequirements: '',
        emergencyContact: ''
      });
      navigate('/bookings');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit boarding request');
    } finally {
      setLoading(false);
    }
  };

  const amenities = [
    { icon: Wifi, name: 'Free WiFi' },
    { icon: Tv, name: 'TV Lounge' },
    { icon: Bath, name: 'Grooming Services' },
    { icon: Coffee, name: 'Premium Food' },
    { icon: Heart, name: '24/7 Care' },
    { icon: Shield, name: 'Secure Facility' }
  ];

  const packages = [
    {
      name: 'Standard',
      price: '$25/night',
      features: ['Comfortable bedding', 'Regular feeding', 'Daily walks', 'Playtime']
    },
    {
      name: 'Premium',
      price: '$45/night',
      features: ['Luxury suite', 'Premium food', 'Extra playtime', 'Grooming session', '24/7 monitoring']
    },
    {
      name: 'Luxury',
      price: '$75/night',
      features: ['Executive suite', 'Personalized care', 'Spa treatment', 'Training session', 'Photo updates', 'VIP access']
    }
  ];

  if (fetchingData) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader className="h-12 w-12 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="container-custom">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl text-white p-8 mb-12">
          <div className="flex items-center space-x-4 mb-4">
            <Dog className="h-12 w-12" />
            <h1 className="text-3xl md:text-4xl font-bold">Pet Boarding & Hotel</h1>
          </div>
          <p className="text-primary-100 text-lg max-w-2xl">
            A home away from home for your beloved pets. Our luxury boarding facilities 
            provide comfort, care, and entertainment for your furry family members.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Amenities */}
            <div className="card p-6">
              <h2 className="text-2xl font-bold mb-4">Our Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {amenities.map((amenity, index) => {
                  const Icon = amenity.icon;
                  return (
                    <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                      <Icon className="h-8 w-8 text-primary-600 mx-auto mb-2" />
                      <p className="text-sm font-medium">{amenity.name}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Packages */}
            <div className="card p-6">
              <h2 className="text-2xl font-bold mb-4">Boarding Packages</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {packages.map((pkg, index) => (
                  <div key={index} className={`border rounded-lg p-4 ${index === 1 ? 'border-primary-600 bg-primary-50' : 'border-gray-200'}`}>
                    {index === 1 && (
                      <span className="inline-block bg-primary-600 text-white text-xs px-2 py-1 rounded-full mb-2">Most Popular</span>
                    )}
                    <h3 className="text-lg font-bold">{pkg.name}</h3>
                    <p className="text-2xl font-bold text-primary-600 my-2">{pkg.price}</p>
                    <ul className="space-y-2">
                      {pkg.features.map((feature, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-primary-600 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h2 className="text-2xl font-bold mb-4">Book Boarding</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Pet
                  </label>
                  <select
                    name="petId"
                    value={formData.petId}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select your pet</option>
                    {pets.map((pet) => (
                      <option key={pet.id} value={pet.id}>
                        {pet.name} ({pet.type})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Check-in Date
                  </label>
                  <input
                    type="date"
                    name="checkIn"
                    value={formData.checkIn}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Check-out Date
                  </label>
                  <input
                    type="date"
                    name="checkOut"
                    value={formData.checkOut}
                    onChange={handleChange}
                    min={formData.checkIn || new Date().toISOString().split('T')[0]}
                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Emergency Contact
                  </label>
                  <input
                    type="text"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                    placeholder="Phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Special Requirements
                  </label>
                  <textarea
                    name="specialRequirements"
                    value={formData.specialRequirements}
                    onChange={handleChange}
                    rows="3"
                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Any special needs or preferences..."
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full btn-primary py-3 disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Book Boarding'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Boarding;