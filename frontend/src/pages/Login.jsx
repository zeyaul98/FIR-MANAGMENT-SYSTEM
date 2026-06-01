import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiCall } from "../api";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await apiCall("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        if (data.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/officer");
        }
      } else {
        setError(data.message || "Login Failed");
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* LEFT PANEL */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-blue-900 text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1600')",
          }}
        />

        <div className="absolute inset-0 bg-blue-900/80" />

        <div className="relative z-10 flex flex-col justify-between h-full p-14">
          <div>
            <div className="flex items-center gap-6">
              <div>
                <h2 className="text-3xl font-bold">
                  RAILWAY POLICE
                </h2>

                <p className="text-sm tracking-widest">
                  CRIME MANAGEMENT SYSTEM
                </p>
              </div>

              <div className="h-8 w-px bg-white/30" />

              <span className="text-3xl font-bold">RPMS</span>
            </div>

            <div className="mt-20">
              <span className="px-5 py-2 rounded-full border border-blue-300 bg-blue-700/40 text-sm font-semibold">
                ● SECURE DIGITAL PORTAL
              </span>

              <h1 className="text-7xl font-extrabold leading-tight mt-8">
                Track.
                <br />
                Record.
                <br />
                Protect.
              </h1>

              <p className="mt-8 text-2xl text-blue-100 max-w-xl">
                Streamlining FIR registration and criminal records for a safer journey.
              </p>
            </div>
          </div>

          <div className="text-blue-100 text-sm">
            © 2026 RAILWAY POLICE MANAGEMENT SYSTEM
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-5 sm:p-8">
        <div className="bg-white w-full max-w-lg rounded-[30px] shadow-2xl p-6 sm:p-10">
          <div className="text-center">
            <img
              src="/logo.png"
              alt="logo"
              className="w-24 h-24 mx-auto object-contain"
            />

            <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 mt-3">
              Bihar Railway
            </h1>

            <p className="text-gray-500 text-lg">
              FIR Management System
            </p>
          </div>

          <div className="bg-amber-400 rounded-2xl mt-8 p-4 flex items-center justify-center">
            <span className="font-semibold text-white text-center">
              Secure Login Portal
            </span>
          </div>

          {error && (
            <div className="mt-5 bg-red-100 border border-red-300 text-red-600 p-3 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="mt-8 space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-2 uppercase">
                Credential ID
              </label>

              <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full h-14 px-5 rounded-xl bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-bold text-gray-600 uppercase">
                  Password
                </label>

                <button
                  type="button"
                  className="text-blue-600 text-sm font-semibold"
                >
                  Forgot Password?
                </button>
              </div>

              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-14 px-5 rounded-xl bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg shadow-lg transition"
            >
              {loading ? "Logging In..." : "LOGIN"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;