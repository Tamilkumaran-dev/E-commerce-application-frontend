import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Nav(props) {
  const [sfsl, setSfsl] = useState(true);   // login status
  const [role, setRole] = useState("ROLE_USER"); // default role
  const navigate = useNavigate();

  useEffect(() => {
    // Run on mount
    isLoggedIn();

    // Setup axios interceptor
    const interceptor = axios.interceptors.response.use(
      (response) => {
        if (!response.config.url.includes("profile/isLoggedIn")) {
          isLoggedIn(); // re-check login after every request
        }
        return response;
      },
      (error) => {
        if (
          error.config &&
          error.config.url &&
          !error.config.url.includes("profile/isLoggedIn")
        ) {
          isLoggedIn(); // also re-check on errors like 401
        }
        return Promise.reject(error);
      }
    );

    // Cleanup interceptor on unmount
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  const isLoggedIn = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}profile/isLoggedIn`,
        {},
        { headers: { "Content-Type": "application/json" },withCredentials: true }
      );

      if (res.data.statusBoolean) {
        setSfsl(true);
        setRole(res.data.message); // ✅ set role directly
        props.logginStatus(true);
      } else {
        setSfsl(false);
        props.logginStatus(false);
      }
    } catch (err) {
      console.log("error thrown for the nav isLoggedIn method :: ", err);
      setSfsl(false);
      props.logginStatus(false);
    }
  };

  const signout = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}auth/logout`,
        {},
        {headers: { "Content-Type": "application/json" }, withCredentials: true }
      );
      if (res.data.message) {
        navigate("/auth")
        alert(res.data.message);
        console.log(res.data.message);
      }
    } catch (err) {
      alert(err.message);
      console.log(err);
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-indigo-600">
          ShopEase
        </Link>

        {/* Links */}
        <div className="flex items-center space-x-6">
          {!sfsl && (
            <Link
              to="/auth"
              className="text-gray-700 hover:text-indigo-600 font-medium"
            >
              Sign up / Login
            </Link>
          )}

          {sfsl && (
            <>
              <Link
                to="/cart"
                className="text-gray-700 hover:text-indigo-600 font-medium"
              >
                Cart
              </Link>
              <Link
                to="/profile"
                className="text-gray-700 hover:text-indigo-600 font-medium"
              >
                Profile
              </Link>
              <Link
                to="/orders"
                className="text-gray-700 hover:text-indigo-600 font-medium"
              >
                Orders
              </Link>

              {/* ✅ Admin only */}
              {role === "ROLE_ADMIN" && (
                <div className="flex space-x-4">
                  <Link
                    to="/addProduct"
                    className="text-red-600 font-semibold hover:underline"
                  >
                    Add Product
                  </Link>
                  <Link
                    to="/editProduct"
                    className="text-red-600 font-semibold hover:underline"
                  >
                    Edit Product
                  </Link>
                  <Link
                    to="/userOrders"
                    className="text-red-600 font-semibold hover:underline"
                  >
                    All Orders
                  </Link>
                </div>
              )}

              <button
                onClick={signout}
                className="ml-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
