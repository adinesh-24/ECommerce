import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/order`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrders(res.data);
            console.log(res.data);
        } catch (err) {
            console.error("Error fetching orders:", err);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, newStatus) => {
        if (!window.confirm(`Change status to ${newStatus}?`)) return;

        try {
            const res = await axios.put(
                `${import.meta.env.VITE_API_URL}/order/${id}/status`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Update local state
            setOrders(prev => prev.map(o => o._id === id ? { ...o, status: res.data.status } : o));
            // Also update selectedOrder if it's open
            if (selectedOrder && selectedOrder._id === id) {
                setSelectedOrder(prev => ({ ...prev, status: res.data.status }));
            }
            alert("Status updated!");
        } catch (err) {
            console.error(err);
            alert("Failed to update status");
        }
    };

    const calculateTotal = (products) => {
        return products.reduce((total, item) => {
            return total + (item.productId?.price || 0) * item.quantity;
        }, 0);
    };

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );

    return (
        <div className="container mt-5 mb-5">
            <h2 className="mb-4 text-center fw-bold">Manage Orders <small className="text-muted fs-5">(Admin)</small></h2>

            <div className="table-responsive shadow-sm rounded">
                <table className="table table-hover align-middle mb-0">
                    <thead className="table-dark">
                        <tr>
                            <th>Order ID</th>
                            <th>User Info</th>
                            <th>Total Price</th>
                            <th>Current Status</th>
                            <th>Update Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order._id}>
                                <td>
                                    <small className="fw-bold">{order._id}</small><br />
                                    <small className="text-muted">{new Date(order.createdAt).toLocaleDateString()}</small>
                                </td>
                                <td>
                                    <div className="d-flex flex-column">
                                        <span className="fw-semibold">{order.userId?.name || order.userId?.username || "Unknown"}</span>
                                        <small className="text-muted">{order.userId?.email}</small>
                                    </div>
                                </td>
                                <td>
                                    <strong>₹{calculateTotal(order.products).toLocaleString()}</strong><br />
                                    <small className="text-muted">{order.products.length} Items</small>
                                </td>
                                <td>
                                    <span
                                        className={`badge rounded-pill px-3 py-2 ${order.status === "approved" || order.status === "delivered"
                                            ? "bg-success"
                                            : order.status === "shipped"
                                                ? "bg-info text-dark"
                                                : order.status === "processing"
                                                    ? "bg-primary"
                                                    : "bg-warning text-dark"
                                            }`}
                                    >
                                        {order.status.toUpperCase()}
                                    </span>
                                </td>
                                <td>
                                    <select
                                        className="form-select form-select-sm border-secondary"
                                        style={{ width: '130px' }}
                                        value={order.status}
                                        onChange={(e) => updateStatus(order._id, e.target.value)}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="approved">Approved</option>
                                        <option value="processing">Processing</option>
                                        <option value="shipped">Shipped</option>
                                        <option value="delivered">Delivered</option>
                                    </select>
                                </td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-outline-primary"
                                        onClick={() => setSelectedOrder(order)}
                                    >
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Admin Order Details Modal */}
            {selectedOrder && (
                <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header bg-dark text-white">
                                <h5 className="modal-title">Order Details <small className="opacity-75">#{selectedOrder._id}</small></h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setSelectedOrder(null)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="row mb-4">
                                    <div className="col-md-6 border-end">
                                        <h6 className="fw-bold text-primary">Customer & Shipping</h6>
                                        <p className="mb-1"><strong>Name:</strong> {selectedOrder.shippingAddress?.fullName}</p>
                                        <p className="mb-1"><strong>Email:</strong> {selectedOrder.userId?.email}</p>
                                        <p className="mb-1"><strong>Phone:</strong> {selectedOrder.shippingAddress?.phone}</p>
                                        <hr className="my-2" />
                                        <p className="mb-1 text-muted">{selectedOrder.shippingAddress?.address}</p>
                                        <p className="mb-0 text-muted">
                                            {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.pincode}
                                        </p>
                                    </div>
                                    <div className="col-md-6 ps-md-4">
                                        <h6 className="fw-bold text-primary">Order Status</h6>
                                        <div className="mb-3">
                                            <label className="form-label small text-muted">Update Status:</label>
                                            <select
                                                className="form-select"
                                                value={selectedOrder.status}
                                                onChange={(e) => updateStatus(selectedOrder._id, e.target.value)}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="approved">Approved</option>
                                                <option value="processing">Processing</option>
                                                <option value="shipped">Shipped</option>
                                                <option value="delivered">Delivered</option>
                                            </select>
                                        </div>
                                        <div className="d-flex justify-content-between border-top pt-2">
                                            <span className="h5">Total Amount:</span>
                                            <span className="h5 text-primary">₹{calculateTotal(selectedOrder.products).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <h6 className="fw-bold text-primary mb-3">Products Ordered ({selectedOrder.products.length})</h6>
                                <div className="list-group">
                                    {selectedOrder.products.map((item, index) => (
                                        <div key={index} className="list-group-item d-flex align-items-center p-2">
                                            <img
                                                src={item.productId?.image || "https://placehold.co/100"}
                                                alt={item.productId?.name}
                                                className="rounded object-fit-cover me-3"
                                                style={{ width: "50px", height: "50px" }}
                                            />
                                            <div className="flex-grow-1">
                                                <div className="d-flex justify-content-between">
                                                    <h6 className="mb-0">{item.productId?.name || "Product Unavailable"}</h6>
                                                    <span className="fw-bold">₹{((item.productId?.price || 0) * item.quantity).toLocaleString()}</span>
                                                </div>
                                                <small className="text-muted">
                                                    ₹{(item.productId?.price || 0).toLocaleString()} x {item.quantity} units
                                                </small>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setSelectedOrder(null)}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
