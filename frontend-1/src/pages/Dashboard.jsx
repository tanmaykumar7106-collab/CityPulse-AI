import { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import {
  BarChart3,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  FileText,
  RefreshCw,
  Trash2,
  UserRound,
  Mail,
  Phone,
  MapPin,
  ImageIcon,
  BrainCircuit,
  ShieldAlert,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  getMyComplaints,
  getAllComplaints,
  updateComplaintStatus,
  deleteComplaint,
} from "../services/complaintService";
import { getCurrentUser, isAuthenticated } from "../services/authService";

const COLORS = ["#2563eb", "#0f766e", "#f97316", "#8b5cf6", "#64748b"];

const priorities = ["Low", "Medium", "High", "Critical"];

const statusOptions = [
  "Pending",
  "Assigned",
  "In Progress",
  "Resolved",
  "Rejected",
];

function StatCard({ title, value, subtitle, icon: Icon, iconBg }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="mt-2 text-3xl font-extrabold text-navy">{value}</h3>
          <p className="mt-2 text-xs text-slate-400">{subtitle}</p>
        </div>

        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconBg}`}
        >
          <Icon size={23} className="text-white" />
        </div>
      </div>
    </div>
  );
}

function getPriorityClass(priority = "") {
  switch (priority) {
    case "Critical":
      return "bg-red-50 text-red-700 border-red-200";
    case "High":
      return "bg-orange-100 text-orange-700 border-orange-200";
    case "Medium":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "Low":
      return "bg-green-100 text-green-700 border-green-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
}

function getStatusClass(status = "") {
  switch (status) {
    case "Resolved":
      return "bg-green-100 text-green-700 border-green-200";
    case "In Progress":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "Assigned":
      return "bg-purple-100 text-purple-700 border-purple-200";
    case "Rejected":
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
  }
}

function formatDate(dateValue) {
  if (!dateValue) return "Not available";

  return new Date(dateValue).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function Dashboard() {
  const authenticated = isAuthenticated();
  const user = getCurrentUser();

  const isAdminUser = user?.role === "admin" || user?.role === "officer";

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState("");
  const [statusUpdatingId, setStatusUpdatingId] = useState("");
  const [error, setError] = useState("");

  const loadComplaints = async () => {
    if (!authenticated) return;

    setLoading(true);
    setError("");

    try {
      const data = isAdminUser
        ? await getAllComplaints()
        : await getMyComplaints();

      setComplaints(data);
    } catch (err) {
      setError(err.message || "Unable to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, [authenticated, isAdminUser]);

  const handleDeleteComplaint = async (id) => {
    if (isAdminUser) {
      setError("Admin/officer cannot delete complaints.");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this complaint? This action cannot be undone."
    );

    if (!confirmDelete) return;

    try {
      setDeletingId(id);
      setError("");

      await deleteComplaint(id);

      setComplaints((prev) =>
        prev.filter((complaint) => complaint.id !== id)
      );
    } catch (err) {
      setError(err.message || "Unable to delete complaint.");
    } finally {
      setDeletingId("");
    }
  };

  const handleStatusUpdate = async (id, status) => {
    if (!isAdminUser) {
      setError("Only admin/officer can update complaint status.");
      return;
    }

    try {
      setStatusUpdatingId(id);
      setError("");

      const updatedComplaint = await updateComplaintStatus(
        id,
        status,
        `Status updated to ${status}`
      );

      setComplaints((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
              ...item,
              ...updatedComplaint,
              citizen: item.citizen || updatedComplaint.citizen,
              status,
              remarks: updatedComplaint.remarks || item.remarks,
            }
            : item
        )
      );
    } catch (err) {
      setError(err.message || "Unable to update complaint status.");
    } finally {
      setStatusUpdatingId("");
    }
  };

  const totalComplaints = complaints.length;

  const resolvedComplaints = complaints.filter(
    (item) => item.status === "Resolved"
  ).length;

  const pendingComplaints = complaints.filter((item) =>
    ["Pending", "Assigned", "In Progress"].includes(item.status)
  ).length;

  const criticalComplaints = complaints.filter(
    (item) => item.priority === "Critical"
  ).length;

  const resolutionRate =
    totalComplaints > 0
      ? ((resolvedComplaints / totalComplaints) * 100).toFixed(1)
      : "0.0";

  const issueDistribution = useMemo(() => {
    const grouped = complaints.reduce((acc, complaint) => {
      const category =
        complaint.category && complaint.category !== "AI Processing"
          ? complaint.category
          : "Other";

      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(grouped).map(([name, value]) => ({
      name,
      value,
    }));
  }, [complaints]);

  const priorityData = useMemo(
    () =>
      priorities.map((priority) => ({
        priority,
        count: complaints.filter((complaint) => complaint.priority === priority)
          .length,
      })),
    [complaints]
  );

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <section className="min-h-[calc(100vh-80px)] bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange">
              CityPulse AI
            </p>

            <h1 className="mt-2 text-4xl font-extrabold text-navy">
              {isAdminUser ? "Admin Dashboard" : "Municipal Dashboard"}
            </h1>

            <p className="mt-2 text-slate-500">
              {isAdminUser
                ? `Welcome ${user?.fullName || "Admin"}. View citizen complaints and update their status.`
                : `Welcome ${user?.fullName || "Citizen"}. View your complaints and AI-powered insights.`}
            </p>
          </div>

          <button
            type="button"
            onClick={loadComplaints}
            disabled={loading}
            className="cp-action-button flex w-fit items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-70"
          >
            <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Complaints"
            value={loading ? "..." : totalComplaints}
            subtitle={isAdminUser ? "All citizen complaints" : "Submitted by you"}
            icon={FileText}
            iconBg="bg-blue-600"
          />

          <StatCard
            title="Resolved"
            value={loading ? "..." : resolvedComplaints}
            subtitle={`${resolutionRate}% resolution rate`}
            icon={CheckCircle2}
            iconBg="bg-emerald-500"
          />

          <StatCard
            title="Pending"
            value={loading ? "..." : pendingComplaints}
            subtitle="Awaiting action"
            icon={Clock3}
            iconBg="bg-orange"
          />

          <StatCard
            title="Critical"
            value={loading ? "..." : criticalComplaints}
            subtitle="High attention required"
            icon={AlertTriangle}
            iconBg="bg-red-500"
          />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-navy">
                  Priority Overview
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Complaint distribution by AI priority level.
                </p>
              </div>

              <BarChart3 className="text-blue-600" />
            </div>

            <div className="mt-6 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priorityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="priority" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar
                    dataKey="count"
                    fill="#2563eb"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-navy">Issue Categories</h2>

            <p className="mt-1 text-sm text-slate-500">
              AI-assisted complaint category distribution.
            </p>

            <div className="mt-6 h-72">
              {issueDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={issueDistribution}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={90}
                      label
                    >
                      {issueDistribution.map((entry, index) => (
                        <Cell
                          key={entry.name}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>

                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-slate-400">
                  No complaint data available yet.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-bold text-navy">
                {isAdminUser ? "Citizen Complaints" : "Recent Complaints"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {isAdminUser
                  ? "All complaints submitted by citizens with contact, evidence, AI analysis, and status controls."
                  : "Latest complaints fetched from your backend."}
              </p>
            </div>

            {!isAdminUser && (
              <Link
                to="/report"
                className="cp-action-button w-fit rounded-xl px-5 py-3 text-sm font-semibold transition"
              >
                Report New Complaint
              </Link>
            )}
          </div>

          <div className="mt-6 space-y-5">
            {loading ? (
              <div className="rounded-xl border border-slate-100 p-8 text-center text-sm text-slate-500">
                Loading complaints...
              </div>
            ) : complaints.length > 0 ? (
              complaints.map((complaint) => {
                const firstImage = complaint.images?.[0]?.url;
                const riskScore = complaint.aiAnalysis?.riskScore;
                const imageCount = complaint.images?.length || 0;

                return (
                  <div
                    key={complaint.id}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="grid items-start gap-5 xl:grid-cols-[220px_1fr_auto]">
                      <div className="h-fit self-start overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                        {firstImage ? (
                          <img
                            src={firstImage}
                            alt={complaint.title}
                            className="h-44 w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-44 flex-col items-center justify-center text-slate-400">
                            <ImageIcon size={32} />
                            <p className="mt-2 text-sm">No image</p>
                          </div>
                        )}

                        <div className="flex items-center justify-between px-4 py-3 text-xs font-semibold text-slate-500">
                          <span>{imageCount} image(s)</span>
                          <span>{formatDate(complaint.createdAt)}</span>
                        </div>
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getPriorityClass(
                              complaint.priority
                            )}`}
                          >
                            {complaint.priority || "Medium"}
                          </span>

                          <span
                            className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClass(
                              complaint.status
                            )}`}
                          >
                            {complaint.status || "Pending"}
                          </span>

                          {riskScore !== undefined && riskScore !== null && (
                            <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                              Risk Score: {riskScore}/100
                            </span>
                          )}
                        </div>

                        <h3 className="mt-3 text-lg font-extrabold text-navy">
                          {complaint.title}
                        </h3>

                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                          {complaint.description}
                        </p>

                        <div className="mt-4 grid gap-3 text-sm md:grid-cols-3">
                          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                              Category
                            </p>
                            <p className="mt-1 font-semibold text-slate-700">
                              {complaint.category &&
                                complaint.category !== "AI Processing"
                                ? complaint.category
                                : "Other"}
                            </p>
                          </div>

                          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                              Department
                            </p>
                            <p className="mt-1 font-semibold text-slate-700">
                              {complaint.department || "Not assigned"}
                            </p>
                          </div>

                          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                              Location
                            </p>
                            <p className="mt-1 flex items-start gap-1 font-semibold text-slate-700">
                              <MapPin size={15} className="mt-0.5 shrink-0" />
                              <span className="line-clamp-1">
                                {complaint.locationText || "Not available"}
                              </span>
                            </p>
                          </div>
                        </div>

                        {isAdminUser && complaint.citizen && (
                          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                            <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                              Citizen Contact Details
                            </p>

                            <div className="grid gap-3 text-sm md:grid-cols-3">
                              <div className="flex items-center gap-2">
                                <UserRound size={16} className="text-blue-600" />
                                <span className="text-slate-600">
                                  {complaint.citizen.fullName || "Unknown"}
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <Mail size={16} className="text-blue-600" />
                                <span className="break-all text-slate-600">
                                  {complaint.citizen.email || "Not available"}
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <Phone size={16} className="text-blue-600" />
                                <span className="text-slate-600">
                                  {complaint.citizen.phone || "Not available"}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

                        {complaint.aiAnalysis?.explanation && (
                          <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-4">
                            <div className="flex items-start gap-3">
                              <BrainCircuit
                                size={19}
                                className="mt-0.5 shrink-0 text-blue-600"
                              />
                              <div>
                                <p className="text-sm font-bold text-blue-700">
                                  AI Analysis
                                </p>
                                <p className="mt-1 text-sm leading-6 text-blue-700">
                                  {complaint.aiAnalysis.explanation}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-3 xl:w-44">
                        <Link
                          to={`/track?id=${complaint.id}`}
                          className="rounded-xl bg-blue-50 px-4 py-2.5 text-center text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                        >
                          View Details
                        </Link>

                        {isAdminUser ? (
                          <>
                            <label className="text-xs font-bold uppercase tracking-wide text-slate-400">
                              Update Status
                            </label>

                            <select
                              value={complaint.status || "Pending"}
                              disabled={statusUpdatingId === complaint.id}
                              onChange={(e) =>
                                handleStatusUpdate(complaint.id, e.target.value)
                              }
                              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {statusOptions.map((status) => (
                                <option key={status} value={status}>
                                  {status}
                                </option>
                              ))}
                            </select>

                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs leading-5 text-slate-500">
                              <ShieldAlert
                                size={16}
                                className="mb-1 text-orange-600"
                              />
                              Admin can only view complaints and update status.
                            </div>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleDeleteComplaint(complaint.id)}
                            disabled={deletingId === complaint.id}
                            className="flex items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            <Trash2 size={16} />
                            {deletingId === complaint.id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="rounded-xl border border-slate-100 p-8 text-center text-sm text-slate-500">
                {isAdminUser
                  ? "No citizen complaints found yet."
                  : "No complaints found. Submit your first complaint to see data here."}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;