import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const STATUS_CONFIG = {
    pending: { color: "#f59e0b", bg: "#fef3c7", label: "Pending" },
    approved: { color: "#10b981", bg: "#d1fae5", label: "Approved" },
    processing: { color: "#3b82f6", bg: "#dbeafe", label: "Processing" },
    shipped: { color: "#8b5cf6", bg: "#ede9fe", label: "Shipped" },
    delivered: { color: "#06b6d4", bg: "#cffafe", label: "Delivered" },
};

const PAYMENT_LABEL = {
    cod: { label: "Cash on Delivery" },
    upi: { label: "UPI / Razorpay" },
    card: { label: "Card" },
};

export default function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [selectedAddress, setSelectedAddress] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try { setUser(jwtDecode(token)); } catch { /* ignore */ }
        }
        const fetchOrders = async () => {
            try {
                if (!token) return;
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/order/my-orders`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setOrders(res.data);
            } catch (err) {
                console.error("Error fetching orders:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 300 }}>
            <div className="spinner-border text-primary" role="status" />
        </div>
    );

    return (
        <div className="container py-4 px-2 px-sm-3">
            <h2 className="fw-bold mb-4 text-center">📦 My Orders</h2>

            {orders.length === 0 ? (
                <div className="text-center py-5 bg-light rounded-4 shadow-sm">
                    <div style={{ fontSize: 56 }}>🛒</div>
                    <h5 className="mt-3 fw-semibold">No orders yet</h5>
                    <p className="text-muted small">Browse products and place your first order!</p>
                    <Link to="/" className="btn btn-primary rounded-pill px-4 mt-1">Start Shopping</Link>
                </div>
            ) : (
                <div className="d-flex flex-column gap-4">
                    {orders.map(order => {
                        const st = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
                        const pm = PAYMENT_LABEL[order.paymentMethod] || PAYMENT_LABEL.cod;
                        const orderTotal = order.products.reduce(
                            (s, item) => s + (item.productId?.price || 0) * (item.quantity || 1), 0
                        );

                        return (
                            <div key={order._id} className="card border-0 shadow-sm rounded-4 overflow-hidden">

                                {/* ── Card Header ─────────────────────────── */}
                                <div className="card-header bg-white border-bottom px-3 px-sm-4 py-3 d-flex flex-wrap gap-2 justify-content-between align-items-center">
                                    <div>
                                        <span className="fw-bold text-primary" style={{ fontSize: 13 }}>
                                            Order #{order._id.slice(-8).toUpperCase()}
                                        </span>
                                        <span className="text-muted ms-2 small">
                                            {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                        </span>
                                    </div>
                                    <span className="badge rounded-pill px-3 py-2 fw-semibold"
                                        style={{ background: st.bg, color: st.color, fontSize: 12 }}>
                                        {st.label}
                                    </span>
                                </div>

                                {/* ── Card Body ───────────────────────────── */}
                                <div className="card-body px-3 px-sm-4 py-3">
                                    <div className="row g-3">

                                        {/* Products list */}
                                        <div className="col-12 col-md-7">
                                            <p className="text-uppercase fw-bold mb-2" style={{ fontSize: 11, letterSpacing: 1, color: "#64748b" }}>
                                                Products
                                            </p>
                                            <div className="d-flex flex-column gap-2">
                                                {order.products.map((item, idx) => (
                                                    <div key={idx} className="d-flex align-items-center gap-3 rounded-3 p-2"
                                                        style={{ background: "#f8fafc" }}>
                                                        {/* Product image or placeholder */}
                                                        {item.productId?.image ? (
                                                            <img
                                                                src={item.productId.image}
                                                                alt={item.productId?.title}
                                                                style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 8, flexShrink: 0 }}
                                                                onError={e => e.target.style.display = "none"}
                                                            />
                                                        ) : (
                                                            <div style={{ width: 48, height: 48, background: "#e2e8f0", borderRadius: 8, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>📦</div>
                                                        )}
                                                        <div className="flex-grow-1" style={{ minWidth: 0 }}>
                                                            <div className="fw-semibold text-truncate" style={{ fontSize: 14 }}>
                                                                {item.productId?.title || item.productId?.name || "Product Unavailable"}
                                                            </div>
                                                            <div className="text-muted small">Qty: {item.quantity}</div>
                                                        </div>
                                                        <div className="fw-bold ms-auto ps-1" style={{ whiteSpace: "nowrap" }}>
                                                            ₹{(item.productId?.price || 0) * item.quantity}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Right: user info + payment + address */}
                                        <div className="col-12 col-md-5">

                                            {/* User */}
                                            <div className="rounded-3 p-3 mb-3" style={{ background: "#f8fafc" }}>
                                                <p className="text-uppercase fw-bold mb-2" style={{ fontSize: 11, letterSpacing: 1, color: "#64748b" }}>Customer</p>
                                                <p className="mb-1 small"><strong>Name:</strong> {user?.username || "N/A"}</p>
                                                <p className="mb-0 small"><strong>Email:</strong> {user?.email || "N/A"}</p>
                                            </div>

                                            {/* Payment */}
                                            <div className="rounded-3 p-3 mb-3 d-flex align-items-center gap-2" style={{ background: "#f0fdf4" }}>
                                                <span style={{ fontSize: 22 }}>{pm.icon}</span>
                                                <div>
                                                    <p className="text-uppercase fw-bold mb-0" style={{ fontSize: 11, letterSpacing: 1, color: "#64748b" }}>Payment</p>
                                                    <p className="mb-0 small fw-semibold">{pm.label}</p>
                                                </div>
                                            </div>

                                            {/* View Address */}
                                            <button
                                                className="btn btn-outline-secondary btn-sm rounded-pill w-100"
                                                onClick={() => setSelectedAddress(order.shippingAddress)}
                                            >
                                                📍 View Shipping Address
                                            </button>
                                        </div>

                                    </div>
                                </div>

                                {/* ── Card Footer ─────────────────────────── */}
                                <div className="card-footer bg-white border-top d-flex justify-content-between align-items-center px-3 px-sm-4 py-2">
                                    <span className="text-muted small">Total</span>
                                    <span className="fw-bold fs-5">₹{orderTotal}</span>
                                </div>

                            </div>
                        );
                    })}
                </div>
            )}

            {/* ── Address Modal ─────────────────────────────────── */}
            {selectedAddress && (
                <div
                    className="modal fade show"
                    style={{ display: "block", backgroundColor: "rgba(0,0,0,0.45)" }}
                    onClick={() => setSelectedAddress(null)}
                >
                    <div className="modal-dialog modal-dialog-centered" onClick={e => e.stopPropagation()}>
                        <div className="modal-content rounded-4 border-0 shadow-lg">
                            <div className="modal-header border-0 pb-0">
                                <h5 className="modal-title fw-bold">📍 Shipping Address</h5>
                                <button className="btn-close" onClick={() => setSelectedAddress(null)} />
                            </div>
                            <div className="modal-body pt-2">
                                <h6 className="fw-bold text-primary mb-3">{selectedAddress.fullName}</h6>
                                <p className="mb-1">🏠 {selectedAddress.address}</p>
                                <p className="mb-1">🌆 {selectedAddress.city}, {selectedAddress.state}</p>
                                <p className="mb-1">📮 {selectedAddress.pincode}</p>
                                <p className="mb-0">📞 {selectedAddress.phone}</p>
                            </div>
                            <div className="modal-footer border-0 pt-0">
                                <button className="btn btn-secondary rounded-pill px-4" onClick={() => setSelectedAddress(null)}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
