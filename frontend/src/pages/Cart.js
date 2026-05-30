import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Cart.css';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const shipping = cartTotal > 500 ? 0 : (cartTotal > 0 ? 50 : 0);
  const tax = +(cartTotal * 0.18).toFixed(2);
  const total = +(cartTotal + shipping + tax).toFixed(2);

  const handleCheckout = () => {
    if (!user) { navigate('/login?redirect=checkout'); return; }
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty page-enter">
        <div className="container">
          <div className="empty-cart-box">
            <div className="empty-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Discover amazing products and add them to your cart.</p>
            <Link to="/products" className="btn btn-primary btn-lg">Start Shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page page-enter">
      <div className="container">
        <div className="cart-header">
          <h1>Shopping Cart</h1>
          <span className="cart-count-label">{cartCount} item{cartCount !== 1 ? 's' : ''}</span>
        </div>

        <div className="cart-layout">
          {/* Items */}
          <div className="cart-items">
            <div className="cart-items-header">
              <button className="btn btn-ghost btn-sm" onClick={clearCart}>Clear All</button>
            </div>
            {cartItems.map(item => (
              <div key={item._id} className="cart-item card">
                <img src={item.image} alt={item.name} className="cart-item-img" />
                <div className="cart-item-info">
                  <Link to={`/products/${item._id}`} className="cart-item-name">{item.name}</Link>
                  <span className="cart-item-category">{item.category}</span>
                  <div className="cart-item-price-row">
                    <span className="cart-item-price">₹{item.price.toLocaleString('en-IN')}</span>
                    <div className="qty-controls compact">
                      <button className="qty-btn" onClick={() => updateQuantity(item._id, item.quantity - 1)}>−</button>
                      <span className="qty-display">{item.quantity}</span>
                      <button className="qty-btn" onClick={() => updateQuantity(item._id, Math.min(item.stock, item.quantity + 1))}>+</button>
                    </div>
                    <span className="cart-item-subtotal">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                    <button className="remove-btn" onClick={() => removeFromCart(item._id)} title="Remove">✕</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="cart-summary card">
            <h2>Order Summary</h2>
            <div className="summary-rows">
              <div className="summary-row">
                <span>Subtotal ({cartCount} items)</span>
                <span>₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>{shipping === 0 ? <span className="free-tag">FREE</span> : `₹${shipping}`}</span>
              </div>
              <div className="summary-row">
                <span>Tax (18% GST)</span>
                <span>₹{tax.toLocaleString('en-IN')}</span>
              </div>
            </div>
            {cartTotal < 500 && cartTotal > 0 && (
              <p className="free-shipping-hint">Add ₹{(500 - cartTotal).toFixed(0)} more for free shipping!</p>
            )}
            <div className="summary-total">
              <span>Total</span>
              <span>₹{total.toLocaleString('en-IN')}</span>
            </div>
            <button className="btn btn-primary btn-lg" style={{width:'100%'}} onClick={handleCheckout}>
              Proceed to Checkout
            </button>
            <Link to="/products" className="btn btn-ghost btn-sm" style={{width:'100%', marginTop:'0.5rem', textAlign:'center'}}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;