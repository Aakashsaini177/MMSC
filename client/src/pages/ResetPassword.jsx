import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { resetToken } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    setLoading(true);
    try {
      const { data } = await api.put(`/auth/resetpassword/${resetToken}`, {
        password,
      });
      toast.success(data.data);
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-surface p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-white/20">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-brand-dark mb-2">
            Reset Password
          </h1>
          <p className="text-gray-500">Enter your new password below</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
              placeholder="••••••••"
              minLength={6}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
              placeholder="••••••••"
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-primary text-white py-3 rounded-xl font-bold hover:bg-brand-dark transition-all shadow-lg shadow-brand-primary/30 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
