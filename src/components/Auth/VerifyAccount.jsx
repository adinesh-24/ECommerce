import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from "react-toastify";

const API = import.meta.env.VITE_API_URL;

export default function VerifyAccount() {
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Get email from location state (passed from SignUp.jsx)
        if (location.state?.email) {
            setEmail(location.state.email);
        } else {
            // If no email in state, redirect back to signup
            toast.error("Please sign up first");
            navigate("/register");
        }
    }, [location.state, navigate]);

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(`${API}/api/verify-registration`, { email, otp });
            toast.success("Account verified successfully! You can now log in.");
            navigate("/login");
        } catch (err) {
            toast.error(err.response?.data?.message || "Invalid OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setLoading(true);
        try {
            // We can reuse the register logic or a separate endpoint if we add one later
            // For now, let's assume the user can re-register if the OTP expires or use forgot password
            // But a simple way is to just call a resend endpoint if we had one.
            // Since we don't have a dedicated resend for registration yet, let's just show a message.
            toast.info("If you didn't receive an OTP, please try signing up again or contact support.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh", background: "#f8fafc" }}>
            <div className="card border-0 shadow-sm rounded-4 p-4" style={{ width: "100%", maxWidth: 420 }}>
                <h4 className="fw-bold text-center mb-1">Verify Your Email</h4>
                <p className="text-center text-muted small mb-4">
                    Enter the 6-digit OTP sent to <strong>{email}</strong>
                </p>

                <form onSubmit={handleVerifyOtp}>
                    <div className="mb-3">
                        <label className="form-label fw-semibold small">Verification Code (OTP)</label>
                        <input
                            type="text"
                            className="form-control rounded-3 text-center fs-4 fw-bold"
                            placeholder="000000"
                            maxLength={6}
                            value={otp}
                            onChange={e => setOtp(e.target.value)}
                            required
                        />
                        <div className="form-text text-center mt-2">The code is valid for 10 minutes.</div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-100 rounded-pill fw-semibold py-2"
                        disabled={loading || otp.length !== 6}
                    >
                        {loading ? <span className="spinner-border spinner-border-sm me-2" /> : null}
                        {loading ? "Verifying..." : "Verify Account"}
                    </button>

                    <button
                        type="button"
                        className="btn btn-link w-100 mt-3 small text-decoration-none"
                        onClick={handleResendOtp}
                        disabled={loading}
                    >
                        Didn't receive a code?
                    </button>

                    <p className="text-center text-muted small mt-3 mb-0">
                        Back to <Link to="/register" className="fw-semibold text-primary text-decoration-none">Sign Up</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
