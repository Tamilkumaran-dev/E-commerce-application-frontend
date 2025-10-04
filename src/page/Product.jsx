import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LoginContext } from "../App";

export default function Product() {
  const isLoggedIn = useContext(LoginContext);
  const navigate = useNavigate();
  const { productId } = useParams();

  const [product, setProduct] = useState({});
  const [found, setFound] = useState(false);
  const [userData, setUserData] = useState([]);
  const [isExist, setIsExist] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch single product
  useEffect(() => {
    const getProduct = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}home/product/${productId}`
        );
        setProduct(res.data.product);
        setFound(true);
      } catch (err) {
        console.error("Error fetching product:", err);
        setFound(false);
      } finally {
        setLoading(false);
      }
    };

    getProduct();
  }, [productId]);

  // ✅ Fetch profile/cart if logged in
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}profile`, {
          withCredentials: true,
        });

        if (res.data.status === true) {
          setUserData(res.data.data.cart);
        }
      } catch (err) {
        if (err.response && err.response.status === 409) {
          alert("Session expired. Please login again.");
          navigate("/auth");
        }
      }
    };

    if (isLoggedIn) {
      fetchProfile();
    }
  }, [isLoggedIn, navigate]);

  // ✅ Check if product exists in cart
  useEffect(() => {
    if (userData.length > 0) {
      const exists = userData.some((item) => item.id == productId);
      setIsExist(exists);
    } else {
      setIsExist(false);
    }
  }, [userData, productId]);

  // ✅ Add to cart
  const addToCart = async (productId) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}cart/addToCart/${productId}`,
        {},
        { headers: { "Content-Type": "application/json" },withCredentials: true }
      );

      if (res.data.statusBoolean) {
        alert("Added successfully!");
        setUserData((prev) => [...prev, product]);
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("Error occurred in add to cart");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      {loading ? (
        <p className="text-center text-gray-500 text-lg">Loading product...</p>
      ) : found ? (
        <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left: Product Image */}
          <div className="flex justify-center items-center">
            <img
              src={product.image}
              alt={product.productName}
              className="w-full max-h-[500px] object-contain rounded-lg shadow-md"
            />
          </div>

          {/* Right: Product Details */}
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-3">
              {product.productName}
            </h1>
            <p className="text-gray-600 mb-4">{product.description}</p>

            <h2 className="text-2xl font-semibold text-green-600 mb-6">
              ₹{product.price}
            </h2>

            <div className="space-y-4">
              {isLoggedIn ? (
                <button
                  onClick={() => addToCart(product.id)}
                  className="w-full py-3 px-6 bg-indigo-600 text-white text-lg font-medium rounded-lg hover:bg-indigo-700 transition"
                >
                  {isExist ? "➕ Add one more to Cart" : "🛒 Add to Cart"}
                </button>
              ) : (
                <button
                  onClick={() => navigate("/auth")}
                  className="w-full py-3 px-6 bg-gray-700 text-white text-lg font-medium rounded-lg hover:bg-gray-800 transition"
                >
                  🔑 Login to Buy
                </button>
              )}
            </div>

            {/* Delivery / Availability Info */}
            <div className="mt-8 border-t pt-4 text-gray-600 space-y-2">
              <p>✅ Cash on delivery available</p>
              <p>🚚 Estimated delivery in 4-7 days</p>
              <p>🔒 Secure transaction</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center text-red-500 font-semibold text-lg">
          ❌ Product not found
        </div>
      )}
    </div>
  );
}
