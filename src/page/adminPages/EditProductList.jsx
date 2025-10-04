import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function EditProductList() {
  const [products, setProducts] = useState([]);
  const [searchBar, setSearchBar] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("AllProduct");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    getData();
  }, [page, searchKeyword]);

  const getData = async () => {
    try {
      setLoading(true);
      let url =
        searchKeyword === "AllProduct"
          ? `${import.meta.env.VITE_BASE_URL}home/${page}/10`
          : `${import.meta.env.VITE_BASE_URL}home/searchProduct/${searchKeyword}/${page}/10`;

      const res = await axios.get(url, { withCredentials: true });
      setProducts(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 401) {
        alert("Session expired. Please login again.");
        navigate("/");
      }
    } finally {
      setLoading(false);
    }
  };

  const searchMethod = (e) => {
    const value = e.target.value;
    setSearchBar(value);

    if (value.trim() === "") {
      setSearchKeyword("AllProduct");
      setPage(1);
    } else {
      setSearchKeyword(value.trim());
      setPage(1);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ marginBottom: "20px" }}>📦 Manage Products</h1>

      {/* Search Bar */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          value={searchBar}
          onChange={searchMethod}
          placeholder="🔍 Search products..."
          style={{
            padding: "10px",
            width: "300px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        />
      </div>

      {/* Loading State */}
      {loading && <p>Loading products...</p>}

      {/* Product Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "20px",
        }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "15px",
              textAlign: "center",
              background: "#fff",
              boxShadow: "0px 2px 6px rgba(0,0,0,0.1)",
            }}
          >
            <Link
              to={`/editProduct/${product.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <img
                src={product.image}
                alt={product.productName}
                style={{
                  width: "100%",
                  height: "180px",
                  objectFit: "contain",
                  marginBottom: "10px",
                }}
              />
              <h2 style={{ fontSize: "18px", margin: "10px 0" }}>
                {product.productName}
              </h2>
              <p style={{ color: "#555", fontSize: "14px" }}>
                {product.description?.slice(0, 50)}...
              </p>
              <p style={{ fontWeight: "bold", margin: "10px 0" }}>
                ₹{product.price}
              </p>
              <button
                style={{
                  padding: "8px 12px",
                  background: "#007bff",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Edit Product
              </button>
            </Link>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div style={{ marginTop: "30px", textAlign: "center" }}>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => setPage(index + 1)}
            style={{
              margin: "0 5px",
              padding: "8px 12px",
              borderRadius: "5px",
              border: "1px solid #007bff",
              background: page === index + 1 ? "#007bff" : "#fff",
              color: page === index + 1 ? "#fff" : "#007bff",
              cursor: "pointer",
            }}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
