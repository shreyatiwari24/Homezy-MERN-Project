import { useState, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-hot-toast";


const ProviderLogin = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();


  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!form.email || !form.password) {
    return toast.error("Please fill all required fields");
  }

  try {
    setLoading(true);

    const user = await login({
      email: form.email.trim().toLowerCase(),
      password: form.password,
      role: "provider",
      remember: form.remember,
    });

    if (!user.roles?.includes("provider")) {
      return toast.error("Not registered as provider");
    }

    toast.success("Login successful");

    navigate("/provider/dashboard");

  } catch (err) {
    toast.error(err.message || "Invalid credentials");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#312e81] relative overflow-hidden">

      {/* Glow Effects */}
      <div className="absolute w-96 h-96 bg-blue-500 opacity-20 blur-3xl rounded-full -top-20 -left-20"></div>
      <div className="absolute w-96 h-96 bg-purple-500 opacity-20 blur-3xl rounded-full bottom-0 right-0"></div>

      {/* Card */}
      <div className="relative bg-white/95 backdrop-blur-xl w-full max-w-md p-10 rounded-3xl shadow-2xl border border-white/20">

        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Provider Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Email Address
            </label>
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              onChange={handleChange}
              className="inputPremium"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Password
            </label>

            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                onChange={handleChange}
                className="inputPremium pr-12"
                required
              />

              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="remember"
                onChange={handleChange}
              />
              Remember me
            </label>

            <span
              onClick={() => navigate("/provider/forgot-password")}
              className="text-blue-600 hover:underline cursor-pointer"
            >
              Forgot password?
            </span>
          </div>

          {/* Button */}
          <button
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-4 rounded-xl text-lg font-semibold shadow-lg hover:scale-[1.02] transition-transform duration-200"
          >
            {loading ? "Signing In..." : "Login as Provider"}
          </button>

        </form>

        {/* Bottom link */}
        <div className="text-center mt-6 text-sm text-gray-700">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/provider/signup")}
            className="text-blue-600 font-semibold cursor-pointer hover:underline"
          >
            Join as Provider
          </span>
        </div>

      </div>
    </div>
  );
};

export default ProviderLogin;
