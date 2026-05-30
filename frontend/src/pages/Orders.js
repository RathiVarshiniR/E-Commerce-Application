import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrders, cancelOrder } from '../services/api';
import toast from 'react-hot-toast';
import './Orders.css';

const STATUS_BADGE = {
  processing: 'badge-warning',
  confirmed: 'badge-info',
  shipped: 'badge-info',
  delivered: 'badge-success',
  cancelled: 'badge-error',
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const { data } = await getMyOrders();
      setOrders(data);
    } catch { toast.error('Failed to load orders'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this order?')) return;
    try {
      await cancelOrder(id);
      toast.success('Order cancelled');
      fetchOrders();
    } catch (err) { toast.error(err.response?.data?.message || 'Cannot cancel order'); }
  };

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;

  return (
    <div className="orders-page page-enter">
      <div className="container">
        <h1 className="orders-title">My Orders</h1>
        {orders.length === 0 ? (
          <div className="empty-state">
            <p>📦</p>
            <h3>No orders yet</h3>
            <p>Start shopping to see your orders here.</p>
            <Link to="/products" className="btn btn-primary" style={{marginTop:'1rem'}}>Browse Products</Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order._id} className="order-card card">
                <div className="order-card-header">
                  <div>
                    <p className="order-id">Order #{order._id.slice(-8).toUpperCase()}</p>
                    <p className="order-date">{new Date(order.createdAt).toLocaleDateString('en-IN', {year:'numeric', month:'long', day:'numeric'})}</p>
                  </div>
                  <div className="order-badges">
                    <span className={`badge ${STATUS_BADGE[order.orderStatus] || 'badge-muted'}`}>
                      {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                    </span>
                    <span className={`badge ${order.paymentStatus === 'paid' ? 'badge-success' : 'badge-muted'}`}>
                      {order.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
                    </span>
                  </div>
                </div>
                <div className="order-items-preview">
                  {order.items.slice(0, 3).map(item => (
                    <div key={item._id} className="order-preview-item">
                      <img src={item.image} alt={item.name} />
                      <span>{item.name} ×{item.quantity}</span>
                    </div>
                  ))}
                  {order.items.length > 3 && <p className="more-items">+{order.items.length - 3} more</p>}
                </div>
                <div className="order-card-footer">
                  <div className="order-total-info">
                    <span className="order-payment-method">{order.paymentMethod}</span>
                    <span className="order-total">₹{order.totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="order-actions">
                    <Link to={`/orders/${order._id}`} className="btn btn-outline btn-sm">View Details</Link>
                    {['processing', 'confirmed'].includes(order.orderStatus) && (
                      <button className="btn btn-danger btn-sm" onClick={() => handleCancel(order._id)}>Cancel</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;