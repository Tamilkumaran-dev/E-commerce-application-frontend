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

  // ✅ Fetch single product
  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}home/product/${productId}`
        );
        setProduct(res.data.product);
        setFound(true);
      } catch (err) {
        console.error("Error fetching product:", err);
        setFound(false);
      }
    };

    getProduct();
  }, [productId]);

  // ✅ Fetch profile/cart if logged in
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}profile`,
          { withCredentials: true }
        );

        if (res.data.status === true) {
          setUserData(res.data.data.cart);
          console.log("Profile data:", res.data.data);
        } else {
          console.log("Could not get profile:", res.data.data);
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

  // ✅ Check if product exists in cart when userData changes
  useEffect(() => {
    if (userData.length > 0) {
      const exists = userData.some((item) => item.id == productId);
      setIsExist(exists);
    } else {
      setIsExist(false);
    }
  }, [userData, productId]);

  // ✅ Add to cart function
  const addToCart = async (productId) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}cart/addToCart/${productId}`,
        {},
        { withCredentials: true }
      );

      if (res.data.statusBoolean) {
        alert("Added successfully!");
        setUserData((prev) => [...prev, product]); // update cart instantly
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("Error occurred in add to cart");
    }
  };

  return (
    <div>
      {found ? (
        <div>
          <img src={product.image} alt="img" width={100} height={100} />
          <h2>{product.productName}</h2>
          <p>{product.description}</p>
          <h1>{product.price}</h1>

          {isLoggedIn ? (
            <button onClick={() => addToCart(product.id)}>
              {isExist ? "Add one more to cart" : "Add to Cart"}
            </button>
          ) : (
            <button onClick={() => navigate("/auth")}>Login to buy</button>
          )}
          <p>Cash on delivery only</p>
        </div>
      ) : (
        <div>Product not found</div>
      )}
    </div>
  );
}
