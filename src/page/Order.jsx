import axios from "axios";
import { useEffect, useState } from "react";

export default function Order() {
  const [orderList, setOrderList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrderList();
  }, []);

  const getOrderList = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}order/getOrderList`,
        { withCredentials: true }
      );
      if (res.data.status && !res.data.isException) {
        setOrderList(res.data.data);
      }
    } catch (err) {
      console.log("error while getting the order list", err);
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (userId, orderId, productId) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BASE_URL}order/cancelProduct/${userId}/${orderId}/${productId}`,
        {},
        { withCredentials: true }
      );
      getOrderList();
      alert(res.data.message);
    } catch (Err) {
      console.log("error thrown while cancel the order", Err.response);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Your Orders</h1>

      {loading ? (
        <p className="text-gray-500">Loading orders...</p>
      ) : orderList.length > 0 ? (
        <ul className="space-y-6">
          {orderList.map((order, index) => {
            let totalPrice = 0;

            return (
              <li
                key={order.id || index}
                className="bg-white shadow rounded-lg p-6"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-700">
                    Order #{index + 1}
                  </h2>
                  <span className="text-sm text-gray-500">
                    {order.date.split("T")[0]}
                  </span>
                </div>

                <ul className="space-y-4">
                  {order.product.map((product) => {
                    totalPrice += product.price;
                    return (
                      <li
                        key={product.id}
                        className="flex items-center justify-between border-b pb-4 last:border-none"
                      >
                        <div className="flex items-center space-x-4">
                          <img
                            src={product.image}
                            alt={product.productName}
                            className="w-16 h-16 object-cover rounded border"
                          />
                          <div>
                            <h3 className="font-semibold">
                              {product.productName}
                            </h3>
                            <p className="text-indigo-600 font-medium">
                              ₹{product.price}
                            </p>
                          </div>
                        </div>

                        <div>
                          {order.status === "order-placed" ? (
                            <button
                              onClick={() =>
                                cancelOrder(order.buyerId, order.id, product.id)
                              }
                              className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
                            >
                              Cancel
                            </button>
                          ) : (
                            <p className="text-gray-500 text-sm">
                              Out for delivery 🚚
                            </p>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>

                <div className="flex justify-between items-center mt-4 pt-4 border-t">
                  <h2 className="font-bold text-lg">
                    Total:{" "}
                    <span className="text-green-600">₹{totalPrice}</span>
                  </h2>
                  <span
                    className={`px-3 py-1 rounded-lg text-sm font-medium ${
                      order.status === "order-placed"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="text-center mt-10">
          <h2 className="text-xl font-semibold mb-4 text-gray-600">
            No orders found 📦
          </h2>
        </div>
      )}
    </div>
  );
}
