import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "./context/CartContext";

export default function ViewProduct() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/${id}`
                );
                // Handle if response is array or object
                const productData = Array.isArray(response.data) ? response.data[0] : response.data;
                setProduct(productData);
                // console.log("Fetched Product:", productData);
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id]);



    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-primary"></div>
            </div>
        );
    }

    if (!product) {
        return <div className="text-center mt-5">Product not found</div>;
    }

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-6 mb-4">
                    <img
                        src={
                            product.image
                                ? `${import.meta.env.VITE_API_URL}/uploads/${product.image}`
                                : "https://via.placeholder.com/500"
                        }
                        alt={product.title}
                        className="img-fluid rounded shadow-sm"
                        style={{ maxHeight: "500px", objectFit: "cover", width: "100%" }}
                    />
                </div>
                <div className="col-md-6">
                    <h2 className="mb-3">{product.title}</h2>
                    <p className="text-muted mb-4">{product.description}</p>
                    <h3 className="text-primary fw-bold mb-4">₹{product.price}</h3>

                    <div className="d-flex gap-3">
                        <button
                            className="btn btn-outline-primary btn-lg"
                            onClick={() => addToCart(product._id)}
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

}
