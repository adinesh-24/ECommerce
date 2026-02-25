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

  if (loading) return <h3 className="text-center mt-5">Loading...</h3>;

  return (
    <div className="container mt-5">

      <div className="card p-4 shadow-sm">

        <h4 className="mb-4">Shopping Bag</h4>

        <div className="cart-items">
          {cart.map(item => (
            <div
              key={item._id}
              className="d-flex flex-column flex-md-row justify-content-between align-items-md-center border-bottom py-3 gap-3"
            >
              {/* LEFT SIDE: Image and Details */}
              <div className="d-flex align-items-center gap-3">
                <button
                  className="btn btn-sm btn-outline-danger border-0"
                  onClick={() => removeItem(item._id)}
                  title="Remove"
                >
                  ✕
                </button>

                <img
                  src={item.product.image || "https://placehold.co/80"}
                  alt={item.product.title}
                  style={{
                    width: "70px",
                    height: "70px",
                    objectFit: "cover",
                    borderRadius: "8px"
                  }}
                  onError={(e) => { e.target.src = "https://placehold.co/80"; }}
                />

                <div className="flex-grow-1">
                  <h6 className="mb-0 text-truncate" style={{ maxWidth: "200px" }}>
                    {item.product.title}
                  </h6>
                  <small className="text-muted d-block">
                    {item.product.category}
                  </small>
                  <small className="fw-bold d-md-none">₹{item.totalPrice}</small>
                </div>
              </div>

              {/* RIGHT SIDE: Controls and Price */}
              <div className="d-flex align-items-center justify-content-between justify-content-md-end gap-3 gap-md-4">
                <div className="d-flex align-items-center gap-2 bg-light rounded-pill px-2">
                  <button
                    className="btn btn-sm p-1"
                    onClick={() => updateQty(item._id, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span className="px-2 small fw-bold">{item.quantity}</span>
                  <button
                    className="btn btn-sm p-1"
                    onClick={() => updateQty(item._id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>

                <strong className="d-none d-md-block" style={{ minWidth: "80px", textAlign: "right" }}>
                  ₹{item.totalPrice}
                </strong>
              </div>
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center mt-4 gap-3">
          <h5 className="mb-0">Total: ₹{grandTotal}</h5>
          <button
            className="btn btn-dark px-5 py-2 rounded-pill fw-bold w-100 w-sm-auto"
            disabled={cart.length === 0}
            onClick={handleCheckout}
          >
            Checkout
          </button>
        </div>

      </div>

    </div>
  );
}
