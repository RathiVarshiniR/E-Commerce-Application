import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { createOrder } from '../services/api';
import toast from 'react-hot-toast';
import './Checkout.css';

const PAYMENT_METHODS = ['Cash on Delivery', 'Credit Card', 'Debit Card', 'PayPal'];

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    street: '', city: '', state: '', zipCode: '', country: 'India',
    paymentMethod: 'Cash on Delivery', notes: '',
  });

  const shipping = cartTotal > 500 ? 0 : 50;
  const tax = +(cartTotal * 0.18).toFixed(2);
  const total = +(cartTotal + shipping + tax).toFixed(2);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return toast.error('Cart is empty');

    setLoading(true);
    try {
      const orderData = {
        items: cartItems.map(i => ({ product: i._id, quantity: i.quantity })),
        shippingAddress: { street: form.street, city: form.city, state: form.state, zipCode: form.zipCode, country: form.country },
        paymentMethod: form.paymentMethod,
        notes: form.notes,
      };
      const { data } = await createOrder(orderData);
      clearCart();
      toast.success('Order placed successfully! 🎉');
      navigate(`/orders/${data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page page-enter">
      <div className="container">
        <h1 className="checkout-title">Checkout</h1>
        <form onSubmit={handleSubmit}>
          <div className="checkout-layout">
            {/* Form */}
            <div className="checkout-form-section">
              <div className="checkout-card card">
                <h2>Shipping Address</h2>
                <div className="form-group">
                  <label className="form-label">Street Address</label>
                  <input name="street" value={form.street} onChange={handleChange} className="input-field" placeholder="123 Main Street, Apt 4B" required />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input name="city" value={form.city} onChange={handleChange} className="input-field" placeholder="Chennai" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">State</label>
                    <input name="state" value={form.state} onChange={handleChange} className="input-field" placeholder="Tamil Nadu" required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">ZIP Code</label>
                    <input name="zipCode" value={form.zipCode} onChange={handleChange} className="input-field" placeholder="600001" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Country</label>
                    <input name="country" value={form.country} onChange={handleChange} className="input-field" placeholder="India" required />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Order Notes (Optional)</label>
                  <textarea name="notes" value={form.notes} onChange={handleChange} className="input-field" rows={3} placeholder="Any special instructions..." />
                </div>
              </div>

              <div className="checkout-card card">
                <h2>Payment Method</h2>
                <div className="payment-options">
                  {PAYMENT_METHODS.map(method => (
                    <label key={method} className={`payment-option ${form.paymentMethod === method ? 'selected' : ''}`}>
                      <input type="radio" name="paymentMethod" value={method} checked={form.paymentMethod === method} onChange={handleChange} />
                      <span>{method}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="checkout-summary">
              <div className="card" style={{padding:'1.5rem'}}>
                <h2 style={{marginBottom:'1.25rem'}}>Order Summary</h2>
                <div className="order-items-list">
                  {cartItems.map(item => (
                    <div key={item._id} className="order-item-row">
                      <img src={item.image} alt={item.name} className="order-item-img" />
                      <div className="order-item-details">
                        <p className="order-item-name">{item.name}</p>
                        <p className="order-item-qty">Qty: {item.quantity}</p>
                      </div>
                      <span className="order-item-price">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
                <hr style={{border:'none', borderTop:'1px solid var(--border)', margin:'1rem 0'}} />
                <div className="summary-rows">
                  <div className="summary-row"><span>Subtotal</span><span>₹{cartTotal.toLocaleString('en-IN')}</span></div>
                  <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
                  <div className="summary-row"><span>GST (18%)</span><span>₹{tax}</span></div>
                </div>
                <div className="summary-total" style={{marginTop:'1rem'}}>
                  <span>Total</span><span>₹{total.toLocaleString('en-IN')}</span>
                </div>
                <button type="submit" className="btn btn-primary btn-lg" style={{width:'100%', marginTop:'1.25rem'}} disabled={loading}>
                  {loading ? 'Placing Order...' : `Place Order • ₹${total.toLocaleString('en-IN')}`}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;