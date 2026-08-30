import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { UserRound, Mail, Lock, Eye, EyeOff, UserPlus } from "lucide-react";
import { isAuthenticated, registerUser } from "../services/authService";

function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "" });

  if (isAuthenticated()) return <Navigate to="/dashboard" replace />;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await registerUser(formData);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange">Citizen Portal</p>
          <h1 className="mt-3 text-4xl font-extrabold text-navy">Create Account</h1>
          <p className="mt-3 text-sm text-slate-500">
            Register to submit and track civic infrastructure complaints.
          </p>
        </div>

        <div className="mt-8 rounded-3xl bg-white p-6 shadow-xl sm:p-8">
          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div>
              <label className="text-sm font-semibold text-slate-700">Full Name</label>
              <div className="relative mt-2">
                <UserRound size={19} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                  className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <div className="mt-5">
              <label className="text-sm font-semibold text-slate-700">Email Address</label>
              <div className="relative mt-2">
                <Mail size={19} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                  className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <div className="mt-5">
              <label className="text-sm font-semibold text-slate-700">Password</label>
              <div className="relative mt-2">
                <Lock size={19} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  placeholder="Minimum 6 characters"
                  className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-12 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: "#1d4ed8",
                color: "white",
              }}
              className="mt-6 flex min-h-[54px] w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 font-semibold shadow-lg shadow-blue-900/20 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <UserPlus size={19} />
                  <span>Register</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 border-t border-slate-100 pt-6 text-center">
            <p className="text-sm text-slate-500">Already have an account?</p>
            <Link to="/login" className="mt-1 inline-block text-sm font-semibold text-blue-600 hover:text-blue-700">
              Login here
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Register;
