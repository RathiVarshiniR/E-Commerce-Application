import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, addReview } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './ProductDetail.css';

const Stars = ({ rating, size = 'md' }) => (
  <div className="stars">
    {[1,2,3,4,5].map(s => (
      <span key={s} className={`star ${size} ${s <= Math.round(rating) ? 'filled' : 'empty'}`}>★</span>
    ))}
  </div>
);

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);

  const fetchProduct = async () => {
    try {
      const { data } = await getProductById(id);
      setProduct(data);
    } catch { toast.error('Product not found'); navigate('/products'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProduct(); }, [id]);

  const handleAddToCart = () => {
    addToCart(product, qty);
    toast.success(`${qty} × ${product.name} added to cart!`);
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    setReviewLoading(true);
    try {
      await addReview(id, { rating: reviewRating, comment: reviewComment });
      toast.success('Review submitted!');
      setReviewComment('');
      setReviewRating(5);
      fetchProduct();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally { setReviewLoading(false); }
  };

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;
  if (!product) return null;

  const inStock = product.stock > 0;

  return (
    <div className="product-detail-page page-enter">
      <div className="container">
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

        <div className="product-detail-grid">
          {/* Image */}
          <div className="detail-image-wrap">
            <img src={product.image} alt={product.name} className="detail-image" />
            {!inStock && <div className="out-of-stock-overlay">Out of Stock</div>}
            {product.featured && <span className="featured-badge">Featured</span>}
          </div>

          {/* Info */}
          <div className="detail-info">
            <span className="product-category">{product.category}</span>
            <h1 className="detail-name">{product.name}</h1>

            <div className="detail-rating">
              <Stars rating={product.rating} size="lg" />
              <span className="rating-text">{product.rating.toFixed(1)} ({product.numReviews} reviews)</span>
            </div>

            <div className="detail-price">₹{product.price.toLocaleString('en-IN')}</div>

            <p className="detail-description">{product.description}</p>

            <div className="stock-info">
              <span className={`badge ${inStock ? 'badge-success' : 'badge-error'}`}>
                {inStock ? `In Stock (${product.stock})` : 'Out of Stock'}
              </span>
            </div>

            {inStock && (
              <div className="qty-section">
                <label className="form-label">Quantity</label>
                <div className="qty-controls">
                  <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                  <span className="qty-display">{qty}</span>
                  <button className="qty-btn" onClick={() => setQty(q => Math.min(product.stock, q + 1))}>+</button>
                </div>
              </div>
            )}

            <div className="detail-actions">
              <button className="btn btn-primary btn-lg" onClick={handleAddToCart} disabled={!inStock}>
                🛒 Add to Cart
              </button>
              <button className="btn btn-outline btn-lg" onClick={() => { handleAddToCart(); navigate('/cart'); }} disabled={!inStock}>
                Buy Now
              </button>
            </div>

            <div className="detail-features">
              <div className="feature-item">🚚 Free shipping on orders over ₹500</div>
              <div className="feature-item">↩️ Easy 30-day returns</div>
              <div className="feature-item">🔒 Secure checkout</div>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="reviews-section">
          <h2 className="section-title">Customer Reviews ({product.numReviews})</h2>

          {product.reviews.length === 0 ? (
            <p className="no-reviews">No reviews yet. Be the first to review!</p>
          ) : (
            <div className="reviews-list">
              {product.reviews.map(rev => (
                <div key={rev._id} className="review-card card">
                  <div className="review-header">
                    <div className="reviewer-avatar">{rev.name[0]}</div>
                    <div>
                      <p className="reviewer-name">{rev.name}</p>
                      <Stars rating={rev.rating} />
                    </div>
                    <span className="review-date">{new Date(rev.createdAt).toLocaleDateString('en-IN')}</span>
                  </div>
                  <p className="review-comment">{rev.comment}</p>
                </div>
              ))}
            </div>
          )}

          {/* Add review form */}
          <div className="add-review card">
            <h3>Write a Review</h3>
            {!user ? (
              <p>Please <button className="link-btn" onClick={() => navigate('/login')}>login</button> to write a review.</p>
            ) : (
              <form onSubmit={handleReview}>
                <div className="form-group">
                  <label className="form-label">Rating</label>
                  <div className="rating-select">
                    {[1,2,3,4,5].map(r => (
                      <button type="button" key={r} className={`rating-star ${r <= reviewRating ? 'selected' : ''}`} onClick={() => setReviewRating(r)}>★</button>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Comment</label>
                  <textarea
                    className="input-field"
                    rows={4}
                    value={reviewComment}
                    onChange={e => setReviewComment(e.target.value)}
                    placeholder="Share your experience with this product..."
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary" disabled={reviewLoading}>
                  {reviewLoading ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;