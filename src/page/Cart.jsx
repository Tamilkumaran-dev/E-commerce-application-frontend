import { useContext, useEffect, useState, useMemo } from "react";
import { LoginContext } from "../App";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const isLoggedIn = useContext(LoginContext);
  const [cart, setCart] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Compute total price dynamically
  const totalPrice = useMemo(
    () => cart.reduce((acc, product) => acc + product.price, 0),
    [cart]
  );

  const getCart = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}cart/userCart`,
        { withCredentials: true }
      );
      if (res.data.status === true || res.data.isException === true) {
        setUserId(res.data.data.userId);
        setCart(res.data.data.cart);
      }
    } catch (err) {
      console.log("getCart method throwing error", err);
      setUserId(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      getCart();
    } else {
      alert("To access cart you have to login first");
      navigate("/auth");
    }
  }, [isLoggedIn, navigate]);

  const removeProduct = async (productId) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BASE_URL}cart/removeProduct/${userId}/${productId}`,
        {},
        { withCredentials: true }
      );
      if (res.data.statusBoolean) {
        alert(res.data.message);
        getCart();
      }
    } catch (err) {
      console.log("Error while removing product", err);
    }
  };

  const placeOrder = async () => {
    try {
      const resOne = await axios.get(
        `${import.meta.env.VITE_BASE_URL}profile`,
        { withCredentials: true }
      );
      if (resOne.data.data.personalDetail != null) {
        try {
          const res = await axios.put(
            `${import.meta.env.VITE_BASE_URL}order/orderPlaced/${userId}`,
            {},
            { withCredentials: true }
          );
          alert(res.data.message);
          getCart();
        } catch (err) {
          if (err.response?.status === 401) {
            alert("Session expired, please login again");
            navigate("/auth");
          } else {
            alert(err.response?.message || "Error placing order");
          }
        }
      } else {
        alert("You haven't completed your profile. Please complete profile first.");
        navigate("/profile");
      }
    } catch (err) {
      console.log("Error in getting profile in the cart page", err);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      {loading ? (
        <p>Loading cart...</p>
      ) : cart.length > 0 ? (
        <>
          <ul className="space-y-4">
            {cart.map((product, index) => (
              <li
                key={product.id || index}
                className="flex items-center justify-between bg-white shadow p-4 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={product.image}
                    alt={product.productName}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div>
                    <h2 className="text-lg font-semibold">{product.productName}</h2>
                    <p className="text-sm text-gray-600">{product.description}</p>
                    <p className="text-green-600 font-bold">₹{product.price}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeProduct(product.id)}
                  className="text-red-500 hover:text-red-700 font-semibold"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-6 p-4 bg-white shadow rounded-lg flex items-center justify-between">
            <h2 className="text-xl font-bold">Total: ₹{totalPrice}</h2>
            <button
              onClick={placeOrder}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Order Now
            </button>
          </div>
        </>
      ) : (
        <div className="text-center mt-10">
          <h2 className="text-xl font-semibold mb-4">
            Your cart is empty 🛒
          </h2>
          <button
            onClick={() => navigate("/")}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Go Shopping
          </button>
        </div>
      )}
    </div>
  );
}
