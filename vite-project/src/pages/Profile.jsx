// src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  User,
  Mail,
  Phone,
  MapPin,
  PawPrint,
  Edit,
  Save,
  X,
  Calendar,
  Heart,
  ShoppingBag
} from 'lucide-react';

const Profile = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pets, setPets] = useState([]);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }
    fetchPets();
  }, [isAuthenticated, user]);

  const fetchPets = async () => {
    try {
      const response = await axios.get('/api/pets');
      setPets(response.data);
    } catch (error) {
      console.error('Error fetching pets:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put('/api/users/profile', formData);
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="py-8">
      <div className="container-custom max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-2">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Personal Information</h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-primary-600 hover:text-primary-700 flex items-center space-x-1"
                >
                  {isEditing ? (
                    <>
                      <X className="h-5 w-5" />
                      <span>Cancel</span>
                    </>
                  ) : (
                    <>
                      <Edit className="h-5 w-5" />
                      <span>Edit</span>
                    </>
                  )}
                </button>
              </div>

              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
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
                      className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary flex items-center space-x-2 disabled:opacity-50"
                  >
                    <Save className="h-5 w-5" />
                    <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-gray-700">
                    <User className="h-5 w-5 text-gray-400" />
                    <span>{user?.fullName}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-700">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <span>{user?.email}</span>
                  </div>
                  {user?.phone && (
                    <div className="flex items-center space-x-3 text-gray-700">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <span>{user.phone}</span>
                    </div>
                  )}
                  {user?.address && (
                    <div className="flex items-center space-x-3 text-gray-700">
                      <MapPin className="h-5 w-5 text-gray-400" />
                      <span>{user.address}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* My Pets */}
            <div className="card p-6 mt-6">
              <h2 className="text-xl font-bold mb-4">My Pets</h2>
              {pets.length === 0 ? (
                <p className="text-gray-500">No pets registered yet.</p>
              ) : (
                <div className="space-y-3">
                  {pets.map((pet) => (
                    <div key={pet.id} className="flex items-center justify-between border-b pb-3">
                      <div className="flex items-center space-x-3">
                        <PawPrint className="h-6 w-6 text-primary-600" />
                        <div>
                          <p className="font-medium">{pet.name}</p>
                          <p className="text-sm text-gray-500">{pet.type} • {pet.breed}</p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">{pet.age} years</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-6">
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/appointments')}
                  className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
                >
                  <Calendar className="h-5 w-5 text-primary-600" />
                  <span>Book Appointment</span>
                </button>
                <button
                  onClick={() => navigate('/bookings')}
                  className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
                >
                  <Heart className="h-5 w-5 text-primary-600" />
                  <span>My Bookings</span>
                </button>
                <button
                  onClick={() => navigate('/shop')}
                  className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
                >
                  <ShoppingBag className="h-5 w-5 text-primary-600" />
                  <span>Shop Now</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;