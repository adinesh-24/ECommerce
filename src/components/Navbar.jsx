import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function Navbar() {

  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);

  // ✅ Check login status when route changes
  useEffect(() => {

    const token = localStorage.getItem("token");

    if (!token) {
      setUser(null);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setUser(decoded);
    } catch (error) {
      console.log("Invalid token");
      setUser(null);
    }

  }, [location.pathname]); // only run when route changes

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-body-tertiary">
      <div className="container-fluid">

        {/* BRAND */}
        <NavLink className="navbar-brand fw-bold" to="/">
          E-Commerce
        </NavLink>

        {/* MOBILE TOGGLER */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* COLLAPSE CONTENT */}
        <div className="collapse navbar-collapse" id="navbarSupportedContent">

          {/* LEFT MENU */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">

            <li className="nav-item">
              <NavLink to="/" className="nav-link">
                Home
              </NavLink>
            </li>

            {user?.role === "admin" && (
              <li className="nav-item">
                <NavLink to="/products" className="nav-link">
                  Cards
                </NavLink>
              </li>
            )}

            {user?.role === "admin" && (
              <li className="nav-item">
                <NavLink to="/add-product" className="nav-link">
                  Add New Product
                </NavLink>
              </li>
            )}

            <li className="nav-item">
              <NavLink to="/search" className="nav-link">
                Search Products
              </NavLink>
            </li>

            {/* ✅ CART LINK */}
            {user && (
              <li className="nav-item">
                <NavLink to="/addcart" className="nav-link">
                  🛒 Cart
                </NavLink>
              </li>
            )}

          </ul>

          {/* RIGHT AUTH SECTION */}
          <div className="d-flex align-items-center gap-2">

            {!user ? (
              <>
                <NavLink to="/login" className="btn btn-outline-primary">
                  Login
                </NavLink>

                <NavLink to="/register" className="btn btn-primary">
                  Sign Up
                </NavLink>
              </>
            ) : (
              <>
                <span className="fw-semibold">
                  👋 {user.username || user.email || "User"}
                </span>

                <span className="fw-semibold ms-2">
                  👤 {user.role || "user"}
                </span>

                <button
                  onClick={handleLogout}
                  className="btn btn-danger ms-3"
                >
                  Logout
                </button>
              </>
            )}

          </div>

        </div>
      </div>
    </nav>
  );
}
