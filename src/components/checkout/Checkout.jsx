import React, { useEffect, useState } from "react";
import axios from "axios";
import Address from "./Address"; // ✅ Import Address component

export default function Checkout() {
  const [cart, setCart] = useState([]);
  const [addresses, setAddresses] = useState([]); // List of addresses
  const [selectedAddressId, setSelectedAddressId] = useState(null); // Selected address ID
  const [showAddressForm, setShowAddressForm] = useState(false); // Toggle form
  const [editingAddress, setEditingAddress] = useState(null); // Address being edited

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

  // handle Add/Update Address
  const handleAddressSubmit = async (addressData) => {
    try {
      if (editingAddress) {
        // Update
        const res = await axios.put(
          `${import.meta.env.VITE_API_URL}/address/${editingAddress._id}`,
          addressData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        // Update list
        setAddresses(prev => prev.map(addr => addr._id === editingAddress._id ? res.data : addr));
      } else {
        // Add
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/address`,
          addressData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        // Add to list
        setAddresses(prev => [...prev, res.data]);
      }
      // Reset
      setShowAddressForm(false);
      setEditingAddress(null);
    } catch (err) {
      console.error("Error saving address:", err);
    }
  };

  // Handle Delete
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
    if (!selectedAddressId) return alert("Please select an address");

    const selectedAddr = addresses.find(a => a._id === selectedAddressId);

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/orders`,
        { shippingAddress: selectedAddr },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Order placed successfully");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Checkout</h3>

      <div className="row">
        <div className="col-md-8">
          {/* Address Section */}
          <div className="card p-3 mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4>Shipping Address</h4>
              {!showAddressForm && (
                <button
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => {
                    setEditingAddress(null);
                    setShowAddressForm(true);
                  }}
                >
                  + Add New Address
                </button>
              )}
            </div>

            {/* Address Form */}
            {showAddressForm && (
              <Address
                onAddressSubmit={handleAddressSubmit}
                initialData={editingAddress}
                onCancel={() => {
                  setShowAddressForm(false);
                  setEditingAddress(null);
                }}
              />
            )}

            {/* Address List */}
            {!showAddressForm && (
              <div className="list-group">
                {addresses.map(addr => (
                  <div key={addr._id} className="list-group-item d-flex justify-content-between align-items-center">
                    <div className="d-flex gap-3 align-items-center">
                      <input
                        type="radio"
                        name="selectedAddress"
                        checked={selectedAddressId === addr._id}
                        onChange={() => setSelectedAddressId(addr._id)}
                        className="form-check-input mt-0"
                      />
                      <div>
                        <strong>{addr.fullName}</strong>
                        <div className="text-muted small">
                          {addr.address}, {addr.city}, {addr.state} - {addr.pincode}
                        </div>
                        <div className="text-muted small">Ph: {addr.phone}</div>
                      </div>
                    </div>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-light"
                        onClick={() => {
                          setEditingAddress(addr);
                          setShowAddressForm(true);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteAddress(addr._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                {addresses.length === 0 && <p className="text-muted text-center my-3">No saved addresses found.</p>}
              </div>
            )}
          </div>
        </div>

        <div className="col-md-4">
          {/* Order Summary */}
          <div className="card p-3">
            <h4>Order Summary</h4>
            <hr />
            {cart.map((item) => (
              <div key={item._id} className="d-flex justify-content-between mb-2 small">
                <span>{item.product?.title} (x{item.quantity})</span>
                <span>₹{(item.product?.price || 0) * item.quantity}</span>
              </div>
            ))}
            <hr />
            <h5 className="d-flex justify-content-between">
              <span>Total</span>
              <span>₹{total}</span>
            </h5>
            <button
              className="btn btn-primary w-100 mt-3"
              onClick={placeOrder}
              disabled={!selectedAddressId}
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
