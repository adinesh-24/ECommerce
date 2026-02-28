import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useCart } from "./context/CartContext";

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);

    // Re-check token on every route change
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) { setUser(null); return; }
        try {
            setUser(jwtDecode(token));
        } catch {
            setUser(null);
        }
    }, [location.pathname]);

    const [searchTerm, setSearchTerm] = useState("");

    const handleLogout = () => {
        localStorage.removeItem("token");
        setUser(null);
        navigate("/login");
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
            setSearchTerm("");
        }
    };

    return (
        <nav className="navbar navbar-expand-lg custom-navbar sticky-top">
            <div className="container-fluid">

                {/* Brand */}
                <NavLink className="navbar-brand fw-bold" to="/">E-Commerce</NavLink>

                {/* Mobile toggler */}
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarMain"
                >
                    <span className="navbar-toggler-icon" />
                </button>

                <div className="collapse navbar-collapse" id="navbarMain">

                    {/* Left links */}
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">

                        {/* Dashboard (admin) OR Home (user/guest) */}
                        {user?.role === "admin" ? (
                            <li className="nav-item">
                                <NavLink to="/admin" className="nav-link">📊 Dashboard</NavLink>
                            </li>
                        ) : (
                            <li className="nav-item">
                                <NavLink to="/" className="nav-link">Home</NavLink>
                            </li>
                        )}

                        {/* Admin-only links */}
                        {user?.role === "admin" && (
                            <>
                                <li className="nav-item">
                                    <NavLink to="/products" className="nav-link">Cards</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink to="/add-product" className="nav-link">Add Product</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink to="/admin/orders" className="nav-link">Manage Orders</NavLink>
                                </li>
                            </>
                        )}

                        {/* Shared links */}
                        <li className="nav-item">
                            <NavLink to="/search" className="nav-link">Search Products</NavLink>
                        </li>

                        {user && (
                            <>
                                <li className="nav-item">
                                    <NavLink to="/my-orders" className="nav-link">My Orders</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink to="/addcart" className="nav-link">🛒 Cart</NavLink>
                                </li>
                            </>
                        )}

                    </ul>


                    {/* Right: auth */}
                    <div className="d-flex align-items-center gap-2">
                        {!user ? (
                            <>
                                <NavLink to="/register" className="btn btn-primary btn-sm">Sign Up</NavLink>
                                <NavLink to="/login" className="btn btn-outline-primary btn-sm">Login</NavLink>
                            </>
                        ) : (
                            <>
                                <div className="user-badge">
                                    <span>👋 {user.username || user.email?.split("@")[0]}</span>
                                    <span className="role-badge">{user.role || "user"}</span>
                                </div>
                                <button onClick={handleLogout} className="btn btn-danger btn-sm ms-2">
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
