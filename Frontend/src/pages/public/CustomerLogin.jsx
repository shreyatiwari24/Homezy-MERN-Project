import { useNavigate } from "react-router-dom";
import ReactDOM from "react-dom";
import { useState, useEffect, useContext } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaTimes } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-hot-toast";

const CustomerLogin = ({ onClose }) => {

  const navigate = useNavigate();

  const { login, register } = useContext(AuthContext);

  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  // ================= EMAIL VALIDATION =================

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regex.test(email)) {
      toast.error("Enter a valid email address");
      return false;
    }

    return true;
  };

  // ================= PASSWORD RULES =================

  const passwordRules = {
    length: form.password.length >= 8,
    uppercase: /[A-Z]/.test(form.password),
    lowercase: /[a-z]/.test(form.password),
    number: /\d/.test(form.password),
    special: /[@$!%*?&]/.test(form.password),
  };

  // ================= RESET ON MODE CHANGE =================

  useEffect(() => {
    setForm({
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    });
  }, [isRegister]);

  // ================= BODY SCROLL LOCK =================

  useEffect(() => {

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };

  }, []);

  // ================= ESC CLOSE =================

  useEffect(() => {

    const esc = (e) => {
      if (e.key === "Escape" && !loading) {
        onClose();
      }
    };

    window.addEventListener("keydown", esc);

    return () =>
      window.removeEventListener("keydown", esc);

  }, [onClose, loading]);

  // ================= EMAIL VERIFIED TOAST =================

  useEffect(() => {

    const params = new URLSearchParams(
      window.location.search
    );

    if (params.get("verified")) {
      toast.success("Email verified successfully");
    }

  }, []);

  // ================= INPUT =================

  const handleChange = (e) => {

    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));

  };

  // ================= SUBMIT =================

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!form.email || !form.password) {
      return toast.error("Please fill required fields");
    }

    if (!validateEmail(form.email)) return;

    if (isRegister) {

      if (!form.name) {
        return toast.error("Enter your full name");
      }

      if (form.password !== form.confirmPassword) {
        return toast.error("Passwords do not match");
      }

      if (
        !passwordRules.length ||
        !passwordRules.uppercase ||
        !passwordRules.lowercase ||
        !passwordRules.number ||
        !passwordRules.special
      ) {
        return toast.error(
          "Password must be 8+ chars, include uppercase, lowercase, number & special character"
        );
      }
    }

    try {

      setLoading(true);

      if (isRegister) {

        await register({
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          password: form.password,
          role: "customer",
        });

        toast.success(
          "Verification email sent. Check your inbox."
        );

        setIsRegister(false);

      } else {

        const result = await login({
          email: form.email.trim().toLowerCase(),
          password: form.password,
          role: "customer",
        });

        // SAVE TOKEN
        if (result?.token) {
          localStorage.setItem("token", result.token);
        }

        if (!result?.roles?.includes("customer")) {
          return toast.error("Not registered as customer");
        }

        toast.success("Login successful");

        navigate("/", { replace: true });

        onClose();
      }

    } catch (err) {

      toast.error(
        err.response?.data?.message ||
        err.message ||
        "Something went wrong"
      );

    } finally {

      setLoading(false);

    }

  };

  return ReactDOM.createPortal(

    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => !loading && onClose()}
      />

      {/* Modal */}

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl p-8"
      >

        <button
          onClick={() => !loading && onClose()}
          className="absolute top-4 right-4 text-gray-400 hover:text-black"
        >
          <FaTimes size={18} />
        </button>

        <h2 className="text-2xl font-bold text-center mb-6">

          {isRegister
            ? "Create Customer Account"
            : "Welcome Back"}

        </h2>

        {/* Google login (UI only for now) */}

        {!isRegister && (

          <>
            <button className="w-full flex items-center justify-center gap-3 border p-3 rounded-lg hover:bg-gray-50">

              <FcGoogle size={22} />
              Continue with Google

            </button>

            <div className="flex items-center my-6">

              <div className="flex-grow border-t" />

              <span className="mx-4 text-sm text-gray-500">
                OR
              </span>

              <div className="flex-grow border-t" />

            </div>
          </>

        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          {isRegister && (

            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />

          )}

          <input
            name="email"
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />

          {/* PASSWORD */}

          <div className="relative">

            <input
              name="password"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <span
              className="absolute right-4 top-3 text-sm cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </span>

            {isRegister && (

              <div className="mt-2 text-xs space-y-1">

                <p className={passwordRules.length ? "text-green-600" : "text-gray-400"}>
                  ✓ 8+ characters
                </p>

                <p className={passwordRules.uppercase ? "text-green-600" : "text-gray-400"}>
                  ✓ Uppercase letter
                </p>

                <p className={passwordRules.lowercase ? "text-green-600" : "text-gray-400"}>
                  ✓ Lowercase letter
                </p>

                <p className={passwordRules.number ? "text-green-600" : "text-gray-400"}>
                  ✓ One number
                </p>

                <p className={passwordRules.special ? "text-green-600" : "text-gray-400"}>
                  ✓ One special character
                </p>

              </div>

            )}

          </div>

          {isRegister && (

            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
            />

          )}

          <button
            disabled={loading}
            className="w-full bg-blue-800 text-white py-3 rounded-lg hover:bg-blue-900 disabled:opacity-60"
          >

            {loading
              ? "Processing..."
              : isRegister
                ? "Create Account"
                : "Login"}

          </button>

        </form>

        {/* SWITCH MODE */}

        <div className="text-center mt-6 text-sm">

          {isRegister ? (

            <>
              Already have an account?{" "}
              <span
                onClick={() => setIsRegister(false)}
                className="text-blue-700 font-semibold cursor-pointer"
              >
                Login
              </span>
            </>

          ) : (

            <>
              Don’t have an account?{" "}
              <span
                onClick={() => setIsRegister(true)}
                className="text-blue-700 font-semibold cursor-pointer"
              >
                Register
              </span>
            </>

          )}

        </div>

      </div>

    </div>,
    document.body
  );
};

export default CustomerLogin;