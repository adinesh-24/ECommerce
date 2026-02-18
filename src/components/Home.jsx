// import React, { useEffect, useState } from "react";
// import axios from "axios";

// export default function Home() {

//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // ✅ Fetch products from backend
//   useEffect(() => {

//     axios
//       .get("http://localhost:5000/products")
//       .then((response) => {
//         setProducts(response.data);
//         setLoading(false);
//       })
//       .catch((error) => {
//         console.error("Error fetching products:", error);
//         setLoading(false);
//       });

//   }, []);

//   return (
//     <div>

//       {/* ✅ NAVBAR */}
//       <nav style={styles.navbar}>
//         <h2>MyShop</h2>
//         <input placeholder="Search products..." />
//         <div>
//           <button>Login</button>
//           <button>Cart 🛒</button>
//         </div>
//       </nav>

//       {/* ✅ HERO SECTION */}
//       <section style={styles.hero}>
//         <h1>Big Sale Today 🔥</h1>
//         <p>Up to 50% OFF on Electronics</p>
//         <button>Shop Now</button>
//       </section>

//       {/* ✅ CATEGORIES */}
//       <section style={styles.section}>
//         <h2>Categories</h2>

//         <div style={styles.categoryGrid}>
//           <div style={styles.categoryCard}>Electronics</div>
//           <div style={styles.categoryCard}>Fashion</div>
//           <div style={styles.categoryCard}>Accessories</div>
//           <div style={styles.categoryCard}>Books</div>
//         </div>

//       </section>

//       {/* ✅ PRODUCTS FROM API */}
//       <section style={styles.section}>
//         <h2>Featured Products</h2>

//         {loading && <p>Loading products...</p>}

//         <div style={styles.productGrid}>

//           {products.map((product) => (

//             <div key={product._id} style={styles.productCard}>

//               <img
//                 src={`http://localhost:5000/uploads/${product.image}`}
//                 alt={product.title}
//                 width="150"
//               />

//               <h3>{product.title}</h3>
//               <p>{product.description}</p>
//               <p>₹{product.price}</p>

//               <button>Add to Cart</button>

//             </div>

//           ))}

//         </div>

//       </section>

//       {/* ✅ FOOTER */}
//       <footer style={styles.footer}>
//         <p>© 2026 MyShop. All rights reserved.</p>
//       </footer>

//     </div>
//   );
// }


// // ✅ SIMPLE STYLES
// const styles = {

//   navbar: {
//     display: "flex",
//     justifyContent: "space-between",
//     padding: "15px",
//     background: "#222",
//     color: "#fff",
//     alignItems: "center"
//   },

//   hero: {
//     textAlign: "center",
//     padding: "60px",
//     background: "#f5f5f5"
//   },

//   section: {
//     padding: "30px"
//   },

//   categoryGrid: {
//     display: "flex",
//     gap: "20px"
//   },

//   categoryCard: {
//     padding: "20px",
//     background: "#eee",
//     borderRadius: "8px"
//   },

//   productGrid: {
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))",
//     gap: "20px"
//   },

//   productCard: {
//     border: "1px solid #ddd",
//     padding: "15px",
//     textAlign: "center"
//   },

//   footer: {
//     textAlign: "center",
//     padding: "20px",
//     background: "#222",
//     color: "#fff",
//     marginTop: "40px"
//   }
// };
