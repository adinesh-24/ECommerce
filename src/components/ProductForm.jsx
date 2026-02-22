import React, { useState } from "react";
import axios from "axios";

export default function ProductForm() {

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    image: null   // file input needs to be handled separately in FormData
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ Handle text input
  const handleChange = (e) => {

    setForm({
      ...form, // spread previous state
      [e.target.name]: e.target.value // update only the changed field
    });

  };

  // ✅ Handle file input
  const handleFileChange = (e) => {

    setForm({
      ...form, // spread previous state
      image: e.target.files[0] // store the selected file (first one) in state 
    });

  };

  // ✅ Submit form
  const handleSubmit = async (e) => {

    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {

      const token = localStorage.getItem("token");

      //  IMPORTANT → FormData for multer
      const formData = new FormData(); // create FormData instance
      //FormData is a built-in JavaScript object.
      formData.append("title", form.title);
      // formData.append(key, value); append text fields to FormData  
      //frontend sends: title = "some value", 
      // form.title =''(This is the value from your React state.)
      formData.append("description", form.description);
      formData.append("category", form.category);
      formData.append("price", form.price);
      formData.append("image", form.image); // file

      await axios.post(
        `${import.meta.env.VITE_API_URL}/addProducts`, // ✅ Use env variable
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // send token in Authorization header
            "Content-Type": "multipart/form-data"
          }
        }
      );

      setMessage("Product created successfully");

      setForm({
        title: "",
        description: "",
        category: "",
        price: "",
        image: null
      });

    } catch (error) {

      console.error(error);

      setMessage(
        error.response?.data?.message ||
        "Failed to create product"
      );

    } finally {
      setLoading(false);
    }

  };

  return (
    <div className="container mt-5">

      <div className="row justify-content-center">

        <div className="col-lg-6">

          <div className="card shadow">

            <div className="card-body">

              <h3 className="text-center mb-4">
                Create Product
              </h3>

              {message && (
                <div className="alert alert-info">
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit}>

                <div className="mb-3">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    name="title"
                    className="form-control"
                    value={form.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    name="description"
                    className="form-control"
                    value={form.description}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Category</label>
                  <select
                    name="category"
                    className="form-select"
                    value={form.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Category</option>
                    {[
                      "mobile",
                      "laptop",
                      "tablet",
                      "smartwatch",
                      "accessories",
                      "headphones",
                      "camera",
                      "gaming",
                      "monitor",
                      "keyboard",
                      "mouse",
                      "speaker",
                      "tv",
                      "electronics",
                      "home-appliances",
                      "wearables",
                      "storage-devices",
                      "networking"
                    ].map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Price</label>
                  <input
                    type="number"
                    name="price"
                    className="form-control"
                    value={form.price}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* ✅ FILE UPLOAD */}
                <div className="mb-4">
                  <label className="form-label">Product Image</label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={handleFileChange}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create Product"}
                </button>

              </form>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
