import { useState } from "react";
import Login from "../component/Login";
import SignUp from "../component/SignUp";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        {/* Toggle between Login & SignUp */}
        {isLogin ? (
          <Login switchAuth={() => setIsLogin(false)} />
        ) : (
          <SignUp switchAuth={() => setIsLogin(true)} />
        )}

        {/* Switch Button */}
        <div className="mt-4 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            {isLogin
              ? "Don't have an account? Sign Up"
              : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
}
