// src/pages/MobileVisit.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Truck,
  MapPin,
  Calendar,
  Clock,
  Phone,
  Mail,
  Stethoscope,
  CheckCircle,
  Users,
  Award,
  Loader,
  User,
  Home
} from 'lucide-react';

const MobileVisit = () => {
  const { isAuthenticated, user, api } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [pets, setPets] = useState([]);
  const [fetchingData, setFetchingData] = useState(true);
  
  const [formData, setFormData] = useState({
    petId: '',
    reason: '',
    address: user?.address || '',
    city: '',
    preferredDate: '',
    preferredTime: '',
    phone: user?.phone || '',
    notes: ''
  });

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      setFetchingData(true);
      if (isAuthenticated) {
        const response = await api.get('/pets');
        setPets(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching pets:', error);
      if (error.response?.status === 401) {
        toast.error('Please login to view your pets');
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
      toast.error('Please login to request a mobile visit');
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      // Create appointment for mobile visit
      await api.post('/appointments', {
        petId: parseInt(formData.petId),
        serviceId: null,
        appointmentDate: formData.preferredDate,
        appointmentTime: formData.preferredTime,
        appointmentType: 'mobile',
        notes: `${formData.notes}\nReason: ${formData.reason}\nAddress: ${formData.address}, ${formData.city}`
      });

      toast.success('Mobile visit request submitted! We will contact you to confirm.');
      setFormData({
        petId: '',
        reason: '',
        address: user?.address || '',
        city: '',
        preferredDate: '',
        preferredTime: '',
        phone: user?.phone || '',
        notes: ''
      });
      navigate('/bookings');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit mobile visit request');
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    { icon: Truck, title: 'Convenience', description: 'We come to your home' },
    { icon: Stethoscope, title: 'Full Service', description: 'Complete veterinary care' },
    { icon: Users, title: 'Stress-Free', description: 'Comfortable environment for pets' },
    { icon: Award, title: 'Expert Team', description: 'Professional veterinarians' }
  ];

  if (fetchingData) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader className="h-12 w-12 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="container-custom">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-2xl text-white p-8 mb-12">
          <div className="flex items-center space-x-4 mb-4">
            <Truck className="h-12 w-12" />
            <h1 className="text-3xl md:text-4xl font-bold">Mobile Vet Service</h1>
          </div>
          <p className="text-green-100 text-lg max-w-2xl">
            Professional veterinary care delivered to your doorstep. Our mobile service 
            provides convenient, stress-free healthcare for your pets at home.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Benefits */}
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-2 gap-4">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div key={index} className="card p-4 text-center">
                    <Icon className="h-10 w-10 text-green-600 mx-auto mb-2" />
                    <h3 className="font-semibold">{benefit.title}</h3>
                    <p className="text-sm text-gray-600">{benefit.description}</p>
                  </div>
                );
              })}
            </div>

            {/* Service Areas */}
            <div className="card p-6">
              <h2 className="text-2xl font-bold mb-4">Service Areas</h2>
              <p className="text-gray-600 mb-4">
                We provide mobile veterinary services in the following areas:
              </p>
              <div className="flex flex-wrap gap-2">
                {['Zalka', 'Beirut', 'Jounieh', 'Byblos', 'Tripoli', 'Sidon', 'Tyre'].map((area) => (
                  <span key={area} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    {area}
                  </span>
                ))}
              </div>
            </div>

            {/* What We Offer */}
            <div className="card p-6">
              <h2 className="text-2xl font-bold mb-4">What We Offer</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  'Wellness Exams',
                  'Vaccinations',
                  'Diagnostics',
                  'Lab Tests',
                  'Emergency Care',
                  'Follow-up Visits'
                ].map((service) => (
                  <div key={service} className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>{service}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Request Form */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h2 className="text-2xl font-bold mb-4">Request a Visit</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Pet
                  </label>
                  <select
                    name="petId"
                    value={formData.petId}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                    Reason for Visit
                  </label>
                  <select
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select reason</option>
                    <option value="wellness">Wellness Exam</option>
                    <option value="sick">Sick Visit</option>
                    <option value="vaccination">Vaccination</option>
                    <option value="followup">Follow-up</option>
                    <option value="emergency">Emergency</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    name="preferredDate"
                    value={formData.preferredDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preferred Time
                  </label>
                  <input
                    type="time"
                    name="preferredTime"
                    value={formData.preferredTime}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="2"
                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Any special instructions..."
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={loading || !isAuthenticated}
                  className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Request Mobile Visit'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileVisit;