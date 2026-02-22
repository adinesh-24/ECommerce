import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const CartContext = createContext();

export const CartProvider = ({ children }) => {

  const [cart, setCart] = useState([]);

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

      setCart(res.data); // update cart state
      toast.success("Added to cart successfully! ✅");

    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to add to cart ❌");
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};

// custom hook
export const useCart = () => useContext(CartContext);
