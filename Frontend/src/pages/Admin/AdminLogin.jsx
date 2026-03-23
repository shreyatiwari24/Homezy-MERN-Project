import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const AdminLogin = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    setLoading(true);

    const user = await login({
      email: form.email,
      password: form.password,
      role: "admin",
      remember: true, // optional
    });

    if (user.roles?.includes("admin")) {
      navigate("/admin/dashboard", { replace: true });
    } else {
      alert("Access denied");
    }

  } catch (err) {
    alert(err.message || "Login failed");
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          Admin Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="email"
            name="email"
            placeholder="Admin Email"
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          />

          <button
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-lg"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
