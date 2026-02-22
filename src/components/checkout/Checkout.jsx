import React, { useEffect, useState } from "react";
import axios from "axios";
import Address from "./Address";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// ── Payment methods config ───────────────────────────────────
const PAYMENT_METHODS = [
  {
    id: "cod",
    label: "Cash on Delivery",
    icon: "💵",
    description: "Pay when your order arrives at your doorstep.",
    available: true,
    badge: null,
  },
  {
    id: "upi",
    label: "UPI / Razorpay",
    icon: "📲",
    description: "Pay securely using UPI, Cards, or Net Banking via Razorpay.",
    available: false,
    badge: "Coming Soon",
  },
];

export default function Checkout() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cod");  // default: COD
  const [showPaymentNotice, setShowPaymentNotice] = useState(false); // UPI tooltip
  const [placing, setPlacing] = useState(false);

  const token = localStorage.getItem("token");

  // Fetch Cart & Addresses
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cartRes, addrRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/cart`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${import.meta.env.VITE_API_URL}/address`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        setCart(cartRes.data || []);
        setAddresses(addrRes.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, [token]);

  const total = cart.reduce((sum, item) => sum + (item.product?.price || 0) * (item.quantity || 1), 0);

  const handleAddressSubmit = async (addressData) => {
    try {
      if (editingAddress) {
        const res = await axios.put(
          `${import.meta.env.VITE_API_URL}/address/${editingAddress._id}`,
          addressData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAddresses(prev => prev.map(addr => addr._id === editingAddress._id ? res.data : addr));
      } else {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/address`,
          addressData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAddresses(prev => [...prev, res.data]);
      }
      setShowAddressForm(false);
      setEditingAddress(null);
    } catch (err) {
      console.error("Error saving address:", err);
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm("Delete this address?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/address/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAddresses(prev => prev.filter(addr => addr._id !== id));
      if (selectedAddressId === id) setSelectedAddressId(null);
    } catch (err) {
      console.error("Error deleting address:", err);
    }
  };

  const placeOrder = async () => {
    if (!selectedAddressId) return alert("Please select a shipping address");
    if (paymentMethod === "upi") return; // blocked — should not reach here

    setPlacing(true);
    const selectedAddr = addresses.find(a => a._id === selectedAddressId);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/order`,
        {
          products: cart.map(item => ({
            productId: item.product._id,
            quantity: item.quantity
          })),
          shippingAddress: selectedAddr,
          paymentMethod: "cod"
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("🎉 Order placed successfully!");
      toast.info("📧 Confirmation email sent to your inbox!", { delay: 600 });
      navigate("/my-orders");
    } catch (err) {
      console.error(err);
      alert("Failed to place order. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  const canPlaceOrder = selectedAddressId && paymentMethod === "cod";

  return (
    <div className="container mt-4 mb-5">
      <h3 className="mb-4 fw-bold">🛒 Checkout</h3>

      <div className="row g-4">
        {/* ── LEFT: Address + Payment ─────────────────────── */}
        <div className="col-lg-8">

          {/* Address Section */}
          <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0">📍 Shipping Address</h5>
              {!showAddressForm && (
                <button
                  className="btn btn-outline-primary btn-sm rounded-pill px-3"
                  onClick={() => { setEditingAddress(null); setShowAddressForm(true); }}
                >
                  + Add New
                </button>
              )}
            </div>

            {showAddressForm && (
              <Address
                onAddressSubmit={handleAddressSubmit}
                initialData={editingAddress}
                onCancel={() => { setShowAddressForm(false); setEditingAddress(null); }}
              />
            )}

            {!showAddressForm && (
              <div className="list-group list-group-flush">
                {addresses.map(addr => (
                  <div
                    key={addr._id}
                    className={`list-group-item list-group-item-action rounded-3 mb-2 border ${selectedAddressId === addr._id ? "border-primary bg-primary bg-opacity-10" : ""}`}
                    style={{ cursor: "pointer" }}
                    onClick={() => setSelectedAddressId(addr._id)}
                  >
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="d-flex gap-3 align-items-start">
                        <input
                          type="radio"
                          name="selectedAddress"
                          checked={selectedAddressId === addr._id}
                          onChange={() => setSelectedAddressId(addr._id)}
                          className="form-check-input mt-1"
                          onClick={e => e.stopPropagation()}
                        />
                        <div>
                          <strong>{addr.fullName}</strong>
                          <div className="text-muted small mt-1">
                            {addr.address}, {addr.city}, {addr.state} – {addr.pincode}
                          </div>
                          <div className="text-muted small">📞 {addr.phone}</div>
                        </div>
                      </div>
                      <div className="d-flex gap-2 ms-2">
                        <button className="btn btn-sm btn-light" onClick={e => { e.stopPropagation(); setEditingAddress(addr); setShowAddressForm(true); }}>Edit</button>
                        <button className="btn btn-sm btn-outline-danger" onClick={e => { e.stopPropagation(); handleDeleteAddress(addr._id); }}>Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
                {addresses.length === 0 && (
                  <p className="text-muted text-center my-3">No saved addresses. Add one above.</p>
                )}
              </div>
            )}
          </div>

          {/* ── Payment Method Section ────────────────────── */}
          <div className="card border-0 shadow-sm rounded-4 p-4">
            <h5 className="fw-bold mb-3">💳 Payment Method</h5>

            <div className="d-flex flex-column gap-3">
              {PAYMENT_METHODS.map(method => (
                <div
                  key={method.id}
                  className={`rounded-3 border p-3 d-flex align-items-center gap-3 position-relative
                    ${!method.available ? "opacity-75" : ""}
                    ${paymentMethod === method.id && method.available ? "border-primary bg-primary bg-opacity-10" : ""}
                  `}
                  style={{ cursor: method.available ? "pointer" : "not-allowed" }}
                  onClick={() => {
                    if (!method.available) {
                      setShowPaymentNotice(true);
                      setTimeout(() => setShowPaymentNotice(false), 3000);
                    } else {
                      setPaymentMethod(method.id);
                    }
                  }}
                >
                  {/* Radio */}
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === method.id}
                    disabled={!method.available}
                    onChange={() => { }}
                    className="form-check-input mt-0 flex-shrink-0"
                    style={{ width: 18, height: 18 }}
                  />

                  {/* Icon */}
                  <span style={{ fontSize: 26 }}>{method.icon}</span>

                  {/* Text */}
                  <div className="flex-grow-1">
                    <div className="d-flex align-items-center gap-2">
                      <strong>{method.label}</strong>
                      {method.badge && (
                        <span className="badge rounded-pill"
                          style={{ background: "linear-gradient(90deg,#f59e0b,#ef4444)", fontSize: 10 }}>
                          {method.badge}
                        </span>
                      )}
                    </div>
                    <div className="text-muted small">{method.description}</div>
                  </div>

                  {/* Lock icon for unavailable */}
                  {!method.available && (
                    <span className="text-muted" title="Not yet available">🔒</span>
                  )}
                </div>
              ))}
            </div>

            {/* Coming Soon Notification Toast */}
            {showPaymentNotice && (
              <div
                className="alert alert-warning d-flex align-items-center gap-2 mt-3 mb-0 rounded-3 py-2 px-3"
                style={{ fontSize: 14, border: "1.5px solid #fbbf24" }}
              >
                <span style={{ fontSize: 20 }}>🚧</span>
                <div>
                  <strong>Razorpay UPI is coming soon!</strong><br />
                  <span className="text-muted small">We're working on integrating Razorpay. For now, please use Cash on Delivery.</span>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* ── RIGHT: Order Summary ──────────────────────────── */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 sticky-top" style={{ top: 80 }}>
            <h5 className="fw-bold mb-3">🧾 Order Summary</h5>
            <hr />
            {cart.map(item => (
              <div key={item._id} className="d-flex justify-content-between mb-2 small">
                <span className="text-truncate me-2" style={{ maxWidth: 160 }}>
                  {item.product?.title} <span className="text-muted">×{item.quantity}</span>
                </span>
                <span className="fw-semibold">₹{(item.product?.price || 0) * item.quantity}</span>
              </div>
            ))}
            <hr />
            <div className="d-flex justify-content-between align-items-center mb-1">
              <span className="text-muted small">Subtotal</span>
              <span>₹{total}</span>
            </div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-muted small">Delivery</span>
              <span className="text-success fw-semibold">FREE</span>
            </div>
            <div className="d-flex justify-content-between align-items-center fw-bold fs-5 mb-4">
              <span>Total</span>
              <span>₹{total}</span>
            </div>

            {/* Selected payment indicator */}
            <div className="rounded-3 bg-light px-3 py-2 mb-3 small d-flex align-items-center gap-2">
              <span>💳</span>
              <span className="text-muted">Payment:</span>
              <strong className="text-capitalize">{paymentMethod === "cod" ? "Cash on Delivery" : "UPI / Razorpay"}</strong>
            </div>

            <button
              className="btn btn-primary w-100 rounded-pill fw-semibold py-2"
              onClick={placeOrder}
              disabled={!canPlaceOrder || placing}
            >
              {placing ? (
                <><span className="spinner-border spinner-border-sm me-2" />Placing Order...</>
              ) : paymentMethod === "upi" ? (
                "🔒 Razorpay Coming Soon"
              ) : !selectedAddressId ? (
                "Select an Address"
              ) : (
                "✅ Place Order (COD)"
              )}
            </button>

            {!selectedAddressId && (
              <p className="text-danger text-center small mt-2 mb-0">⚠ Please select a shipping address</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
