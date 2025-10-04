import axios from "axios";
import { useState } from "react";

export default function AddProduct() {
  const [product, setProduct] = useState({
    productName: "",
    description: "",
    image: "",
    price: 0,
    quantity: 0,
  });

  const addProductDetail = (e) => {
    setProduct((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const submitProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}product/addProduct`,
        product,
        { withCredentials: true }
      );
      alert(res.data.message);

      // Reset form after success
      setProduct({
        productName: "",
        description: "",
        image: "",
        price: 0,
        quantity: 0,
      });
    } catch (err) {
      console.log("Error while adding the product", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
           Add New Product
        </h2>

        <form onSubmit={submitProduct} className="space-y-5">
          {/* Product Name */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Product Name
            </label>
            <input
              type="text"
              name="productName"
              value={product.productName}
              onChange={addProductDetail}
              placeholder="Enter product name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Description
            </label>
            <textarea
              name="description"
              rows="4"
              value={product.description}
              onChange={addProductDetail}
              placeholder="Enter product description"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            ></textarea>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Product Image URL
            </label>
            <input
              type="text"
              name="image"
              value={product.image}
              onChange={addProductDetail}
              placeholder="Enter image URL"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Price & Quantity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Price (₹)
              </label>
              <input
                type="number"
                name="price"
                value={product.price}
                onChange={addProductDetail}
                placeholder="Enter price"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                value={product.quantity}
                onChange={addProductDetail}
                placeholder="Enter quantity"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 bg-green-600 text-white text-lg font-semibold rounded-lg hover:bg-green-700 transition"
          >
             Add Product
          </button>
        </form>
      </div>
    </div>
  );
}
