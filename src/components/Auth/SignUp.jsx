import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function SignUp() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ username: "", email: "", password: "" });
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();

        if (form.password !== confirmPassword) {
            toast.error("Passwords do not match. Please check and try again.");
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/register`, form);

            if (res.data.token) {
                localStorage.setItem("token", res.data.token);
                toast.success("Account created! Welcome to our store.");
                navigate("/", { replace: true });
            } else {
                toast.success(res.data.message || "Account created! You can now login.");
                navigate("/login");
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const eyeIconStyle = {
        position: "absolute",
        right: "12px",
        top: "50%",
        transform: "translateY(-50%)",
        cursor: "pointer",
        color: "#000",
        background: "none",
        border: "none",
        padding: 0,
        display: "flex",
        alignItems: "center",
    };

    const EyeOpen = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#000" viewBox="0 0 16 16">
            <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
            <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
        </svg>
    );

    const EyeClosed = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#000" viewBox="0 0 16 16">
            <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z" />
            <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z" />
            <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z" />
        </svg>
    );

    const passwordsMatch = confirmPassword === "" || form.password === confirmPassword;

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

                    {/* Password Field */}
                    <div className="mb-3">
                        <label className="form-label fw-semibold small">Password</label>
                        <div style={{ position: "relative" }}>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                className="form-control rounded-3"
                                placeholder=""
                                value={form.password}
                                onChange={handleChange}
                                required
                                style={{ paddingRight: "40px" }}
                            />
                            <button
                                type="button"
                                style={eyeIconStyle}
                                onClick={() => setShowPassword(v => !v)}
                                tabIndex={-1}
                                aria-label="Toggle password visibility"
                            >
                                {showPassword ? <EyeOpen /> : <EyeClosed />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password Field */}
                    <div className="mb-4">
                        <label className="form-label fw-semibold small">Confirm Password</label>
                        <div style={{ position: "relative" }}>
                            <input
                                type={showConfirm ? "text" : "password"}
                                name="confirmPassword"
                                className={`form-control rounded-3 ${confirmPassword && !passwordsMatch ? "is-invalid" : confirmPassword && passwordsMatch ? "is-valid" : ""}`}
                                placeholder=""
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                required
                                style={{ paddingRight: "40px" }}
                            />
                            <button
                                type="button"
                                style={eyeIconStyle}
                                onClick={() => setShowConfirm(v => !v)}
                                tabIndex={-1}
                                aria-label="Toggle confirm password visibility"
                            >
                                {showConfirm ? <EyeOpen /> : <EyeClosed />}
                            </button>
                        </div>
                        {confirmPassword && !passwordsMatch && (
                            <div className="text-danger small mt-1">Passwords do not match.</div>
                        )}
                        {confirmPassword && passwordsMatch && (
                            <div className="text-success small mt-1">Passwords match ✓</div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-100 rounded-pill fw-semibold py-2"
                        disabled={loading || !passwordsMatch || !confirmPassword}
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
