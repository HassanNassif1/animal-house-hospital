// src/pages/Adoption.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  Heart,
  PawPrint,
  Dog,
  Cat,
  MapPin,
  Calendar,
  Phone,
  Mail,
  Search,
  Filter,
  Star,
  CheckCircle,
  Award,
  Loader,
  User,
  Home
} from 'lucide-react';

const Adoption = () => {
  const { isAuthenticated, user } = useAuth();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      setLoading(true);
      // In a real app, you'd have an adoption endpoint
      // For now, we'll fetch all pets and filter for adoption
      const response = await axios.get('/api/pets');
      // Add adoption status to pets (in a real app, this would come from the database)
      const petsWithAdoption = response.data.map(pet => ({
        ...pet,
        adoptionStatus: Math.random() > 0.3 ? 'available' : 'adopted',
        adoptionDescription: `Looking for a loving home. ${pet.name} is a ${pet.age || 'young'} ${pet.type} who loves to play and cuddle.`,
        adoptionContact: 'adoption@animalhousehospital.com'
      }));
      setPets(petsWithAdoption);
    } catch (error) {
      console.error('Error fetching pets:', error);
      // Fallback data if API fails
      setPets([
        {
          id: 1,
          name: 'Max',
          type: 'dog',
          breed: 'Golden Retriever',
          age: 2,
          gender: 'Male',
          adoptionStatus: 'available',
          adoptionDescription: 'Friendly and energetic dog looking for an active family.',
          adoptionContact: 'adoption@animalhousehospital.com'
        },
        {
          id: 2,
          name: 'Luna',
          type: 'cat',
          breed: 'Siamese',
          age: 1,
          gender: 'Female',
          adoptionStatus: 'available',
          adoptionDescription: 'Affectionate cat who loves to cuddle and play.',
          adoptionContact: 'adoption@animalhousehospital.com'
        },
        {
          id: 3,
          name: 'Charlie',
          type: 'dog',
          breed: 'Beagle',
          age: 3,
          gender: 'Male',
          adoptionStatus: 'adopted',
          adoptionDescription: 'Playful and loyal companion great with kids.',
          adoptionContact: 'adoption@animalhousehospital.com'
        },
        {
          id: 4,
          name: 'Milo',
          type: 'cat',
          breed: 'Persian',
          age: 4,
          gender: 'Male',
          adoptionStatus: 'available',
          adoptionDescription: 'Calm and independent cat who enjoys quiet environments.',
          adoptionContact: 'adoption@animalhousehospital.com'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdopt = async (pet) => {
    if (!isAuthenticated) {
      toast.error('Please login to start the adoption process');
      return;
    }

    setSubmitting(true);
    try {
      // In a real app, you'd send an adoption request to the backend
      // For now, we'll simulate it
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Send email notification (simulated)
      await axios.post('/api/adoption/request', {
        petId: pet.id,
        userId: user.id,
        message: `I would like to adopt ${pet.name}`
      });
      
      toast.success(`Adoption request sent for ${pet.name}! We will contact you shortly.`);
      // Update pet status locally
      setPets(pets.map(p => 
        p.id === pet.id ? { ...p, adoptionStatus: 'pending' } : p
      ));
    } catch (error) {
      toast.error('Failed to submit adoption request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredPets = pets.filter(pet => {
    const matchesType = filter === 'all' || pet.type === filter;
    const matchesSearch = pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pet.breed.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch && pet.adoptionStatus === 'available';
  });

  const stats = [
    { icon: PawPrint, label: 'Available Pets', value: pets.filter(p => p.adoptionStatus === 'available').length },
    { icon: Heart, label: 'Adopted', value: pets.filter(p => p.adoptionStatus === 'adopted').length },
    { icon: Award, label: 'Years of Service', value: '10+' }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader className="h-12 w-12 animate-spin text-pink-600" />
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="container-custom">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-pink-600 to-pink-800 rounded-2xl text-white p-8 mb-12">
          <div className="flex items-center space-x-4 mb-4">
            <Heart className="h-12 w-12" />
            <h1 className="text-3xl md:text-4xl font-bold">Adopt a Pet</h1>
          </div>
          <p className="text-pink-100 text-lg max-w-2xl">
            Give a loving home to a pet in need. Our adoption program connects 
            wonderful animals with caring families.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="card p-6 text-center">
                <Icon className="h-10 w-10 text-pink-600 mx-auto mb-2" />
                <div className="text-3xl font-bold text-pink-600">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by name or breed..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'all' ? 'bg-pink-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('dog')}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-1 ${
                filter === 'dog' ? 'bg-pink-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <Dog className="h-4 w-4" />
              <span>Dogs</span>
            </button>
            <button
              onClick={() => setFilter('cat')}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-1 ${
                filter === 'cat' ? 'bg-pink-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <Cat className="h-4 w-4" />
              <span>Cats</span>
            </button>
          </div>
        </div>

        {/* Pets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPets.map((pet) => (
            <div key={pet.id} className="card overflow-hidden">
              <div className="relative">
                <div className="bg-gray-100 h-48 flex items-center justify-center text-6xl">
                  {pet.type === 'dog' ? '🐕' : '🐱'}
                </div>
                {pet.adoptionStatus === 'adopted' && (
                  <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm">
                    Adopted
                  </div>
                )}
                {pet.adoptionStatus === 'pending' && (
                  <div className="absolute top-4 right-4 bg-yellow-600 text-white px-3 py-1 rounded-full text-sm">
                    Pending
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-xl font-bold">{pet.name}</h3>
                    <p className="text-sm text-gray-600">{pet.breed}</p>
                  </div>
                  <span className="text-2xl">
                    {pet.type === 'dog' ? '🐕' : '🐱'}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>{pet.age} years</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>{pet.gender}</span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4">{pet.adoptionDescription}</p>
                <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
                  <Mail className="h-4 w-4" />
                  <span>{pet.adoptionContact}</span>
                </div>
                <button
                  onClick={() => handleAdopt(pet)}
                  disabled={pet.adoptionStatus !== 'available' || submitting}
                  className={`w-full py-2 rounded-lg transition-colors ${
                    pet.adoptionStatus === 'available'
                      ? 'bg-pink-600 text-white hover:bg-pink-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {submitting ? (
                    <Loader className="h-5 w-5 animate-spin mx-auto" />
                  ) : pet.adoptionStatus === 'available' ? (
                    'Apply to Adopt'
                  ) : pet.adoptionStatus === 'pending' ? (
                    'Pending Approval'
                  ) : (
                    'Already Adopted'
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredPets.length === 0 && (
          <div className="text-center py-12">
            <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No pets found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}

        {/* Adoption Process */}
        <div className="card p-8 mt-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Adoption Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-pink-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <span className="text-pink-600 font-bold text-xl">1</span>
              </div>
              <h4 className="font-semibold">Browse</h4>
              <p className="text-sm text-gray-600">Find your perfect companion</p>
            </div>
            <div className="text-center">
              <div className="bg-pink-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <span className="text-pink-600 font-bold text-xl">2</span>
              </div>
              <h4 className="font-semibold">Apply</h4>
              <p className="text-sm text-gray-600">Submit adoption application</p>
            </div>
            <div className="text-center">
              <div className="bg-pink-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <span className="text-pink-600 font-bold text-xl">3</span>
              </div>
              <h4 className="font-semibold">Meet</h4>
              <p className="text-sm text-gray-600">Meet your potential pet</p>
            </div>
            <div className="text-center">
              <div className="bg-pink-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <span className="text-pink-600 font-bold text-xl">4</span>
              </div>
              <h4 className="font-semibold">Adopt</h4>
              <p className="text-sm text-gray-600">Welcome your new family member</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Adoption;