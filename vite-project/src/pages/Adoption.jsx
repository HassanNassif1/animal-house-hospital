// src/pages/Adoption.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import {
  Heart,
  PawPrint,
  Dog,
  Cat,
  Calendar,
  Mail,
  Clock,
  Search,
  Award,
  Loader,
  User,
  CheckCircle
} from 'lucide-react';


const Adoption = () => {
  const { isAuthenticated, user, api } = useAuth();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [stats, setStats] = useState({
    available: 0,
    adopted: 0,
    total: 0
  });

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      setLoading(true);
      // Fetch adoption pets from the adoption endpoint
      const response = await api.get('/adoption/pets');
      
      if (response.data && response.data.length > 0) {
        // Map the pets data with adoption status from database
        const petsWithAdoption = response.data.map(pet => ({
          id: pet.id,
          name: pet.name,
          type: pet.type,
          breed: pet.breed || 'Unknown',
          age: pet.age || 0,
          gender: pet.gender || 'Unknown',
          weight: pet.weight,
          medical_notes: pet.medical_notes,
          // Use database fields if they exist, otherwise set defaults
          adoptionStatus: pet.adoption_status || 'available',
          adoptionDescription: pet.adoption_description || `Looking for a loving home. ${pet.name} is a ${pet.age || 'young'} ${pet.type} who loves to play and cuddle.`,
          adoptionContact: pet.adoption_contact || 'adoption@animalhousehospital.com',
          created_at: pet.created_at
        }));
        setPets(petsWithAdoption);
        
        // Calculate stats
        const available = petsWithAdoption.filter(p => p.adoptionStatus === 'available').length;
        const adopted = petsWithAdoption.filter(p => p.adoptionStatus === 'adopted').length;
        const pending = petsWithAdoption.filter(p => p.adoptionStatus === 'pending').length;
        setStats({
          available,
          adopted,
          pending,
          total: petsWithAdoption.length
        });
      } else {
        // If no pets in database, show empty state
        setPets([]);
        setStats({
          available: 0,
          adopted: 0,
          pending: 0,
          total: 0
        });
      }
    } catch (error) {
      console.error('Error fetching pets:', error);
      toast.error('Failed to load pets. Please try again.');
      setPets([]);
      setStats({
        available: 0,
        adopted: 0,
        pending: 0,
        total: 0
      });
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
      // Send adoption request to backend
      await api.post('/adoption/request', {
        petId: pet.id,
        message: `I would like to adopt ${pet.name}`
      });
      
      toast.success(`Adoption request sent for ${pet.name}! We will contact you shortly.`);
      
      // Update pet status locally
      setPets(pets.map(p => 
        p.id === pet.id ? { ...p, adoptionStatus: 'pending' } : p
      ));
      
      // Update stats
      setStats(prev => ({
        ...prev,
        available: prev.available - 1,
        pending: (prev.pending || 0) + 1
      }));
      
    } catch (error) {
      console.error('Adoption request error:', error);
      toast.error(error.response?.data?.message || 'Failed to submit adoption request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredPets = pets.filter(pet => {
    const matchesType = filter === 'all' || pet.type === filter;
    const matchesSearch = pet.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pet.breed?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch && pet.adoptionStatus === 'available';
  });

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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="card p-6 text-center">
            <PawPrint className="h-10 w-10 text-pink-600 mx-auto mb-2" />
            <div className="text-3xl font-bold text-pink-600">{stats.available || 0}</div>
            <div className="text-gray-600">Available Pets</div>
          </div>
          <div className="card p-6 text-center">
            <Heart className="h-10 w-10 text-pink-600 mx-auto mb-2" />
            <div className="text-3xl font-bold text-pink-600">{stats.adopted || 0}</div>
            <div className="text-gray-600">Adopted</div>
          </div>
          <div className="card p-6 text-center">
            <Clock className="h-10 w-10 text-yellow-600 mx-auto mb-2" />
            <div className="text-3xl font-bold text-yellow-600">{stats.pending || 0}</div>
            <div className="text-gray-600">Pending</div>
          </div>
          <div className="card p-6 text-center">
            <Award className="h-10 w-10 text-pink-600 mx-auto mb-2" />
            <div className="text-3xl font-bold text-pink-600">{stats.total || 0}</div>
            <div className="text-gray-600">Total Pets</div>
          </div>
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
        {filteredPets.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No pets available for adoption</h3>
            <p className="text-gray-500">Check back soon! New pets are added regularly.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPets.map((pet) => (
              <div key={pet.id} className="card overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative">
                  <div className="bg-gray-100 h-48 flex items-center justify-center text-6xl">
                    {pet.type === 'dog' ? '🐕' : pet.type === 'cat' ? '🐱' : '🐾'}
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
                      {pet.type === 'dog' ? '🐕' : pet.type === 'cat' ? '🐱' : '🐾'}
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
                    {pet.weight && (
                      <div className="flex items-center space-x-2">
                        <span>⚖️</span>
                        <span>{pet.weight} kg</span>
                      </div>
                    )}
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