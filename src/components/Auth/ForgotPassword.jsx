import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const API = import.meta.env.VITE_API_URL;

export default function ForgotPassword() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    // Step 1: Send OTP
    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(`${API}/api/forgot-password`, { email });
            toast.success("OTP sent to your email");
            setStep(2);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Verify OTP
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(`${API}/api/verify-otp`, { email, otp });
            toast.success("OTP verified");
            setStep(3);
        } catch (err) {
            toast.error(err.response?.data?.message || "Invalid OTP");
        } finally {
            setLoading(false);
        }
    };

    // Step 3: Reset Password
    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }
        setLoading(true);
        try {
            await axios.post(`${API}/api/reset-password`, { email, otp, newPassword });
            toast.success("Password reset successful. Please log in.");
            navigate("/login");
        } catch (err) {
            toast.error(err.response?.data?.message || "Password reset failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh", background: "#f8fafc" }}>
            <div className="card border-0 shadow-sm rounded-4 p-4" style={{ width: "100%", maxWidth: 420 }}>

                <h4 className="fw-bold text-center mb-1">Forgot Password</h4>
                <p className="text-center text-muted small mb-4">
                    {step === 1 && "Enter your registered email to receive an OTP."}
                    {step === 2 && "Enter the 6-digit OTP sent to your email."}
                    {step === 3 && "Set a new password for your account."}
                </p>

                {/* Step indicator */}
                <div className="d-flex justify-content-center gap-2 mb-4">
                    {[1, 2, 3].map(s => (
                        <div
                            key={s}
                            style={{
                                width: 28,
                                height: 28,
                                borderRadius: "50%",
                                background: step >= s ? "#0d6efd" : "#dee2e6",
                                color: step >= s ? "#fff" : "#6c757d",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 13,
                                fontWeight: 600
                            }}
                        >
                            {s}
                        </div>
                    ))}
                </div>

                {/* Step 1: Email */}
                {step === 1 && (
                    <form onSubmit={handleSendOtp}>
                        <div className="mb-3">
                            <label className="form-label fw-semibold small">Email</label>
                            <input
                                type="email"
                                className="form-control rounded-3"
                                placeholder=""
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary w-100 rounded-pill fw-semibold py-2"
                            disabled={loading}
                        >
                            {loading ? <span className="spinner-border spinner-border-sm me-2" /> : null}
                            {loading ? "Sending OTP..." : "Send OTP"}
                        </button>
                    </form>
                )}

                {/* Step 2: OTP */}
                {step === 2 && (
                    <form onSubmit={handleVerifyOtp}>
                        <div className="mb-3">
                            <label className="form-label fw-semibold small">OTP</label>
                            <input
                                type="text"
                                className="form-control rounded-3"
                                placeholder=""
                                maxLength={6}
                                value={otp}
                                onChange={e => setOtp(e.target.value)}
                                required
                            />
                            <div className="form-text">OTP is valid for 10 minutes.</div>
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary w-100 rounded-pill fw-semibold py-2"
                            disabled={loading}
                        >
                            {loading ? <span className="spinner-border spinner-border-sm me-2" /> : null}
                            {loading ? "Verifying..." : "Verify OTP"}
                        </button>
                        <button
                            type="button"
                            className="btn btn-link w-100 mt-2 small text-decoration-none"
                            onClick={() => setStep(1)}
                        >
                            Back
                        </button>
                    </form>
                )}

                {/* Step 3: New Password */}
                {step === 3 && (
                    <form onSubmit={handleResetPassword}>
                        <div className="mb-3">
                            <label className="form-label fw-semibold small">New Password</label>
                            <input
                                type="password"
                                className="form-control rounded-3"
                                placeholder=""
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="form-label fw-semibold small">Confirm Password</label>
                            <input
                                type="password"
                                className="form-control rounded-3"
                                placeholder=""
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary w-100 rounded-pill fw-semibold py-2"
                            disabled={loading}
                        >
                            {loading ? <span className="spinner-border spinner-border-sm me-2" /> : null}
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>
                    </form>
                )}

                <p className="text-center text-muted small mt-3 mb-0">
                    Remember your password?{" "}
                    <Link to="/login" className="fw-semibold text-primary text-decoration-none">Login</Link>
                </p>
            </div>
        </div>
    );
}
