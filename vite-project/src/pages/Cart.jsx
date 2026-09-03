// src/pages/Cart.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  CreditCard,
  Truck,
  Shield,
  AlertCircle,
  X
} from 'lucide-react';

const Cart = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice
  } = useCart();

  const [isProcessing, setIsProcessing] = useState(false);

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();
  const shipping = totalPrice > 50 ? 0 : 5.99;
  const tax = totalPrice * 0.10; // 10% tax
  const grandTotal = totalPrice + shipping + tax;

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error('Please login to checkout');
      navigate('/login');
      return;
    }
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    navigate('/checkout');
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="py-16">
        <div className="container-custom">
          <div className="text-center max-w-md mx-auto">
            <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added any items to your cart yet. 
              Browse our shop to find the perfect products for your pet.
            </p>
            <Link to="/shop" className="btn-primary inline-flex items-center space-x-2">
              <ArrowLeft className="h-5 w-5" />
              <span>Start Shopping</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="container-custom">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Shopping Cart</h1>
            <p className="text-gray-600">{totalItems} items in your cart</p>
          </div>
          <button
            onClick={clearCart}
            className="text-red-600 hover:text-red-700 flex items-center space-x-1 text-sm"
          >
            <Trash2 className="h-4 w-4" />
            <span>Clear Cart</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="card p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4"
                >
                  {/* Product Image */}
                  <div className="bg-gray-100 rounded-lg w-24 h-24 flex items-center justify-center flex-shrink-0">
                    <div className="text-gray-400 text-xs text-center">
                      <span className="block text-2xl">🐾</span>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <Link to={`/shop/${item.id}`} className="font-semibold hover:text-primary-600">
                      {item.name}
                    </Link>
                    <p className="text-sm text-gray-500 capitalize">{item.subcategory}</p>
                    <p className="text-lg font-bold text-primary-600">${item.price}</p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      className="p-1 rounded border hover:bg-gray-100 transition-colors"
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      className="p-1 rounded border hover:bg-gray-100 transition-colors"
                      disabled={item.quantity >= (item.stock_quantity || 10)}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Item Total & Remove */}
                  <div className="flex items-center space-x-4">
                    <span className="font-bold text-gray-800">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                      aria-label="Remove item"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Continue Shopping */}
            <Link
              to="/shop"
              className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 mt-6"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Continue Shopping</span>
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              
              <div className="space-y-3 border-b pb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                  <span className="font-medium">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (10%)</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-bold py-4 border-b">
                <span>Total</span>
                <span className="text-primary-600">${grandTotal.toFixed(2)}</span>
              </div>

              {/* Free Shipping Notice */}
              {totalPrice < 50 && (
                <div className="flex items-start space-x-2 text-sm text-orange-600 bg-orange-50 p-3 rounded-lg mt-4">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <span>
                    Add ${(50 - totalPrice).toFixed(2)} more to qualify for free shipping!
                  </span>
                </div>
              )}

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full btn-primary py-3 mt-4 flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5" />
                    <span>Proceed to Checkout</span>
                  </>
                )}
              </button>

              {/* Trust Badges */}
              <div className="mt-6 space-y-2">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span>Secure checkout</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Truck className="h-4 w-4 text-green-600" />
                  <span>Free shipping on orders over $50</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;