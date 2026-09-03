// src/pages/ServiceDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import {
  Clock,
  DollarSign,
  Calendar,
  ArrowLeft,
  Stethoscope,
  Heart,
  Brain,
  Microscope,
  Scissors,
  Activity,
  CheckCircle,
  Phone,
  Mail,
  MapPin,
  Share2,
  Bookmark
} from 'lucide-react';

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedServices, setRelatedServices] = useState([]);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const categoryIcons = {
    general: Stethoscope,
    specialized: Heart,
    diagnostics: Microscope,
    emergency: Activity
  };

  const categoryColors = {
    general: 'bg-blue-100 text-blue-700',
    specialized: 'bg-purple-100 text-purple-700',
    diagnostics: 'bg-green-100 text-green-700',
    emergency: 'bg-red-100 text-red-700'
  };

  const categoryLabels = {
    general: 'General Care',
    specialized: 'Specialized Medicine',
    diagnostics: 'Diagnostics',
    emergency: 'Emergency'
  };

  useEffect(() => {
    fetchServiceDetails();
  }, [id]);

  const fetchServiceDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/services/${id}`);
      setService(response.data);
      
      // Fetch related services (same category)
      if (response.data.category) {
        const relatedResponse = await axios.get(`/api/services?category=${response.data.category}`);
        const filtered = relatedResponse.data.filter(s => s.id !== parseInt(id));
        setRelatedServices(filtered.slice(0, 3));
      }
    } catch (error) {
      console.error('Error fetching service details:', error);
      toast.error('Service not found');
      navigate('/services');
    } finally {
      setLoading(false);
    }
  };

  const handleBookAppointment = () => {
    if (!isAuthenticated) {
      toast.error('Please login to book an appointment');
      navigate('/login');
      return;
    }
    navigate('/appointments', { state: { serviceId: service.id } });
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast.success(isBookmarked ? 'Removed from bookmarks' : 'Added to bookmarks');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: service.name,
        text: service.description,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="container-custom py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Service not found</h2>
        <Link to="/services" className="text-primary-600 hover:underline mt-4 inline-block">
          Back to Services
        </Link>
      </div>
    );
  }

  const Icon = categoryIcons[service.category] || Stethoscope;

  return (
    <div className="py-8">
      <div className="container-custom">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-primary-600">Home</Link>
          <span>/</span>
          <Link to="/services" className="hover:text-primary-600">Services</Link>
          <span>/</span>
          <span className="text-gray-900">{service.name}</span>
        </nav>

        {/* Back Button */}
        <button
          onClick={() => navigate('/services')}
          className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Services</span>
        </button>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Service Info */}
          <div className="lg:col-span-2">
            <div className="card p-8">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg ${categoryColors[service.category] || 'bg-gray-100'}`}>
                    <Icon className="h-8 w-8" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{service.name}</h1>
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm px-3 py-1 rounded-full ${categoryColors[service.category] || 'bg-gray-100'}`}>
                        {categoryLabels[service.category] || service.category}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleBookmark}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    aria-label="Bookmark"
                  >
                    <Bookmark className={`h-5 w-5 ${isBookmarked ? 'fill-primary-600 text-primary-600' : 'text-gray-400'}`} />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    aria-label="Share"
                  >
                    <Share2 className="h-5 w-5 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Description */}
              <div className="prose max-w-none mb-8">
                <p className="text-gray-600 text-lg leading-relaxed">
                  {service.description}
                </p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <Clock className="h-6 w-6 text-primary-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="font-semibold">{service.duration_minutes} minutes</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <DollarSign className="h-6 w-6 text-primary-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Price</p>
                  <p className="font-semibold text-2xl text-primary-600">${service.price}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="font-semibold text-green-600">Available</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleBookAppointment}
                  className="btn-primary flex items-center space-x-2 px-8 py-3 text-lg"
                >
                  <Calendar className="h-5 w-5" />
                  <span>Book Appointment</span>
                </button>
                <Link
                  to="/services"
                  className="btn-secondary flex items-center space-x-2 px-8 py-3 text-lg"
                >
                  <span>Browse All Services</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="card p-6">
              <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Phone className="h-5 w-5 text-primary-600 mt-1" />
                  <div>
                    <p className="text-sm font-medium">Emergency Hotline</p>
                    <p className="text-sm text-gray-600">+961 123 4567</p>
                    <p className="text-xs text-red-500">24/7 Available</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-primary-600 mt-1" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-gray-600">info@animalhousehospital.com</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-primary-600 mt-1" />
                  <div>
                    <p className="text-sm font-medium">Location</p>
                    <p className="text-sm text-gray-600">Zalka Highway, Lebanon</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Related Services */}
            {relatedServices.length > 0 && (
              <div className="card p-6">
                <h3 className="font-semibold text-lg mb-4">Related Services</h3>
                <div className="space-y-3">
                  {relatedServices.map((related) => (
                    <Link
                      key={related.id}
                      to={`/services/${related.id}`}
                      className="block p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
                    >
                      <p className="font-medium text-sm">{related.name}</p>
                      <p className="text-xs text-gray-500">${related.price}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Stats */}
            <div className="card p-6 bg-primary-50 border-primary-200">
              <h3 className="font-semibold text-lg mb-3 text-primary-800">Why Choose Us?</h3>
              <ul className="space-y-2 text-sm text-primary-700">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>State-of-the-art equipment</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>Experienced veterinary team</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>Compassionate care</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>24/7 emergency support</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Additional Information Section */}
        <div className="mt-12">
          <div className="card p-8">
            <h2 className="text-2xl font-bold mb-4">What to Expect</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-primary-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary-600 font-bold text-xl">1</span>
                </div>
                <h4 className="font-semibold mb-2">Consultation</h4>
                <p className="text-sm text-gray-600">
                  Our veterinarians will thoroughly examine your pet and discuss the best treatment options.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-primary-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary-600 font-bold text-xl">2</span>
                </div>
                <h4 className="font-semibold mb-2">Treatment</h4>
                <p className="text-sm text-gray-600">
                  We provide expert care using state-of-the-art equipment and techniques.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-primary-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary-600 font-bold text-xl">3</span>
                </div>
                <h4 className="font-semibold mb-2">Follow-up</h4>
                <p className="text-sm text-gray-600">
                  We ensure your pet's recovery with comprehensive follow-up care and support.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;