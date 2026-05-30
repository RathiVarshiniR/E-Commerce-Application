import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderById, cancelOrder } from '../services/api';
import toast from 'react-hot-toast';
import './OrderDetail.css';

const STATUS_STEPS = ['processing', 'confirmed', 'shipped', 'delivered'];
const STATUS_BADGE = { processing:'badge-warning', confirmed:'badge-info', shipped:'badge-info', delivered:'badge-success', cancelled:'badge-error' };

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrderById(id)
      .then(r => setOrder(r.data))
      .catch(() => { toast.error('Order not found'); navigate('/orders'); })
      .finally(() => setLoading(false));
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm('Cancel this order?')) return;
    try {
      await cancelOrder(id);
      toast.success('Order cancelled');
      setOrder(o => ({ ...o, orderStatus: 'cancelled' }));
    } catch (err) { toast.error(err.response?.data?.message || 'Cannot cancel'); }
  };

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;
  if (!order) return null;

  const stepIdx = STATUS_STEPS.indexOf(order.orderStatus);

  return (
    <div className="order-detail-page page-enter">
      <div className="container">
        <button className="back-btn" onClick={() => navigate('/orders')}>← Back to Orders</button>
        <div className="order-detail-header">
          <div>
            <h1>Order #{order._id.slice(-8).toUpperCase()}</h1>
            <p className="order-detail-date">Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {year:'numeric', month:'long', day:'numeric', hour:'2-digit', minute:'2-digit'})}</p>
          </div>
          <span className={`badge ${STATUS_BADGE[order.orderStatus] || 'badge-muted'}`} style={{fontSize:'0.9rem', padding:'0.4rem 1rem'}}>
            {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
          </span>
        </div>

        {/* Progress tracker */}
        {order.orderStatus !== 'cancelled' && (
          <div className="progress-tracker card">
            {STATUS_STEPS.map((step, i) => (
              <React.Fragment key={step}>
                <div className={`progress-step ${i <= stepIdx ? 'done' : ''} ${i === stepIdx ? 'current' : ''}`}>
                  <div className="step-circle">{i < stepIdx ? '✓' : i + 1}</div>
                  <span>{step.charAt(0).toUpperCase() + step.slice(1)}</span>
                </div>
                {i < STATUS_STEPS.length - 1 && <div className={`step-line ${i < stepIdx ? 'done' : ''}`} />}
              </React.Fragment>
            ))}
          </div>
        )}

        <div className="order-detail-grid">
          {/* Items */}
          <div>
            <div className="card" style={{padding:'1.5rem', marginBottom:'1.5rem'}}>
              <h2 style={{marginBottom:'1rem'}}>Items Ordered</h2>
              {order.items.map(item => (
                <div key={item._id} className="order-detail-item">
                  <img src={item.image} alt={item.name} />
                  <div className="item-info">
                    <p className="item-name">{item.name}</p>
                    <p className="item-qty">Quantity: {item.quantity}</p>
                  </div>
                  <div className="item-prices">
                    <p className="item-unit">₹{item.price.toLocaleString('en-IN')} each</p>
                    <p className="item-total">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Shipping address */}
            <div className="card" style={{padding:'1.5rem'}}>
              <h2 style={{marginBottom:'0.75rem'}}>Shipping Address</h2>
              <p className="address-text">{order.shippingAddress.street},</p>
              <p className="address-text">{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zipCode}</p>
              <p className="address-text">{order.shippingAddress.country}</p>
            </div>
          </div>

          {/* Summary */}
          <div className="card" style={{padding:'1.5rem', alignSelf:'start'}}>
            <h2 style={{marginBottom:'1.25rem'}}>Payment Summary</h2>
            <div className="summary-rows">
              <div className="summary-row"><span>Subtotal</span><span>₹{order.subtotal.toLocaleString('en-IN')}</span></div>
              <div className="summary-row"><span>Shipping</span><span>{order.shippingCost === 0 ? 'FREE' : `₹${order.shippingCost}`}</span></div>
              <div className="summary-row"><span>GST</span><span>₹{order.tax.toLocaleString('en-IN')}</span></div>
            </div>
            <div className="summary-total" style={{marginTop:'1rem', paddingTop:'1rem', borderTop:'1px solid var(--border)'}}>
              <span>Total</span><span>₹{order.totalAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="payment-info">
              <div className="info-row"><span>Payment</span><span>{order.paymentMethod}</span></div>
              <div className="info-row">
                <span>Status</span>
                <span className={`badge ${order.paymentStatus === 'paid' ? 'badge-success' : 'badge-muted'}`}>
                  {order.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                </span>
              </div>
            </div>
            {['processing', 'confirmed'].includes(order.orderStatus) && (
              <button className="btn btn-danger" style={{width:'100%', marginTop:'1rem'}} onClick={handleCancel}>Cancel Order</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;