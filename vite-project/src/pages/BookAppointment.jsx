// src/pages/BookAppointment.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Calendar, Clock, User, PawPrint, Stethoscope, Plus, Loader } from 'lucide-react';

const BookAppointment = () => {
  const { user, isAuthenticated, api } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);
  const [pets, setPets] = useState([]);
  const [showPetForm, setShowPetForm] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  
  const [formData, setFormData] = useState({
    petId: '',
    serviceId: '',
    appointmentDate: '',
    appointmentTime: '',
    appointmentType: 'veterinary',
    notes: ''
  });

  const [newPet, setNewPet] = useState({
    name: '',
    type: 'dog',
    breed: '',
    age: '',
    weight: '',
    medicalNotes: ''
  });

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to book an appointment');
      navigate('/login');
      return;
    }
    fetchData();
  }, [isAuthenticated]);

  const fetchData = async () => {
    try {
      setFetchingData(true);
      // Fetch services (public)
      const servicesRes = await api.get('/services');
      setServices(servicesRes.data || []);
      
      // Fetch pets (authenticated)
      const petsRes = await api.get('/pets');
      setPets(petsRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        navigate('/login');
      } else {
        toast.error('Failed to load data. Please refresh.');
      }
    } finally {
      setFetchingData(false);
    }
  };

  const handleAddPet = async () => {
    try {
      const response = await api.post('/pets', newPet);
      setPets([...pets, response.data]);
      setFormData({ ...formData, petId: response.data.id });
      setShowPetForm(false);
      setNewPet({ name: '', type: 'dog', breed: '', age: '', weight: '', medicalNotes: '' });
      toast.success('Pet added successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add pet');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/appointments', formData);
      toast.success('Appointment booked successfully!');
      navigate('/bookings');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePetChange = (e) => {
    setNewPet({ ...newPet, [e.target.name]: e.target.value });
  };

  if (fetchingData) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader className="h-12 w-12 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="container-custom max-w-3xl">
        <div className="card p-8">
          <h1 className="text-3xl font-bold mb-6">Book an Appointment</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Pet Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <PawPrint className="inline h-4 w-4 mr-2" />
                Select Pet
              </label>
              <div className="flex gap-2">
                <select
                  name="petId"
                  value={formData.petId}
                  onChange={handleChange}
                  className="flex-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                >
                  <option value="">Select a pet</option>
                  {pets.map((pet) => (
                    <option key={pet.id} value={pet.id}>
                      {pet.name} ({pet.type})
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowPetForm(!showPetForm)}
                  className="btn-primary flex items-center space-x-1"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Pet</span>
                </button>
              </div>
              {pets.length === 0 && (
                <p className="text-sm text-yellow-600 mt-2">
                  You don't have any pets registered. Add a pet first!
                </p>
              )}
            </div>

            {/* Add Pet Form */}
            {showPetForm && (
              <div className="bg-gray-50 p-4 rounded-lg space-y-3 border border-gray-200">
                <h3 className="font-semibold">Add New Pet</h3>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    name="name"
                    placeholder="Pet Name"
                    value={newPet.name}
                    onChange={handlePetChange}
                    className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                  <select
                    name="type"
                    value={newPet.type}
                    onChange={handlePetChange}
                    className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="dog">Dog</option>
                    <option value="cat">Cat</option>
                    <option value="other">Other</option>
                  </select>
                  <input
                    type="text"
                    name="breed"
                    placeholder="Breed"
                    value={newPet.breed}
                    onChange={handlePetChange}
                    className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <input
                    type="number"
                    name="age"
                    placeholder="Age"
                    value={newPet.age}
                    onChange={handlePetChange}
                    className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <input
                    type="number"
                    name="weight"
                    placeholder="Weight (kg)"
                    value={newPet.weight}
                    onChange={handlePetChange}
                    className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    name="medicalNotes"
                    placeholder="Medical Notes"
                    value={newPet.medicalNotes}
                    onChange={handlePetChange}
                    className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent col-span-2"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleAddPet}
                    className="btn-primary"
                  >
                    Save Pet
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPetForm(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Service Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Stethoscope className="inline h-4 w-4 mr-2" />
                Service
              </label>
              <select
                name="serviceId"
                value={formData.serviceId}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              >
                <option value="">Select a service</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name} - ${service.price} ({service.duration_minutes} min)
                  </option>
                ))}
              </select>
            </div>

            {/* Appointment Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Appointment Type
              </label>
              <select
                name="appointmentType"
                value={formData.appointmentType}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              >
                <option value="veterinary">Veterinary Visit</option>
                <option value="grooming">Grooming</option>
                <option value="mobile">Mobile Visit</option>
              </select>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline h-4 w-4 mr-2" />
                  Date
                </label>
                <input
                  type="date"
                  name="appointmentDate"
                  value={formData.appointmentDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="inline h-4 w-4 mr-2" />
                  Time
                </label>
                <input
                  type="time"
                  name="appointmentTime"
                  value={formData.appointmentTime}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Any special requests or information..."
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 text-lg flex items-center justify-center disabled:opacity-50"
            >
              {loading ? (
                <Loader className="h-5 w-5 animate-spin" />
              ) : (
                'Book Appointment'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;