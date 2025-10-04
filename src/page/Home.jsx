import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { LoginContext } from "../App";

export default function Home() {
  const isLoggedIn = useContext(LoginContext);

  const [products, setProducts] = useState([]);
  const [searchBar, setSearchBar] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("AllProduct");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    getData();
  }, [page, searchKeyword]);

  const getData = async () => {
    try {
      let url;
      if (searchKeyword === "AllProduct") {
        url = `${import.meta.env.VITE_BASE_URL}home/${page}/10`;
      } else {
        url = `${import.meta.env.VITE_BASE_URL}home/searchProduct/${searchKeyword}/${page}/10`;
      }

      const res = await axios.get(url, { withCredentials: true });
      setProducts(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 401) {
        alert("Session expired. Please login again.");
        navigate("/");
      }
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
    <div className="min-h-screen bg-gray-50">
      {/* Search Bar */}
      <div className="max-w-4xl mx-auto mt-6 px-4">
        <input
          type="text"
          value={searchBar}
          onChange={searchMethod}
          placeholder="Search products..."
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
      </div>

      {/* Products Grid */}
      <section className="max-w-6xl mx-auto mt-10 px-4">
        <h2 className="text-2xl font-semibold mb-6 text-gray-700">
          {searchKeyword === "AllProduct"
            ? "All Products"
            : `Results for "${searchKeyword}"`}
        </h2>

        {products.length === 0 ? (
          <p className="text-gray-500 text-center">No products found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link
                to={`/product/${product.id}`}
                key={product.id}
                className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition"
              >
                <img
                  src={product.image}
                  alt="Product"
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg truncate">
                    {product.productName}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {product.description}
                  </p>
                  <p className="text-indigo-600 font-bold mt-2">
                    ₹{product.price}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-10 space-x-2">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => setPage(index + 1)}
              className={`px-4 py-2 rounded-lg border ${
                page === index + 1
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
