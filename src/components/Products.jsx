import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // ✅ Import Link
import axios from "axios";
import { useCart } from "./context/CartContext";

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = React.useState(value);
  React.useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};
export default function Products() {
  const { addToCart } = useCart();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(50000);
  const [sort, setSort] = useState("");

  const debouncedMin = useDebounce(minPrice, 500);
  const debouncedMax = useDebounce(maxPrice, 500);

  const categories = [
    "all", "mobile", "laptop", "tablet", "smartwatch", "accessories",
    "headphones", "camera", "gaming", "monitor", "keyboard", "mouse",
    "speaker", "tv", "electronics", "home-appliances", "wearables",
    "storage-devices", "networking"
  ];

  // Fetch products
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category && category !== "all") params.append("category", category);
    if (debouncedMin > 0) params.append("minPrice", debouncedMin);
    if (debouncedMax < 50000) params.append("maxPrice", debouncedMax);
    if (sort) params.append("sort", sort);

    axios
      .get(`${import.meta.env.VITE_API_URL}/products?${params.toString()}`)
      .then((response) => {
        setCards(Array.isArray(response.data) ? response.data : []);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });

  }, [category, debouncedMin, debouncedMax, sort]);

  // Loader
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  return (

    <div className="container mt-4 mb-5">
      <h1 className="text-center mb-4 fw-bold">Discover Our Products</h1>

      {/* ── Filters and Sort ─────────────────────────── */}
      <div className="card shadow-sm border-0 rounded-4 p-3 mb-4 bg-light">
        <div className="row g-3 align-items-end">
          {/* Category Filter */}
          <div className="col-6 col-md-3">
            <label className="form-label small fw-bold text-muted text-uppercase">Category</label>
            <select
              className="form-select border-0 shadow-sm"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div className="col-12 col-md-4">
            <label className="form-label small fw-bold text-muted text-uppercase">Price Range (₹0 - ₹{maxPrice})</label>
            <input
              type="range"
              className="form-range"
              min="0"
              max="50000"
              step="100"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>

          {/* Sort */}
          <div className="col-12 col-md-3">
            <label className="form-label small fw-bold text-muted text-uppercase">Sort By Price</label>
            <select
              className="form-select border-0 shadow-sm"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="">Default</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>

          {/* Clear Filters */}
          <div className="col-12 col-md-2">
            <label className="form-label d-none d-md-block" style={{ visibility: "hidden" }}>Clear</label>
            <button
              className="btn btn-outline-secondary w-100 border-0 shadow-sm"
              onClick={() => {
                setCategory("all");
                setMinPrice(0);
                setMaxPrice(50000);
                setSort("");
              }}
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="d-flex justify-content-center py-5">
          <div className="spinner-border text-primary"></div>
        </div>
      ) : (
        <div className="row g-4 justify-content-center">
          {cards.length > 0 ? (
            cards.map((item) => (
              <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-2" key={item._id}>
                <div className="card shadow-sm h-100 border-0 rounded-4 overflow-hidden product-card">
                  <div className="position-relative overflow-hidden" style={{ height: "200px" }}>
                    <img
                      src={`${item.image}`}
                      alt={item.title}
                      className="img-fluid w-100 h-100 transition-transform"
                      style={{ objectFit: "cover" }}
                    />
                    <div className="category-badge position-absolute top-0 start-0 m-2">
                      <span className="badge bg-dark bg-opacity-75 rounded-pill px-2 py-1 small">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  <div className="card-body d-flex flex-column p-3">
                    <h6 className="card-title text-truncate fw-bold mb-1" title={item.title}>
                      {item.title}
                    </h6>
                    <p
                      className="card-text text-muted small flex-grow-1 mb-2"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {item.description}
                    </p>
                    <div className="d-flex flex-column gap-2 mt-auto">
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="fw-bold text-primary fs-5">₹{item.price}</span>
                        <Link
                          to={`/view-product/${item._id}`}
                          className="btn btn-sm btn-outline-primary rounded-pill px-3"
                        >
                          View
                        </Link>
                      </div>
                      <button
                        className="btn btn-primary btn-sm rounded-pill w-100 fw-semibold"
                        onClick={() => addToCart(item._id)}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-5">
              <div className="mb-3" style={{ fontSize: "3rem" }}>😕</div>
              <h4>No products found</h4>
              <p className="text-muted">Try adjusting your filters or search criteria.</p>
            </div>
          )}
        </div>
      )}

    </div>

  );

}
