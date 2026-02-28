import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Cart() {

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  // ================= FETCH CART =================

  const fetchCart = async () => {
    try {
      const res = await api.get("/cart");
      setCart(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // ================= UPDATE QTY =================

  const updateQty = async (id, qty) => {

    if (qty < 1) return;

    try {

      await api.put(`/cart/${id}`, {
        quantity: qty
      });

      setCart(prev =>
        prev.map(item =>
          item._id === id
            ? {
              ...item,
              quantity: qty,
              totalPrice: qty * item.price
            }
            : item
        )
      );

    } catch (err) {
      console.log(err);
    }
  };

  // ================= REMOVE =================

  const removeItem = async (id) => {
    try {

      await api.delete(`/cart/${id}`);

      setCart(prev => prev.filter(item => item._id !== id));

    } catch (err) {
      console.log(err);
    }
  };

  // ================= TOTAL =================

  const grandTotal = cart.reduce(
    (sum, item) => sum + item.totalPrice,
    0
  );

  // ================= CHECKOUT =================

  const handleCheckout = () => {

    // example navigate to checkout page
    navigate("/checkout");

    // OR call payment API here
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="spinner-border text-primary"></div>
    </div>
  );

  return (
    <div className="container mt-4 mb-5">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
            <div className="card-header bg-white py-3 border-bottom">
              <h4 className="mb-0 fw-bold">🛒 Shopping Bag</h4>
            </div>

            <div className="card-body p-0">
              {cart.length > 0 ? (
                <>
                  <div className="table-responsive d-none d-md-block">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="bg-light text-muted small text-uppercase fw-bold">
                        <tr>
                          <th className="ps-4 border-0">Product</th>
                          <th className="border-0">Price</th>
                          <th className="border-0">Quantity</th>
                          <th className="border-0 text-end pe-4">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cart.map((item) => (
                          <tr key={item._id}>
                            <td className="ps-4 py-3">
                              <div className="d-flex align-items-center gap-3">
                                <button
                                  className="btn btn-sm btn-outline-danger border-0 p-1"
                                  onClick={() => removeItem(item._id)}
                                  title="Remove"
                                >
                                  ✕
                                </button>
                                <img
                                  src={item.product.image || "https://placehold.co/80"}
                                  alt={item.product.title}
                                  className="rounded-3 shadow-sm"
                                  style={{ width: "60px", height: "60px", objectFit: "cover" }}
                                  onError={(e) => { e.target.src = "https://placehold.co/80"; }}
                                />
                                <div>
                                  <h6 className="mb-0 fw-bold">{item.product.title}</h6>
                                  <small className="text-muted">{item.product.category}</small>
                                </div>
                              </div>
                            </td>
                            <td>₹{item.product.price}</td>
                            <td>
                              <div className="d-flex align-items-center gap-2 bg-light rounded-pill px-2 w-fit-content" style={{ width: "fit-content" }}>
                                <button
                                  className="btn btn-sm border-0 p-1"
                                  onClick={() => updateQty(item._id, item.quantity - 1)}
                                >
                                  -
                                </button>
                                <span className="px-2 small fw-bold">{item.quantity}</span>
                                <button
                                  className="btn btn-sm border-0 p-1"
                                  onClick={() => updateQty(item._id, item.quantity + 1)}
                                >
                                  +
                                </button>
                              </div>
                            </td>
                            <td className="text-end pe-4 fw-bold text-primary">₹{item.totalPrice}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile View */}
                  <div className="d-md-none p-3">
                    {cart.map((item) => (
                      <div key={item._id} className="card border-0 bg-light rounded-4 p-3 mb-3">
                        <div className="d-flex gap-3">
                          <img
                            src={item.product.image || "https://placehold.co/80"}
                            alt={item.product.title}
                            className="rounded-3"
                            style={{ width: "80px", height: "80px", objectFit: "cover" }}
                            onError={(e) => { e.target.src = "https://placehold.co/80"; }}
                          />
                          <div className="flex-grow-1 overflow-hidden">
                            <div className="d-flex justify-content-between align-items-start">
                              <h6 className="mb-1 text-truncate pe-2 fw-bold">{item.product.title}</h6>
                              <button
                                className="btn btn-sm text-danger p-0"
                                onClick={() => removeItem(item._id)}
                              >
                                ✕
                              </button>
                            </div>
                            <small className="text-muted d-block mb-2">{item.product.category}</small>
                            <div className="d-flex justify-content-between align-items-center">
                              <div className="d-flex align-items-center gap-2 bg-white rounded-pill px-2 shadow-sm">
                                <button
                                  className="btn btn-sm border-0 p-1"
                                  onClick={() => updateQty(item._id, item.quantity - 1)}
                                >
                                  -
                                </button>
                                <span className="px-2 small fw-bold">{item.quantity}</span>
                                <button
                                  className="btn btn-sm border-0 p-1"
                                  onClick={() => updateQty(item._id, item.quantity + 1)}
                                >
                                  +
                                </button>
                              </div>
                              <span className="fw-bold text-primary">₹{item.totalPrice}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 bg-light border-top">
                    <div className="row align-items-center justify-content-between g-3">
                      <div className="col-md-4 text-center text-md-start">
                        <h4 className="mb-0 fw-bold">Grand Total: <span className="text-primary">₹{grandTotal}</span></h4>
                        <small className="text-muted">Taxes and shipping calculated at checkout</small>
                      </div>
                      <div className="col-md-4 text-center text-md-end">
                        <button
                          className="btn btn-dark px-4 py-2 rounded-pill fw-semibold w-100 shadow-sm"
                          onClick={handleCheckout}
                        >
                          Checkout →
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-5">
                  <div className="mb-3" style={{ fontSize: "5rem" }}>📦</div>
                  <h4 className="fw-bold">Your bag is empty</h4>
                  <p className="text-muted mb-4">Looks like you haven't added anything to your cart yet.</p>
                  <button
                    className="btn btn-primary rounded-pill px-4 py-2"
                    onClick={() => navigate("/")}
                  >
                    Start Shopping
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
