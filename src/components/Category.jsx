import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Category({ onChange }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // fetch list from backend
    axios
      .get(`${import.meta.env.VITE_API_URL}/category`)
      .then((res) => {
        setCategories(res.data);
      })
      .catch((err) => console.error("Error loading categories:", err));
  }, []);

  return (
    <select className="form-select" onChange={onChange}>
      <option value="">Select a category</option>

      {categories.map((cat) => (
        <option key={cat._id} value={cat._id}>
          {cat.name}
        </option>
      ))}
    </select>
  );
}
