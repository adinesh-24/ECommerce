import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CartProvider } from "./components/context/CartContext"; // ✅ Import Provider

import NavBar from "./components/Navbar.jsx";
import Cards from "./components/Cards.jsx";
import EditProduct from "./components/EditProduct.jsx";
import ProductForm from "./components/ProductForm.jsx";
import SearchProducts from "./components/SearchProducts.jsx";
import Products from "./components/Products.jsx";
import ViewProduct from "./components/ViewProduct.jsx"; // ✅ Import ViewProduct
import Login from "./components/Auth/Login.jsx";
import SignUp from "./components/Auth/SignUp.jsx";
import ProtectedRoute from "./components/Auth/ProtectedRoute.jsx";
import Cart from "./components/cart/Cart.jsx";
import Checkout from "./components/checkout/Checkout.jsx";

function Layout() {

  const location = useLocation();
  const hideNavbarRoutes = ["/login", "/register"];

  return (
    <>
      {!hideNavbarRoutes.includes(location.pathname) && <NavBar />}

      <Routes>

        <Route path="/" element={<Products />} />
        <Route path="/view-product/:id" element={<ViewProduct />} /> {/* ✅ Add Route */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SignUp />} />

        <Route element={<ProtectedRoute allowedRoles={["user", "admin"]} />}>
          <Route path="/search" element={<SearchProducts />} />
          <Route path="/addcart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/products" element={<Cards />} />
          <Route path="/edit/:id" element={<EditProduct />} />
          <Route path="/add-product" element={<ProductForm />} />
        </Route>

      </Routes>

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
