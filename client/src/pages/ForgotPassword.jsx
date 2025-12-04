import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/auth/forgotpassword", { email });
      toast.success(data.data);
      setEmail("");
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
            Forgot Password
          </h1>
          <p className="text-gray-500">
            Enter your email to receive a reset link
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
              placeholder="admin@example.com"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-primary text-white py-3 rounded-xl font-bold hover:bg-brand-dark transition-all shadow-lg shadow-brand-primary/30 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="text-brand-primary font-bold hover:underline"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
