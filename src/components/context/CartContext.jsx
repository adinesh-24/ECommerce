import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const CartContext = createContext();

export const CartProvider = ({ children }) => {

  const [cart, setCart] = useState([]);

  // Fetch Cart
  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get(`${import.meta.env.VITE_API_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(res.data || []);
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  React.useEffect(() => {
    fetchCart();
  }, []);

  // ✅ ADD TO CART FUNCTION
  const addToCart = async (productId) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login to add items to cart! 🛒");
        return;
      }

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/cart`,
        { productId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCart(res.data.data ? [...cart, res.data.data] : res.data); // Adjust based on API structure
      fetchCart(); // Refresh to ensure sync
      toast.success("Added to cart successfully! ✅");

    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to add to cart ❌");
    }
  };

  return (
    <CartContext.Provider value={{ cart, cartCount: cart.length, addToCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

// custom hook
export const useCart = () => useContext(CartContext);
