import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="container">
      <div className="footer-grid">
        <div className="footer-brand">
          <div className="footer-logo">
            <span style={{color:'var(--text)'}}>SHOP</span><span style={{color:'var(--accent)'}}>NOW</span>
          </div>
          <p>Your premium destination for quality products at unbeatable prices.</p>
        </div>
        <div className="footer-col">
          <h4>Shop</h4>
          <Link to="/products">All Products</Link>
          <Link to="/products?category=Electronics">Electronics</Link>
          <Link to="/products?category=Clothing">Clothing</Link>
          <Link to="/products?category=Sports">Sports</Link>
        </div>
        <div className="footer-col">
          <h4>Account</h4>
          <Link to="/login">Login</Link>
          <Link to="/register">Sign Up</Link>
          <Link to="/orders">My Orders</Link>
          <Link to="/cart">Cart</Link>
        </div>
        <div className="footer-col">
          <h4>Support</h4>
          <a href="#">Help Center</a>
          <a href="#">Returns</a>
          <a href="#">Shipping Info</a>
          <a href="#">Contact Us</a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} ShopNow. All rights reserved.</p>
        <p>Built with React & Node.js</p>
      </div>
    </div>
  </footer>
);

export default Footer;