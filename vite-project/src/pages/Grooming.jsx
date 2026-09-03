// src/pages/Grooming.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Scissors,
  Bath,
  PawPrint,
  Calendar,
  Clock,
  Star,
  Sparkles,
  Brush,
  Award,
  Phone,
  MapPin,
  Mail,
  CheckCircle,
  Loader,
  Heart,
  Truck,
  User,
  Home,
  AlertCircle
} from 'lucide-react';

const Grooming = () => {
  const { isAuthenticated, api } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);
  const [pets, setPets] = useState([]);
  const [fetchingData, setFetchingData] = useState(true);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    petId: '',
    serviceId: '',
    date: '',
    time: '',
    notes: '',
    phone: ''
  });

  // Fetch grooming services and pets
  useEffect(() => {
    fetchData();
  }, [isAuthenticated]);

  const fetchData = async () => {
    try {
      setFetchingData(true);
      setError(null);
      
      // Fetch all services
      const servicesRes = await api.get('/services');
      console.log('Services response:', servicesRes.data);
      
      // Filter services that are grooming related
      const allServices = servicesRes.data || [];
      const groomingServices = allServices.filter(s => 
        s.category === 'grooming' || 
        s.name?.toLowerCase().includes('groom') || 
        s.name?.toLowerCase().includes('bath') ||
        s.name?.toLowerCase().includes('brush') ||
        s.name?.toLowerCase().includes('trim') ||
        s.name?.toLowerCase().includes('cut') ||
        s.name?.toLowerCase().includes('style') ||
        s.name?.toLowerCase().includes('spa')
      );
      
      console.log('Grooming services found:', groomingServices.length);
      
      if (groomingServices.length > 0) {
        setServices(groomingServices);
      } else {
        // If no grooming services found, try to get all services and filter differently
        const fallbackServices = allServices.filter(s => 
          s.category === 'grooming' || 
          s.category === 'general'
        );
        if (fallbackServices.length > 0) {
          setServices(fallbackServices);
        } else {
          // Use all services if no grooming specific ones
          setServices(allServices);
        }
      }

      // Fetch user's pets if authenticated
      if (isAuthenticated) {
        try {
          const petsRes = await api.get('/pets');
          setPets(petsRes.data || []);
          console.log('Pets fetched:', petsRes.data?.length || 0);
        } catch (petError) {
          console.error('Error fetching pets:', petError);
          if (petError.response?.status === 401) {
            toast.error('Please login to view your pets');
          }
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.message || 'Failed to load data');
      if (error.response?.status === 401) {
        toast.error('Please login to book grooming');
      } else {
        toast.error('Failed to load grooming services');
      }
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
      toast.error('Please login to book grooming');
      navigate('/login');
      return;
    }

    // Validate form
    if (!formData.petId) {
      toast.error('Please select a pet');
      return;
    }
    if (!formData.serviceId) {
      toast.error('Please select a service');
      return;
    }
    if (!formData.date) {
      toast.error('Please select a date');
      return;
    }
    if (!formData.time) {
      toast.error('Please select a time');
      return;
    }

    setLoading(true);
    try {
      // Create appointment using authenticated api
      await api.post('/appointments', {
        petId: parseInt(formData.petId),
        serviceId: parseInt(formData.serviceId),
        appointmentDate: formData.date,
        appointmentTime: formData.time,
        appointmentType: 'grooming',
        notes: formData.notes
      });

      toast.success('Grooming appointment booked successfully!');
      setFormData({
        petId: '',
        serviceId: '',
        date: '',
        time: '',
        notes: '',
        phone: ''
      });
      navigate('/bookings');
    } catch (error) {
      console.error('Booking error:', error);
      toast.error(error.response?.data?.message || 'Failed to book grooming');
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    { icon: Award, title: 'Expert Groomers', description: 'Certified professionals' },
    { icon: Sparkles, title: 'Premium Products', description: 'High-quality, safe products' },
    { icon: Heart, title: 'Stress-Free Environment', description: 'Calm and comfortable' },
    { icon: Truck, title: 'Mobile Service', description: 'Convenient home visits' }
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
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl text-white p-8 mb-12">
          <div className="flex items-center space-x-4 mb-4">
            <Scissors className="h-12 w-12" />
            <h1 className="text-3xl md:text-4xl font-bold">Professional Grooming</h1>
          </div>
          <p className="text-purple-100 text-lg max-w-2xl">
            Keep your pet looking and feeling their best with our professional grooming services. 
            We offer a full range of grooming options for dogs and cats.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Services List */}
          <div className="lg:col-span-2">
            <div className="card p-6 mb-8">
              <h2 className="text-2xl font-bold mb-6">Our Grooming Services</h2>
              {services.length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-3" />
                  <p className="text-gray-600">No grooming services available at the moment.</p>
                  <p className="text-sm text-gray-500 mt-2">Please check back later.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {services.map((service) => (
                    <div key={service.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold">{service.name}</h3>
                        <span className="text-lg font-bold text-purple-600">${service.price}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                      <p className="text-xs text-gray-500 flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{service.duration_minutes} minutes</span>
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Why Choose Us */}
            <div className="card p-6">
              <h2 className="text-2xl font-bold mb-4">Why Choose Our Grooming Services</h2>
              <div className="grid grid-cols-2 gap-4">
                {benefits.map((benefit, index) => {
                  const Icon = benefit.icon;
                  return (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium">{benefit.title}</h4>
                        <p className="text-sm text-gray-600">{benefit.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h2 className="text-2xl font-bold mb-4">Book Grooming</h2>
              {!isAuthenticated ? (
                <div className="text-center py-4">
                  <p className="text-gray-600 mb-3">Please login to book grooming</p>
                  <button
                    onClick={() => navigate('/login')}
                    className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Login
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select Pet
                    </label>
                    <select
                      name="petId"
                      value={formData.petId}
                      onChange={handleChange}
                      className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select your pet</option>
                      {pets.map((pet) => (
                        <option key={pet.id} value={pet.id}>
                          {pet.name} ({pet.type})
                        </option>
                      ))}
                    </select>
                    {pets.length === 0 && (
                      <p className="text-sm text-yellow-600 mt-1">No pets registered. Please add a pet first.</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Service
                    </label>
                    <select
                      name="serviceId"
                      value={formData.serviceId}
                      onChange={handleChange}
                      className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select service</option>
                      {services.map((service) => (
                        <option key={service.id} value={service.id}>
                          {service.name} - ${service.price}
                        </option>
                      ))}
                    </select>
                    {services.length === 0 && (
                      <p className="text-sm text-yellow-600 mt-1">No services available</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Time
                    </label>
                    <input
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Special Notes
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows="2"
                      className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Any special requests..."
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={loading || services.length === 0}
                    className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader className="h-5 w-5 animate-spin mx-auto" />
                    ) : (
                      'Book Grooming'
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Grooming;