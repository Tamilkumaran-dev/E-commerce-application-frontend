import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login({ switchAuth }) {
  const navigate = useNavigate();
  const [login, setLogin] = useState({
    email: "",
    password: "",
  });

  const addUser = (e) => {
    setLogin((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submitEvent = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}auth/login`,
        login,
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );

      if (res.data.status === true) {
        alert(res.data.message);
        navigate("/");
      } else {
        alert(res.data.message || "Login failed, please try again.");
      }
    } catch (err) {
      if (err.response) {
        console.log("error data:", err.response.data);
        alert(err.response.data.message);
      }
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      <form onSubmit={submitEvent} className="space-y-4">
        {/* Email */}
        <div>
          <label
            htmlFor="emailId"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="text"
            name="email"
            id="emailId"
            value={login.email}
            onChange={addUser}
            className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="passwordId"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            name="password"
            id="passwordId"
            value={login.password}
            onChange={addUser}
            className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
