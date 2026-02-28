import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CartProvider } from "./components/context/CartContext";
import axios from "axios";
import { toast } from "react-toastify";

import NavBar from "./components/Navbar.jsx";
import Cards from "./components/Cards.jsx";
import EditProduct from "./components/EditProduct.jsx";
import ProductForm from "./components/ProductForm.jsx";
import SearchProducts from "./components/SearchProducts.jsx";
// import Products from "./components/Products.jsx";
const Products = React.lazy(() => import("./components/Products.jsx"));
import ViewProduct from "./components/ViewProduct.jsx"; // ✅ Import ViewProduct
// import Login from "./components/Auth/Login.jsx";
const Login = React.lazy(() => import("./components/Auth/Login.jsx"));
import SignUp from "./components/Auth/SignUp.jsx";
import VerifyAccount from "./components/Auth/VerifyAccount.jsx";
import ForgotPassword from "./components/Auth/ForgotPassword.jsx";
import ProtectedRoute, { GuestRoute } from "./components/Auth/ProtectedRoute.jsx";
import Cart from "./components/cart/Cart.jsx";
import Checkout from "./components/checkout/Checkout.jsx";
import MyOrders from "./components/orders/MyOrders.jsx"; // ✅ Import MyOrders
import AdminOrders from "./components/admin/AdminOrders.jsx";
import AdminHome from "./components/admin/AdminHome.jsx";

function Layout() {

  const location = useLocation();
  const navigate = useNavigate();
  const hideNavbarRoutes = ["/login", "/register", "/forgot-password", "/verify-account"];

  // Global axios interceptor: auto-logout on 401 (token expired)
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          toast.error("Session expired. Please log in again.");
          navigate("/login", { replace: true });
        }
        return Promise.reject(error);
      }
    );

    // Cleanup interceptor on unmount
    return () => axios.interceptors.response.eject(interceptor);
  }, [navigate]);

  return (
    <>
      {!hideNavbarRoutes.includes(location.pathname) && <NavBar />}

      <React.Suspense
        fallback={
          <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="spinner-border text-primary"></div>
          </div>
        }
      >
        <Routes>

          <Route path="/" element={<Products />} />
          <Route path="/view-product/:id" element={<ViewProduct />} /> {/* ✅ Add Route */}
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<SignUp />} />
            <Route path="/verify-account" element={<VerifyAccount />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["user", "admin"]} />}>
            <Route path="/search" element={<SearchProducts />} />
            <Route path="/addcart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/my-orders" element={<MyOrders />} /> {/* ✅ User Orders */}
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin" element={<AdminHome />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/products" element={<Cards />} />
            <Route path="/edit/:id" element={<EditProduct />} />
            <Route path="/add-product" element={<ProductForm />} />
          </Route>

        </Routes>
      </React.Suspense>

      {/* ✅ VERY IMPORTANT */}
      <ToastContainer position="top-right" autoClose={2000} />

    </>
  );
}

function App() {
  return (
    <CartProvider>
      <Router>
        <Layout />
      </Router>
    </CartProvider>
  );
}

export default App;
