import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { FileText, Clock3, CheckCircle2, AlertTriangle, RefreshCw } from "lucide-react";
import { getMyComplaints, updateComplaint } from "../services/complaintService";
import { isAuthenticated } from "../services/authService";

const statusOptions = ["Pending", "Assigned", "In Progress", "Resolved", "Rejected"];

function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadComplaints = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getMyComplaints();
      setComplaints(data);
    } catch (err) {
      setError(err.message || "Unable to load complaints.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated()) loadComplaints();
  }, []);

  if (!isAuthenticated()) return <Navigate to="/login" replace />;

  const updateStatus = async (id, newStatus) => {
    const previousComplaints = complaints;

    setComplaints((prev) =>
      prev.map((complaint) =>
        complaint.id === id ? { ...complaint, status: newStatus } : complaint
      )
    );

    try {
      await updateComplaint(id, { status: newStatus });
    } catch (err) {
      setComplaints(previousComplaints);
      setError(err.message || "Status update failed.");
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Resolved":
        return "bg-emerald-100 text-emerald-700";
      case "In Progress":
        return "bg-blue-100 text-blue-700";
      case "Assigned":
        return "bg-orange-100 text-orange-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  const total = complaints.length;
  const pending = complaints.filter((item) => item.status !== "Resolved").length;
  const resolved = complaints.filter((item) => item.status === "Resolved").length;
  const critical = complaints.filter((item) => item.priority === "Critical").length;

  return (
    <section className="min-h-[calc(100vh-80px)] bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange">CityPulse AI</p>
            <h1 className="mt-2 text-4xl font-extrabold text-navy">Complaint Management</h1>
            <p className="mt-2 text-slate-500">Review citizen complaints and update their progress.</p>
          </div>

          <button
            type="button"
            onClick={loadComplaints}
            disabled={loading}
            className="flex w-fit items-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-70"
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
          <SummaryCard title="Total" value={loading ? "..." : total} icon={FileText} iconBg="bg-blue-100" iconColor="text-blue-600" />
          <SummaryCard title="Pending" value={loading ? "..." : pending} icon={Clock3} iconBg="bg-orange-100" iconColor="text-orange-600" />
          <SummaryCard title="Resolved" value={loading ? "..." : resolved} icon={CheckCircle2} iconBg="bg-emerald-100" iconColor="text-emerald-600" />
          <SummaryCard title="Critical" value={loading ? "..." : critical} icon={AlertTriangle} iconBg="bg-red-100" iconColor="text-red-600" />
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-6">
            <h2 className="text-xl font-bold text-navy">Citizen Complaints</h2>
            <p className="mt-1 text-sm text-slate-500">Update complaint status as municipal teams process the issue.</p>
          </div>

          {complaints.length === 0 ? (
            <div className="p-12 text-center">
              <FileText size={40} className="mx-auto text-slate-300" />
              <p className="mt-4 font-semibold text-slate-600">No complaints yet</p>
              <p className="mt-1 text-sm text-slate-400">Submitted complaints will appear here.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {complaints.map((complaint) => (
                <div key={complaint.id} className="p-6 transition hover:bg-slate-50">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="font-bold text-navy">{complaint.title}</h3>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(complaint.status)}`}>
                          {complaint.status}
                        </span>
                      </div>

                      <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
                        <span>
                          ID: <strong className="text-slate-700">{complaint.id}</strong>
                        </span>
                        <span>
                          Category: <strong className="text-slate-700">{complaint.category || "AI Processing"}</strong>
                        </span>
                        <span>
                          Priority: <strong className="text-slate-700">{complaint.priority}</strong>
                        </span>
                      </div>

                      <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">{complaint.description}</p>
                      <p className="mt-2 text-xs text-slate-400">{complaint.locationText}</p>
                    </div>

                    <div className="w-full lg:w-52">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Update Status</label>
                      <select
                        value={complaint.status}
                        onChange={(e) => updateStatus(complaint.id, e.target.value)}
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function SummaryCard({ title, value, icon: Icon, iconBg, iconColor }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconBg}`}>
          <Icon size={21} className={iconColor} />
        </div>
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="text-2xl font-bold text-navy">{value}</p>
        </div>
      </div>
    </div>
  );
}

export default AdminComplaints;
