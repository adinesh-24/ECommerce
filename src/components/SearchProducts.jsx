import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCart } from "./context/CartContext";

export default function SearchProducts() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/products`)
      .then(res => setProducts(res.data || []))
      .catch(err => console.error("Error fetching products:", err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter(p =>
    (p.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.category || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
      <div className="container py-5">

        {/* ── Algolia-style search box ─────────────────── */}
        <div className="mx-auto mb-5" style={{ maxWidth: 560 }}>
          <div
            className="d-flex align-items-center gap-2 bg-white px-3 py-2 rounded-pill shadow-sm"
            style={{ border: "1.5px solid #e2e8f0" }}
          >
            {/* Search icon */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="#6366f1" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
              style={{ flexShrink: 0 }}>
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>

            <input
              type="text"
              className="border-0 flex-grow-1 bg-transparent"
              placeholder="Search products…"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ outline: "none", fontSize: 15, color: "#1e293b" }}
              autoFocus
            />

            {/* Clear button */}
            {searchTerm && (
              <button
                className="btn p-0 border-0 bg-transparent text-muted"
                style={{ lineHeight: 1 }}
                onClick={() => setSearchTerm("")}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>

          {/* Result count */}
          <p className="text-muted small text-center mt-2 mb-0">
            {loading ? "Loading…" : searchTerm
              ? `${filtered.length} result${filtered.length !== 1 ? "s" : ""} for "${searchTerm}"`
              : `${products.length} products available`}
          </p>
        </div>

        {/* ── Loading ───────────────────────────────────── */}
        {loading && (
          <div className="d-flex justify-content-center py-5">
            <div className="spinner-border text-primary" role="status" />
          </div>
        )}

        {/* ── No results ───────────────────────────────── */}
        {!loading && filtered.length === 0 && searchTerm && (
          <div className="text-center py-5">
            <div style={{ fontSize: 52 }}>🔍</div>
            <h5 className="mt-3 fw-semibold">No products found</h5>
            <p className="text-muted small">Try a different keyword or category</p>
            <button className="btn btn-outline-primary rounded-pill px-4" onClick={() => setSearchTerm("")}>
              Clear Search
            </button>
          </div>
        )}

        {/* ── Product Grid ─────────────────────────────── */}
        {!loading && filtered.length > 0 && (
          <div className="row g-3">
            {filtered.map(product => (
              <div key={product._id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                <div
                  className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden"
                  style={{ transition: "transform 0.18s, box-shadow 0.18s" }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
                >
                  {/* Image */}
                  <div style={{ height: 140, background: "#f1f5f9", overflow: "hidden" }}>
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.title}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        onError={e => { e.target.style.display = "none"; }}
                      />
                    ) : (
                      <div className="d-flex align-items-center justify-content-center h-100" style={{ fontSize: 36 }}>📦</div>
                    )}
                  </div>
                  {/* Body */}
                  <div className="card-body p-2">
                    <div className="fw-semibold text-truncate" style={{ fontSize: 13 }} title={product.title}>
                      {product.title}
                    </div>
                    <div className="text-muted" style={{ fontSize: 11 }}>{product.category}</div>
                    <div className="d-flex justify-content-between align-items-center mt-2">
                      <div className="fw-bold text-primary" style={{ fontSize: 16 }}>₹{product.price}</div>
                      <button
                        className="btn btn-sm btn-primary rounded-pill px-3 fw-semibold"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product._id);
                        }}
                      >
                        Add
                      </button>
                    </div>
                    <button
                      className="btn btn-link btn-sm text-decoration-none w-100 mt-1 pb-0 text-muted"
                      style={{ fontSize: 11 }}
                      onClick={() => navigate(`/view-product/${product._id}`)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
