// src/pages/Shop.jsx
import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import { 
  Search, 
  Filter, 
  ShoppingCart,
  ChevronDown,
  Dog,
  Cat
} from 'lucide-react';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const { addToCart } = useCart();

  const categories = [
    { value: 'all', label: 'All Products' },
    { value: 'dog', label: 'Dogs', icon: Dog },
    { value: 'cat', label: 'Cats', icon: Cat }
  ];

  const subcategories = {
    dog: ['food', 'toys', 'supplements', 'accessories'],
    cat: ['food', 'toys', 'supplements', 'accessories']
  };

  useEffect(() => {
    fetchProducts();
  }, [category, search, pagination.page]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: 12
      };
      if (category !== 'all') params.category = category;
      if (search) params.search = search;

      const response = await axios.get('/api/products', { params });
      setProducts(response.data.products);
      setPagination(prev => ({
        ...prev,
        totalPages: response.data.pagination.totalPages
      }));
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Pet Shop</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Premium products for your furry friends - food, toys, supplements, and accessories
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors flex items-center space-x-2 ${
                    category === cat.value
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="card overflow-hidden">
              <div className="p-4">
                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <ShoppingCart className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary-600">
                    ${product.price}
                  </span>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="btn-primary text-sm flex items-center space-x-1"
                    disabled={product.stock_quantity === 0}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span>{product.stock_quantity > 0 ? 'Add' : 'Out of Stock'}</span>
                  </button>
                </div>
                {product.stock_quantity < 10 && product.stock_quantity > 0 && (
                  <p className="text-xs text-orange-600 mt-1">
                    Only {product.stock_quantity} left
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No products found.</p>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              disabled={pagination.page === 1}
              className="px-4 py-2 rounded-lg border disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              disabled={pagination.page === pagination.totalPages}
              className="px-4 py-2 rounded-lg border disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;