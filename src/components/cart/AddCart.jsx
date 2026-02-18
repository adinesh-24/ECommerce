import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";

export default function Products() {

  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ get addToCart from context
  const { addToCart } = useCart();

  // ✅ Fetch products
  useEffect(() => {

    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/products`
        );
        setCards(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

  }, []);

  // ✅ Loader
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  return (

    <div className="container mt-4">

      <h1 className="text-center mb-4">Products</h1>

      <div className="row">

        {cards.map((item) => (

          <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={item._id}>

            <div className="card shadow-sm h-100">

              <div className="card-body text-center">

                <img
                  src={`${import.meta.env.VITE_API_URL}/uploads/${item.image}`}
                  alt={item.title}
                  className="img-fluid mb-2"
                  style={{ height: "200px", objectFit: "cover" }}
                />

                <h5>{item.title}</h5>
                <p>{item.description}</p>
                <p className="fw-bold text-primary">₹{item.price}</p>

                {/* ✅ Add To Cart Button */}
                <button
                  className="btn btn-primary"
                  onClick={() => addToCart(item._id)}
                >
                  Add To Cart
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>

  );
}
