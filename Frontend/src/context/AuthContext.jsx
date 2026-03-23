import { createContext, useState, useEffect } from "react";
import API from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // ================= INIT AUTH =================

  useEffect(() => {
    const restoreAuth = () => {
      try {
        const storedUser =
          localStorage.getItem("user") ||
          sessionStorage.getItem("user");

        const token =
          localStorage.getItem("token") ||
          sessionStorage.getItem("token");

        if (storedUser && token) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("Auth restore failed:", error);
        localStorage.clear();
        sessionStorage.clear();
      } finally {
        setAuthLoading(false);
      }
    };

    restoreAuth();
  }, []);

  // ================= UPDATE USER =================

  const updateUser = (updatedUser) => {
    setUser((prev) => {
      const merged = { ...prev, ...updatedUser };

      const storage = localStorage.getItem("user")
        ? localStorage
        : sessionStorage;

      storage.setItem("user", JSON.stringify(merged));
      return merged;
    });
  };

  // ================= REGISTER =================

  const register = async (formData) => {
    try {
      const payload = {
        name: formData.name?.trim(),
        email: formData.email?.trim().toLowerCase(),
        password: formData.password,
        role: formData.role || "customer",

        phone: formData.phone,
        category: formData.category,
        experience: formData.experience,
        rate: formData.rate,
        bio: formData.bio,

        city: formData.city,
        area: formData.area,
        address: formData.address,
        pincode: formData.pincode,
        coordinates: formData.coordinates,
      };

      const res = await API.post("/auth/register", payload);
      return res.data;

    } catch (err) {
      throw new Error(
        err.response?.data?.message || "Registration failed"
      );
    }
  };

  // ================= LOGIN =================

  const login = async ({ email, password, role, remember }) => {
    try {
      const res = await API.post("/auth/login", {
        email: email.trim().toLowerCase(),
        password,
        role,
      });

      const { token, user } = res.data;

      if (!token || !user) throw new Error("Invalid login response");

      if (role && !user.roles?.includes(role)) {
        throw new Error(`Not registered as ${role}`);
      }

      const storage = remember ? localStorage : sessionStorage;

      storage.setItem("token", token);
      storage.setItem("user", JSON.stringify(user));

      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(user);

      return user;

    } catch (err) {
      throw new Error(
        err.response?.data?.message || err.message || "Login failed"
      );
    }
  };

  // ================= CHANGE PASSWORD (🔥 NEW FIX) =================

  const changePassword = async ({ oldPassword, newPassword }) => {
    try {
      const res = await API.put("/users/change-password", {
        oldPassword,
        newPassword,
      });

      return res.data;

    } catch (err) {
      throw new Error(
        err.response?.data?.message || "Password update failed"
      );
    }
  };

  // ================= LOGOUT =================

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    localStorage.removeItem("location");

    delete API.defaults.headers.common["Authorization"];
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        authLoading,
        login,
        register,
        logout,
        updateUser,
        changePassword, 
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};