import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import bcrypt from "bcryptjs";

const SignUp = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");
    setSuccess("");

    // ✅ CHECK PASSWORD MATCH
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {

      // ✅ HASH PASSWORD
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(formData.password, salt);

      const newUser = {
        username: formData.username,
        email: formData.email,
        password: hashedPassword
      };

      // ✅ REGISTER USER
      const registerRes = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/register`,
        newUser,
        {
          headers: { "Content-Type": "application/json" }
        }
      );

      console.log("REGISTER SUCCESS:", registerRes.data);

      // ✅ SEND EMAIL
      await axios.post(
        `${import.meta.env.VITE_API_URL}/mailer/send-email`,
        {
          to: formData.email,
          subject: "Account Created Successfully",
          message: `Hello ${formData.username}, your account created successfully. ${formData.email} is registered with us.`
        }
      );

      setSuccess("✅ Account created successfully. Email sent to your inbox.");

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {

      console.error("SIGNUP ERROR", err);

      if (err.response) {
        setError(err.response.data.message);
      } else {
        setError("Server not reachable");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex justify-content-center align-items-center bg-light">

      <div className="card shadow-lg border-0 rounded-4 p-4" style={{ width: "400px" }}>

        <h2 className="fw-bold mb-3 text-center">Sign up</h2>

        {error && <div className="alert alert-danger py-2">{error}</div>}
        {success && <div className="alert alert-success py-2">{success}</div>}

        <form onSubmit={handleSubmit}>

          {/* USERNAME */}
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-control form-control-lg"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
              disabled={loading}
            />
          </div>

          {/* EMAIL */}
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control form-control-lg"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              disabled={loading}
            />
          </div>

          {/* PASSWORD WITH EYE ICON */}
          <div className="mb-3">
            <label className="form-label">Password</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control form-control-lg"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                disabled={loading}
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
              >
                👁
              </button>
            </div>
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="mb-4">
            <label className="form-label">Confirm Password</label>
            <div className="input-group">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="form-control form-control-lg"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                disabled={loading}
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                👁
              </button>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            className="btn btn-primary w-100 py-2 rounded-pill fw-semibold"
            disabled={loading}
          >
            {loading ? "Registering..." : "Sign up"}
          </button>

        </form>

      </div>

    </div>
  );
};

export default SignUp;
