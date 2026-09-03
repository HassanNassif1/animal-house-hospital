// src/pages/Bookings.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import {
  Calendar,
  Clock,
  PawPrint,
  Stethoscope,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
  Trash2,
  Edit,
  Plus,
  Loader
} from 'lucide-react';

const Bookings = () => {
  const { user, isAuthenticated, api } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (isAuthenticated) {
      fetchBookings();
    }
  }, [isAuthenticated]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/appointments');
      setBookings(response.data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;
    
    try {
      await api.delete(`/appointments/${id}`);
      toast.success('Appointment cancelled successfully');
      fetchBookings();
    } catch (error) {
      toast.error('Failed to cancel appointment');
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: ClockIcon },
      confirmed: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
      completed: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      cancelled: { color: 'bg-red-100 text-red-800', icon: XCircle }
    };
    const { color, icon: Icon } = statusMap[status] || statusMap.pending;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
        <Icon className="h-3 w-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const filteredBookings = bookings.filter(booking => 
    filter === 'all' || booking.status === filter
  );

  if (!isAuthenticated) {
    return (
      <div className="py-16">
        <div className="container-custom text-center">
          <h2 className="text-2xl font-bold mb-4">Please Login</h2>
          <p className="text-gray-600 mb-8">You need to be logged in to view your bookings.</p>
          <Link to="/login" className="btn-primary">Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Bookings</h1>
            <p className="text-gray-600">Manage your appointments and reservations</p>
          </div>
          <Link to="/appointments" className="btn-primary flex items-center space-x-2 mt-4 sm:mt-0">
            <Plus className="h-5 w-5" />
            <span>Book New</span>
          </Link>
        </div>

        {/* Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                filter === status
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <Loader className="h-12 w-12 animate-spin text-primary-600" />
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-500">You don't have any {filter !== 'all' ? filter : ''} appointments.</p>
            <Link to="/appointments" className="text-primary-600 hover:underline mt-4 inline-block">
              Book an appointment
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div key={booking.id} className="card p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">
                          {booking.service_name || 'Veterinary Appointment'}
                        </h3>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                          <span className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(booking.appointment_date).toLocaleDateString()}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{booking.appointment_time}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <PawPrint className="h-4 w-4" />
                            <span>{booking.pet_name || 'No pet selected'}</span>
                          </span>
                        </div>
                      </div>
                      {getStatusBadge(booking.status)}
                    </div>
                    {booking.notes && (
                      <p className="text-sm text-gray-500 mt-2">{booking.notes}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {booking.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleCancel(booking.id)}
                          className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookings;