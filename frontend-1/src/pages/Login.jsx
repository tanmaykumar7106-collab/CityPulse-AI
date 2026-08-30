import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, LogIn, ShieldCheck } from "lucide-react";
import { loginUser, createDemoAdmin } from "../services/authService";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [creatingAdmin, setCreatingAdmin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateAdmin = async () => {
    const confirmCreate = window.confirm(
      "Create and login as demo admin? This is for project demo only."
    );

    if (!confirmCreate) return;

    try {
      setCreatingAdmin(true);
      setError("");

      await createDemoAdmin();

      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Unable to create admin account.");
    } finally {
      setCreatingAdmin(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await loginUser(formData);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange">
            CityPulse AI
          </p>

          <h1 className="mt-3 text-4xl font-extrabold text-navy">
            Welcome Back
          </h1>

          <p className="mt-3 text-sm text-slate-500">
            Login to manage and track your civic complaints.
          </p>
        </div>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8">
          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div>
              <label className="text-sm font-semibold text-slate-700">
                Email Address
              </label>

              <div className="relative mt-2">
                <Mail
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

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
              <label className="text-sm font-semibold text-slate-700">
                Password
              </label>

              <div className="relative mt-2">
                <Lock
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-12 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || creatingAdmin}
              className="cp-action-button mt-6 flex min-h-[54px] w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 font-semibold shadow-lg shadow-blue-900/20 transition disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <LogIn size={19} />
                  <span>Login</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleCreateAdmin}
              disabled={creatingAdmin || loading}
              className="mt-3 flex min-h-[50px] w-full items-center justify-center gap-2 rounded-xl border border-teal-500 px-5 py-3 text-sm font-bold text-teal-700 transition hover:bg-teal-50 disabled:cursor-not-allowed disabled:opacity-70 dark:border-teal-400 dark:text-teal-300 dark:hover:bg-teal-950/40"
            >
              {creatingAdmin ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-teal-500/30 border-t-teal-600 dark:border-teal-300/30 dark:border-t-teal-300" />
                  <span>Creating Admin...</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={18} />
                  <span>Create Demo Admin Account</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 border-t border-slate-100 pt-6 text-center">
            <p className="text-sm text-slate-500">Don't have an account?</p>

            <Link
              to="/register"
              className="mt-1 inline-block text-sm font-semibold text-blue-600 transition hover:text-blue-700"
            >
              Create citizen account
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          CityPulse AI • Smart Civic Complaint Management
        </p>
      </div>
    </section>
  );
}

export default Login;