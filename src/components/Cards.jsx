import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Cards() {

  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch products
  useEffect(() => {

    axios
      .get(`${import.meta.env.VITE_API_URL}/products`) // ✅ Use env variable
      .then((response) => {
        setCards(Array.isArray(response.data) ? response.data : []);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to load products");
        setLoading(false);
      });

  }, []);

  // ✅ Delete product
  const handleDelete = async (id) => {

    try {

      const token = localStorage.getItem("token");

      await axios.delete(
        `${import.meta.env.VITE_API_URL}/deleteProduct/${id}`, // ✅ Use env variable
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // remove deleted item from UI
      setCards(prev =>
        prev.filter(item => item._id !== id)
      );

      toast.success("Product deleted successfully ✅");

    } catch (error) {
      console.error("Delete failed:", error.response?.data || error);
      toast.error("Unauthorized or delete failed ❌");
    }
  };

  // ✅ Loading UI
  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border"></div>
      </div>
    );
  }

  return (
    <div className="container mt-4">

      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={2000} />

      <h2 className="text-center mb-4">
        Products
      </h2>

      <div className="row justify-content-center gap-4">

        {cards.map((item) => (

          <div
            className="col-lg-3 col-md-4 col-sm-6 mb-4"
            key={item._id}
          >

            <div className="card h-100 shadow-sm">

              <div className="card-body text-center">

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
                    height: "3rem"
                  }}
                >
                  {item.description}
                </p>

                <p className="fw-bold text-primary">
                  ₹{item.price}
                </p>

                <div className="d-flex justify-content-center gap-2">

                  <Link
                    to={`/edit/${item._id}`}
                    className="btn btn-success btn-sm"
                  >
                    Edit
                  </Link>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(item._id)}
                  >
                    Delete
                  </button>

                </div>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}
