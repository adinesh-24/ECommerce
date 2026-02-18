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
    price: ""
  });

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
          price: product.price || ""
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

  // ✅ Submit update
  const handleSubmit = async (e) => {

    e.preventDefault();
    setUpdating(true);

    try {

      const token = localStorage.getItem("token");

      await axios.put(
        `${import.meta.env.VITE_API_URL}/updateProduct/${id}`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`
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
                  <input
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="form-control"
                  />
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
