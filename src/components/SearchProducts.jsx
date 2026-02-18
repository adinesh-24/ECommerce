import React, { useEffect, useState } from "react";
import axios from "axios";
import { configDotenv } from "dotenv";
export default function SearchProducts() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // 1️⃣ Fetch all products when page loads
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/products`)
      .then((response) => {
        setProducts(response.data || []);
        console.log("Fetched products:", response.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  // 2️⃣ Filter products by title
  // If searchTerm is empty → show all products
  const filteredProducts = products.filter((product) =>
    (product.title || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <h2>Search Products</h2>

      {/* Search box */}
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search by product title..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Show message ONLY when searching and no result */}
      {filteredProducts.length === 0 && searchTerm !== "" && (
        <p>No products found</p>
      )}

      {/* 3️⃣ Show ALL or FILTERED cards */}
      {filteredProducts.map((product) => (
        <div key={product._id} className="card mb-2 p-3">
          <h5>{product.title}</h5>
          <p>Category: {product.category}</p>
          <p>Price: ₹{product.price}</p>
        </div>
      ))}
    </div>
  );
}
