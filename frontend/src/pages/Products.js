import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts } from '../services/api';
import ProductCard from '../components/ProductCard';
import './Products.css';

const CATEGORIES = ['All', 'Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Toys', 'Food', 'Other'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);

  const category = searchParams.get('category') || 'All';
  const keyword = searchParams.get('keyword') || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = Number(searchParams.get('page') || 1);

  const [search, setSearch] = useState(keyword);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12, sort };
      if (keyword) params.keyword = keyword;
      if (category && category !== 'All') params.category = category;
      const { data } = await getProducts(params);
      setProducts(data.products);
      setTotal(data.total);
      setPages(data.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [category, keyword, sort, page]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const updateParam = (key, value) => {
    const params = Object.fromEntries(searchParams.entries());
    if (value) params[key] = value; else delete params[key];
    params.page = '1';
    setSearchParams(params);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    updateParam('keyword', search);
  };

  return (
    <div className="products-page page-enter">
      <div className="container">
        <div className="products-header">
          <div>
            <h1 className="products-title">Products</h1>
            <p className="products-count">{total} products found</p>
          </div>
          <form className="search-form" onSubmit={handleSearch}>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search products..."
              className="input-field search-input"
            />
            <button type="submit" className="btn btn-primary btn-sm">Search</button>
          </form>
        </div>

        <div className="products-layout">
          {/* Sidebar Filters */}
          <aside className="filters-sidebar">
            <div className="filter-section">
              <h3 className="filter-title">Categories</h3>
              <div className="category-list">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    className={`category-filter-btn ${category === cat ? 'active' : ''}`}
                    onClick={() => updateParam('category', cat === 'All' ? '' : cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div className="filter-section">
              <h3 className="filter-title">Sort By</h3>
              <div className="category-list">
                {SORT_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    className={`category-filter-btn ${sort === opt.value ? 'active' : ''}`}
                    onClick={() => updateParam('sort', opt.value)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="products-main">
            {loading ? (
              <div className="loading-center"><div className="spinner" /></div>
            ) : products.length === 0 ? (
              <div className="empty-state">
                <p>🛍️</p>
                <h3>No products found</h3>
                <p>Try adjusting your filters or search terms.</p>
              </div>
            ) : (
              <>
                <div className="grid-products">
                  {products.map(p => <ProductCard key={p._id} product={p} />)}
                </div>
                {/* Pagination */}
                {pages > 1 && (
                  <div className="pagination">
                    <button
                      className="btn btn-outline btn-sm"
                      disabled={page === 1}
                      onClick={() => updateParam('page', String(page - 1))}
                    >← Prev</button>
                    <span className="page-info">Page {page} of {pages}</span>
                    <button
                      className="btn btn-outline btn-sm"
                      disabled={page === pages}
                      onClick={() => updateParam('page', String(page + 1))}
                    >Next →</button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;