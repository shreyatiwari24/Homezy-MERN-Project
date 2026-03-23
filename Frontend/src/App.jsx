import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { LocationProvider } from "./context/LocationContext"; // 🔥 ADD THIS
import { Toaster } from "react-hot-toast";

import Scroll from "./components/Common/Scroll";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Common/Footer";

import ProtectedRoute from "./Files/ProtectedRoute";
import ProtectedAdminRoute from "./Files/ProtectedAdminRoute";

import Home from "./pages/public/Home";
import About from "./pages/public/About";
import Contact from "./pages/public/Contact";
import Services from "./pages/public/Services/Services";
import ServiceDetail from "./pages/public/Services/ServiceDetail";

import Login from "./pages/public/CustomerLogin";
import ProviderLogin from "./pages/provider/Auth/ProviderLogin";
import ProviderRegister from "./pages/provider/Auth/ProviderRegister";

import CustomerLayout from "./layout/CustomerLayout";
import ProviderLayout from "./layout/ProviderLayout";

import AdminLogin from "./pages/Admin/AdminLogin";
import AdminDashboard from "./pages/Admin/AdminDashboard";

import CustomerDashboard from "./pages/customer/slides/CustomerDashboard";
import CustomerBookings from "./pages/customer/slides/CustomerBookings";
import CustomerProfile from "./pages/customer/slides/CustomerProfile";
import CustomerReviews from "./pages/customer/slides/CustomerReview";
import CustomerSavedProviders from "./pages/customer/slides/CustomerSavedProviders";

import ProviderDashboard from "./pages/provider/slides/ProviderDashboard";
import ProviderBookings from "./pages/provider/slides/Bookings/ProviderBookings";
import ProviderServices from "./pages/provider/slides/Services/ProviderServices";
import ProviderProfile from "./pages/provider/slides/ProviderProfile";
import ProviderEarnings from "./pages/provider/slides/ProviderEarnings";
import ProviderAnalytics from "./pages/provider/slides/ProviderAnalytics";
import ProviderSettings from "./pages/provider/slides/ProviderSettings";

import ProviderEditService from "./pages/provider/slides/Services/ProviderEditService";
import ProviderCreateService from "./pages/provider/slides/Services/ProviderCreateService";

import ServiceCategories from "./pages/customer/serviceCategories/Categories";
import CategoryServices from "./pages/customer/serviceCategories/CategoryServices";
import SubCategoryPage from "./pages/customer/serviceCategories/SubCategories";

import Notifications from "./components/Common/Notifications";

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "12px",
            background: "#333",
            color: "#fff",
          },
        }}
      />

      <AuthProvider>
        <LocationProvider> {/* 🔥 REQUIRED */}
          <Router>
            <Scroll />

            <Routes>

              {/* PUBLIC ROUTES */}
              <Route path="/" element={<><Navbar /><Home /><Footer /></>} />
              <Route path="/about" element={<><Navbar /><About /><Footer /></>} />
              <Route path="/contact" element={<><Navbar /><Contact /><Footer /></>} />

              {/* 🔥 SERVICES FIXED */}
              <Route path="/services" element={<><Navbar /><Services /></>} />
              <Route path="/services/:id" element={<><Navbar /><ServiceDetail /></>} />

              <Route path="/customer/login" element={<><Navbar /><Login /><Footer /></>} />

              {/* CUSTOMER */}
              <Route path="/customer/dashboard" element={<ProtectedRoute role="customer"><CustomerLayout><CustomerDashboard /></CustomerLayout></ProtectedRoute>} />
              <Route path="/customer/bookings" element={<ProtectedRoute role="customer"><CustomerLayout><CustomerBookings /></CustomerLayout></ProtectedRoute>} />
              <Route path="/customer/profile" element={<ProtectedRoute role="customer"><CustomerLayout><CustomerProfile /></CustomerLayout></ProtectedRoute>} />
              <Route path="/customer/reviews" element={<ProtectedRoute role="customer"><CustomerLayout><CustomerReviews /></CustomerLayout></ProtectedRoute>} />
              <Route path="/customer/saved-providers" element={<ProtectedRoute role="customer"><CustomerLayout><CustomerSavedProviders /></CustomerLayout></ProtectedRoute>} />

              {/* CATEGORY */}
              <Route path="/categories" element={<ServiceCategories />} />
              <Route path="/category/:slug" element={<CategoryServices />} />
              <Route path="/categories/:category" element={<SubCategoryPage />} />

              <Route path="/notifications" element={<Notifications />} />

              {/* PROVIDER */}
              <Route path="/provider/dashboard" element={<ProtectedRoute role="provider"><ProviderLayout><ProviderDashboard /></ProviderLayout></ProtectedRoute>} />
              <Route path="/provider/bookings" element={<ProtectedRoute role="provider"><ProviderLayout><ProviderBookings /></ProviderLayout></ProtectedRoute>} />
              <Route path="/provider/services" element={<ProtectedRoute role="provider"><ProviderLayout><ProviderServices /></ProviderLayout></ProtectedRoute>} />
              <Route path="/provider/profile" element={<ProtectedRoute role="provider"><ProviderLayout><ProviderProfile /></ProviderLayout></ProtectedRoute>} />
              <Route path="/provider/earnings" element={<ProtectedRoute role="provider"><ProviderLayout><ProviderEarnings /></ProviderLayout></ProtectedRoute>} />
              <Route path="/provider/analytics" element={<ProtectedRoute role="provider"><ProviderLayout><ProviderAnalytics /></ProviderLayout></ProtectedRoute>} />
              <Route path="/provider/settings" element={<ProtectedRoute role="provider"><ProviderLayout><ProviderSettings /></ProviderLayout></ProtectedRoute>} />
              <Route path="/provider/services/edit/:id" element={<ProtectedRoute role="provider"><ProviderLayout><ProviderEditService /></ProviderLayout></ProtectedRoute>} />
              <Route path="/provider/services/create" element={<ProtectedRoute role="provider"><ProviderLayout><ProviderCreateService /></ProviderLayout></ProtectedRoute>} />

              {/* AUTH */}
              <Route path="/provider/login" element={<ProviderLogin />} />
              <Route path="/provider/signup" element={<ProviderRegister />} />

              {/* ADMIN */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />

            </Routes>
          </Router>
        </LocationProvider>
      </AuthProvider>
    </>
  );
}

export default App;