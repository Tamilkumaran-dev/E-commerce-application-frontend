import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UserOrder() {
  const [orderList, setOrderList] = useState([]);
  const [editOrderId, setEditOrderId] = useState(null);
  const navigate = useNavigate();

  const getAllOrder = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}order/allOrders/1/10`,
        { withCredentials: true }
      );
      if (res.data) {
        setOrderList(res.data);
      }
    } catch (err) {
      console.log("Error fetching orders", err);
    }
  };

  useEffect(() => {
    getAllOrder();
  }, []);

  const orderStatusUpdate = async (e, id) => {
    e.preventDefault();
    const status = e.target.status.value;
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BASE_URL}order/updateOrder/${id}/${status}`,
        {},
        { withCredentials: true }
      );
      alert(res.data.message);
      setEditOrderId(null);
      getAllOrder();
    } catch (err) {
      console.log("Error updating status", err);
      if (err.response?.status === 403) {
        navigate("/auth");
      }
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">Orders</h1>

      {orderList.length > 0 ? (
        <div className="space-y-6">
          {orderList.map((order) => (
            <div
              key={order.id}
              className="bg-white shadow-md rounded-lg p-6 border border-gray-200"
            >
              {/* Order Header */}
              <div className="flex justify-between items-center mb-4">
                <p className="text-gray-600">
                  📅 {order.date?.split("T")[0]}
                </p>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.status === "delivered"
                      ? "bg-green-100 text-green-600"
                      : order.status === "out-for-delivery"
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-blue-100 text-blue-600"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              {/* Buyer Info */}
              <div className="mb-4">
                <p className="font-semibold">{order.buyerName}</p>
                <p className="text-sm text-gray-600">
                  📞 {order.buyer?.mobileNo}
                </p>
                <p className="text-sm text-gray-600">
                  📍 {order.buyer?.address}
                </p>
              </div>

              {/* Product List */}
              <div className="space-y-3">
                {order.product.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-4 border rounded-md p-3"
                  >
                    <img
                      src={product.image}
                      alt="product"
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium">{product.productName}</p>
                      <p className="text-sm text-gray-500">
                        {product.description}
                      </p>
                      <p className="text-green-600 font-semibold">
                        ₹{product.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Edit Status */}
              <div className="mt-4 flex items-center justify-between">
                {editOrderId === order.id ? (
                  <form
                    onSubmit={(e) => orderStatusUpdate(e, order.id)}
                    className="flex items-center gap-3"
                  >
                    <select
                      id="status"
                      name="status"
                      defaultValue={order.status}
                      className="border rounded p-2"
                    >
                      <option value="Order-placed">Order Placed</option>
                      <option value="out-for-delivery">
                        Out for Delivery
                      </option>
                      <option value="delivered">Delivered</option>
                    </select>
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Update
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditOrderId(null)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      Cancel
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={() => setEditOrderId(order.id)}
                    className="text-blue-600 font-medium hover:underline"
                  >
                    Edit Status
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-500 text-center mt-20">
          No orders available.
        </div>
      )}
    </div>
  );
}
