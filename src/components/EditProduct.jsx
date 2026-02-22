import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function EditProduct() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    image: null,
    currentImage: ""
  });

  const [imagePreview, setImagePreview] = useState(null);

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // ✅ Fetch product data
  useEffect(() => {

    const fetchProduct = async () => {

      try {

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/products/${id}`
        );

        const product = Array.isArray(res.data)
          ? res.data[0]
          : res.data.data || res.data;

        setForm({
          title: product.title || "",
          description: product.description || "",
          category: product.category || "",
          price: product.price || "",
          currentImage: product.image || ""
        });

      } catch (err) {

        console.log("Fetch error:", err);
        toast.error("Failed to load product ❌");

      } finally {
        setLoading(false);
      }

    };

    fetchProduct();

  }, [id]);

  // ✅ Handle input change
  const handleChange = (e) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // ✅ Handle file change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setForm(prev => ({
      ...prev,
      image: file
    }));

    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // ✅ Submit update
  const handleSubmit = async (e) => {

    e.preventDefault();
    setUpdating(true);

    try {

      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("category", form.category);
      formData.append("price", form.price);
      if (form.image) {
        formData.append("image", form.image);
      }

      await axios.put(
        `${import.meta.env.VITE_API_URL}/updateProduct/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      toast.success("Product updated successfully ✅");

      // small delay so user sees toast
      setTimeout(() => {
        navigate("/products");
      }, 1000);

    } catch (err) {

      console.log(err);

      toast.error(
        err.response?.data?.message ||
        "Update failed ❌"
      );

    } finally {
      setUpdating(false);
    }

  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border"></div>
      </div>
    );
  }

  return (
    <div className="container mt-5">

      <div className="row justify-content-center">

        <div className="col-lg-6">

          <div className="card shadow">

            <div className="card-body">

              <h3 className="text-center mb-4">
                Edit Product
              </h3>

              <form onSubmit={handleSubmit}>

                {/* Title */}
                <div className="mb-3">
                  <label className="form-label">
                    Title
                  </label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>

                {/* Description */}
                <div className="mb-3">
                  <label className="form-label">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    className="form-control"
                    rows="3"
                  />
                </div>

                {/* Category */}
                <div className="mb-3">
                  <label className="form-label">
                    Category
                  </label>
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

                {/* Price */}
                <div className="mb-4">
                  <label className="form-label">
                    Price
                  </label>
                  <input
                    name="price"
                    type="number"
                    value={form.price}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>

                {/* Image Upload */}
                {/* Current Image Display */}
                <div className="mb-3">
                  <label className="form-label">Current Image</label>
                  <div className="mb-2">
                    {form.currentImage ? (
                      <img
                        src={form.currentImage.startsWith('http') ? form.currentImage : `${import.meta.env.VITE_API_URL}/uploads/${form.currentImage}`}
                        alt="Current Product"
                        className="img-thumbnail"
                        style={{ maxWidth: "200px", maxHeight: "200px" }}
                      />
                    ) : (
                      <p className="text-muted">No image available</p>
                    )}
                  </div>
                </div>

                {/* Upload New Image */}
                <div className="mb-4">
                  <label className="form-label">Upload New Image</label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={handleFileChange}
                  />

                  {/* New Image Preview */}
                  {imagePreview && (
                    <div className="mt-3 fade-in">
                      <p className="mb-1 text-muted small">New Image Preview:</p>
                      <img
                        src={imagePreview}
                        alt="New Preview"
                        className="img-thumbnail"
                        style={{ maxWidth: "200px", maxHeight: "200px" }}
                      />
                    </div>
                  )}
                </div>

                <button
                  className="btn btn-primary w-100"
                  disabled={updating}
                >
                  {updating ? "Updating..." : "Update Product"}
                </button>

              </form>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
