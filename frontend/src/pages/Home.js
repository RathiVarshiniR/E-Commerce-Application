import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getFeaturedProducts } from '../services/api';
import ProductCard from '../components/ProductCard';
import './Home.css';

const CATEGORIES = [
  { name: 'Electronics', icon: '💻', color: '#3b82f6' },
  { name: 'Clothing', icon: '👕', color: '#8b5cf6' },
  { name: 'Sports', icon: '⚽', color: '#22c55e' },
  { name: 'Books', icon: '📚', color: '#f59e0b' },
  { name: 'Home & Garden', icon: '🏡', color: '#ec4899' },
  { name: 'Toys', icon: '🧸', color: '#ff6b35' },
];

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getFeaturedProducts()
      .then(r => setFeatured(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="home-page page-enter">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-orb orb1" />
          <div className="hero-orb orb2" />
          <div className="hero-grid" />
        </div>
        <div className="container hero-content">
          <div className="hero-badge">🔥 New Arrivals Every Week</div>
          <h1 className="hero-title">
            Discover <span className="accent-text">Premium</span><br />
            Products Online
          </h1>
          <p className="hero-sub">
            Shop thousands of curated products with fast delivery, easy returns, and unbeatable prices.
          </p>
          <div className="hero-actions">
            <Link to="/products" className="btn btn-primary btn-lg">Shop Now</Link>
            <Link to="/products?featured=true" className="btn btn-outline btn-lg">View Featured</Link>
          </div>
          <div className="hero-stats">
            <div className="stat"><strong>12K+</strong><span>Products</span></div>
            <div className="stat-divider" />
            <div className="stat"><strong>50K+</strong><span>Customers</span></div>
            <div className="stat-divider" />
            <div className="stat"><strong>99%</strong><span>Satisfaction</span></div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Shop by Category</h2>
            <Link to="/products" className="btn btn-ghost btn-sm">View All →</Link>
          </div>
          <div className="categories-grid">
            {CATEGORIES.map(cat => (
              <button
                key={cat.name}
                className="category-card"
                onClick={() => navigate(`/products?category=${cat.name}`)}
                style={{ '--cat-color': cat.color }}
              >
                <span className="category-icon">{cat.icon}</span>
                <span className="category-name">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Products</h2>
            <Link to="/products" className="btn btn-ghost btn-sm">See All →</Link>
          </div>
          {loading ? (
            <div className="loading-center"><div className="spinner" /></div>
          ) : (
            <div className="grid-products">
              {featured.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* Banner */}
      <section className="section">
        <div className="container">
          <div className="promo-banner">
            <div className="promo-text">
              <h3>Free Shipping on Orders over ₹500</h3>
              <p>Plus 18% GST included in all prices. No hidden charges.</p>
            </div>
            <Link to="/products" className="btn btn-primary">Start Shopping</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;