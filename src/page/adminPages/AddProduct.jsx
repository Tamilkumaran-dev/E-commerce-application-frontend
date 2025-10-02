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
      [e.target.name]: e.target.value, // ✅ fixed typo
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

      // ✅ reset form after success
      setProduct({
        productName: "",
        description: "",
        image: "",
        price: 0,
        quantity: 0,
      });
    } catch (err) {
      console.log("error while adding the product", err);
    }
  };

  return (
    <>
      <div>
        <form onSubmit={submitProduct}>
          <input
            type="text"
            name="productName"
            value={product.productName}
            onChange={addProductDetail}
            placeholder="Product name"
          />
          <textarea
            name="description"
            cols="30"
            rows="5"
            value={product.description}
            onChange={addProductDetail}
            placeholder="Description"
          />
          <input
            type="text"
            name="image"
            value={product.image}
            onChange={addProductDetail}
            placeholder="Product image URL"
          />
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={addProductDetail}
            placeholder="Enter price"
          />
          <input
            type="number"
            name="quantity"
            value={product.quantity}
            onChange={addProductDetail}
            placeholder="Enter number of quantity"
          />
          <input type="submit" value="Add product" />
        </form>
      </div>
    </>
  );
}
