import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthProvider";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import GSTFiling from "./pages/GSTFiling";
import TaxReturns from "./pages/TaxReturns";
import Documents from "./pages/Documents";
import NotFound from "./pages/NotFound";
import Suppliers from "./pages/Suppliers";
import Purchases from "./pages/Purchases";
import Sales from "./pages/Sales";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Products from "./pages/Products";
import Settings from "./pages/Settings";
import InventoryAdjustments from "./pages/InventoryAdjustments";
import Layout from "./components/Layout";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  return user ? <Outlet /> : <Navigate to="/login" />;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:resetToken" element={<ResetPassword />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/gst-filing" element={<GSTFiling />} />
          <Route path="/tax-returns" element={<TaxReturns />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/suppliers" element={<Suppliers />} />
          <Route path="/purchases" element={<Purchases />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/products" element={<Products />} />
          <Route path="/inventory" element={<InventoryAdjustments />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
