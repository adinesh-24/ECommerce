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
    const [showPassword, setShowPassword] = useState(false);
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
                            <div style={{ position: "relative" }}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="form-control rounded-3"
                                    placeholder=""
                                    value={newPassword}
                                    onChange={e => setNewPassword(e.target.value)}
                                    required
                                    minLength={6}
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
