// src/config/constants.js
export const APP_CONFIG = {
  name: 'Animal House Hospital',
  foundedYear: 1974,
  emergencyHotline: '+961 123 4567',
  email: 'info@animalhousehospital.com',
  address: 'Zalka Highway, Lebanon',
  socialMedia: {
    facebook: '#',
    twitter: '#',
    instagram: '#',
    youtube: '#'
  },
  serviceAreas: ['Zalka', 'Beirut', 'Jounieh', 'Byblos', 'Tripoli', 'Sidon', 'Tyre'],
  currency: 'USD',
  taxRate: 0.10,
  freeShippingThreshold: 50,
  shippingRate: 5.99
};

export const SERVICE_CATEGORIES = [
  { value: 'all', label: 'All Services' },
  { value: 'general', label: 'General Care' },
  { value: 'specialized', label: 'Specialized Medicine' },
  { value: 'diagnostics', label: 'Diagnostics & Emergency' },
  { value: 'grooming', label: 'Grooming' }
];

export const PRODUCT_CATEGORIES = [
  { value: 'all', label: 'All Products' },
  { value: 'dog', label: 'Dogs' },
  { value: 'cat', label: 'Cats' }
];

export const APPOINTMENT_TYPES = [
  { value: 'veterinary', label: 'Veterinary Visit' },
  { value: 'grooming', label: 'Grooming' },
  { value: 'mobile', label: 'Mobile Visit' }
];

export const BOOKING_STATUSES = [
  'pending',
  'confirmed',
  'completed',
  'cancelled'
];