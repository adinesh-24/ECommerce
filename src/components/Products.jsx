import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // ✅ Import Link
import axios from "axios";
import { useCart } from "./context/CartContext"; // ✅ import useCart hook
import { configDotenv } from "dotenv";
export default function Products() {

  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  // const { addToCart } = useCart(); // ❌ Not needed here anymore

  // Fetch products
  useEffect(() => {

    axios
      .get(`${import.meta.env.VITE_API_URL}/products`)
      .then((response) => {
        setCards(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });

  }, []);

  // Loader
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
                  className="img-fluid mb-2 rounded"
                  style={{ height: "200px", width: "100%", objectFit: "cover" }}
                />

                <h5
                  className="card-title text-truncate"
                  style={{ maxWidth: "100%" }}
                  title={item.title}
                >
                  {item.title}
                </h5>
                <p
                  className="card-text text-muted"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    height: "3rem" // approx 2 lines
                  }}
                >
                  {item.description}
                </p>
                <p className="fw-bold text-primary">₹{item.price}</p>

                {/* ✅ LINK TO VIEW PRODUCT */}
                <Link
                  to={`/view-product/${item._id}`}
                  className="btn btn-primary"
                >
                  View Product
                </Link>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>

  );

}
