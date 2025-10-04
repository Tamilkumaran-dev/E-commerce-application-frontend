import axios from "axios";
import { useState } from "react";

function SignUp({ switchAuth }) {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const addUser = (e) => {
    setUserData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submitEvent = async (e) => {
    e.preventDefault();

    // ✅ Confirm password check
    if (userData.password !== userData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}auth/signup`,
        userData,
        { headers: { "Content-Type": "application/json" },withCredentials: true }
      );

      if (res.data.status) {
        alert(res.data.message);
        // ✅ Switch to login after successful signup
        if (switchAuth) switchAuth();
      } else {
        alert(res.data.message || "Signup failed, try again.");
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
      <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
      <form onSubmit={submitEvent} className="space-y-4">
        {/* Name */}
        <div>
          <label
            htmlFor="nameId"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <input
            type="text"
            name="name"
            id="nameId"
            value={userData.name}
            onChange={addUser}
            className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="emailId"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            id="emailId"
            value={userData.email}
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
            value={userData.password}
            onChange={addUser}
            className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        {/* Confirm Password */}
        <div>
          <label
            htmlFor="confirmPasswordId"
            className="block text-sm font-medium text-gray-700"
          >
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            id="confirmPasswordId"
            value={userData.confirmPassword}
            onChange={addUser}
            className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          Sign Up
        </button>
      </form>

    </div>
  );
}

export default SignUp;
