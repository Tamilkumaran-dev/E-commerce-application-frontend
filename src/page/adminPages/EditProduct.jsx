import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function EditProduct() {
  const { productId } = useParams();
  const [product, setProductDetail] = useState(null); // ✅ start as null

  useEffect(() => {
    getProduct();
  }, []);

  const getProduct = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}home/product/${productId}`,
        { withCredentials: true }
      );

      if (res.data.product) {
        setProductDetail(res.data.product);
        console.log(res.data.product);
      } else {
        console.log("No product found");
      }
    } catch (err) {
      console.log("error while getting the specific product", err);
    }
  };

  const addProductDetail = (e) => {
    setProductDetail((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const updateProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BASE_URL}product/update/${productId}`,
        product,
        { withCredentials: true }
      );
      alert(res.data.message || "Product updated successfully!");
    } catch (err) {
      console.log("error while updating product", err);
      alert("Failed to update product");
    }
  };

  return (
    <>
      <div>
        {product ? (
          <form onSubmit={updateProduct}>
            <input
              type="text"
              name="productName"
              value={product.productName || ""}
              onChange={addProductDetail}
              placeholder="Product name"
            />
            <textarea
              name="description"
              cols="30"
              rows="5"
              value={product.description || ""}
              onChange={addProductDetail}
              placeholder="Description"
            />
            <input
              type="text"
              name="image"
              value={product.image || ""}
              onChange={addProductDetail}
              placeholder="Product image URL"
            />
            <input
              type="number"
              name="price"
              value={product.price || 0}
              onChange={addProductDetail}
              placeholder="Enter price"
            />
            <input
              type="number"
              name="quantity"
              value={product.quantity || 0}
              onChange={addProductDetail}
              placeholder="Enter number of quantity"
            />
            <input type="submit" value="Update product" />
          </form>
        ) : (
          <h2>Loading...</h2>
        )}
      </div>
    </>
  );
}
