import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function SignUp() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ username: "", email: "", password: "" });
    const [loading, setLoading] = useState(false);

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/user/register`, form);
            toast.success("Account created! Please log in.");
            navigate("/login");
        } catch (err) {
            toast.error(err.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh", background: "#f8fafc" }}>
            <div className="card border-0 shadow-sm rounded-4 p-4" style={{ width: "100%", maxWidth: 420 }}>
                <h4 className="fw-bold text-center mb-4">Create Account</h4>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label fw-semibold small">Username</label>
                        <input
                            type="text"
                            name="username"
                            className="form-control rounded-3"
                            placeholder=""
                            value={form.username}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label fw-semibold small">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="form-control rounded-3"
                            placeholder=""
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="form-label fw-semibold small">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="form-control rounded-3"
                            placeholder=""
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary w-100 rounded-pill fw-semibold py-2"
                        disabled={loading}
                    >
                        {loading ? <span className="spinner-border spinner-border-sm me-2" /> : null}
                        {loading ? "Creating Account..." : "Sign Up"}
                    </button>
                </form>

                <p className="text-center text-muted small mt-3 mb-0">
                    Already have an account?{" "}
                    <Link to="/login" className="fw-semibold text-primary text-decoration-none">Login</Link>
                </p>
            </div>
        </div>
    );
}
