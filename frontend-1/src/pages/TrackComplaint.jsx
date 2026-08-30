import { useEffect, useState } from "react";
import {
  Search,
  MapPin,
  ShieldAlert,
  Building2,
  FileText,
  Image as ImageIcon,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { getComplaintById } from "../services/complaintService";

const getPriorityClass = (priority = "") => {
  switch (priority) {
    case "Critical":
      return "bg-red-100 text-red-700 border-red-200";
    case "High":
      return "bg-orange-100 text-orange-700 border-orange-200";
    case "Medium":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "Low":
      return "bg-green-100 text-green-700 border-green-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
};

const getStatusClass = (status = "") => {
  switch (status) {
    case "Resolved":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "In Progress":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "Assigned":
      return "bg-purple-100 text-purple-700 border-purple-200";
    case "Rejected":
      return "bg-red-100 text-red-700 border-red-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
};

function TrackComplaint() {
  const [searchParams] = useSearchParams();
  const queryId = searchParams.get("id") || "";

  const [complaintId, setComplaintId] = useState(queryId);
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  const fetchComplaint = async (id) => {
    if (!id.trim()) {
      setError("Please enter a valid complaint ID.");
      return;
    }

    setLoading(true);
    setError("");
    setSearched(true);

    try {
      const data = await getComplaintById(id.trim());
      setComplaint(data);
    } catch (err) {
      setComplaint(null);
      setError(err.message || "Complaint not found.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (queryId) {
      fetchComplaint(queryId);
    }
  }, [queryId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchComplaint(complaintId);
  };

  const aiAnalysis = complaint?.aiAnalysis || {};
  const riskScore = aiAnalysis.riskScore ?? "Not available";

  return (
    <section className="min-h-[calc(100vh-80px)] bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
            Complaint Tracking
          </p>

          <h1 className="mt-3 text-4xl font-extrabold text-slate-900 sm:text-5xl">
            Track Your Complaint
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-slate-500">
            Enter your complaint ID to check the current status, AI priority,
            department, and submitted evidence.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-10 flex max-w-3xl flex-col gap-3 rounded-3xl bg-white p-4 shadow-lg sm:flex-row"
        >
          <div className="relative flex-1">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={complaintId}
              onChange={(e) => setComplaintId(e.target.value)}
              placeholder="Enter complaint ID"
              className="w-full rounded-2xl border border-slate-200 py-4 pl-12 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: "#1d4ed8",
              color: "white",
            }}
            className="flex items-center justify-center gap-2 rounded-2xl px-6 py-4 font-bold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search size={20} />
                Track
              </>
            )}
          </button>
        </form>

        {error && (
          <div className="mx-auto mt-6 flex max-w-3xl items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-600">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        {!complaint && searched && !loading && !error && (
          <div className="mx-auto mt-8 max-w-3xl rounded-3xl bg-white p-10 text-center shadow-lg">
            <AlertCircle size={44} className="mx-auto text-slate-400" />
            <h2 className="mt-4 text-xl font-bold text-slate-800">
              No complaint found
            </h2>
            <p className="mt-2 text-slate-500">
              Please check your complaint ID and try again.
            </p>
          </div>
        )}

        {complaint && (
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <div className="rounded-3xl bg-white p-6 shadow-lg">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-400">
                      Complaint ID
                    </p>

                    <h2 className="mt-1 break-all text-2xl font-extrabold text-slate-900">
                      {complaint.id}
                    </h2>
                  </div>

                  <span
                    className={`inline-flex w-fit rounded-full border px-4 py-2 text-sm font-bold ${getStatusClass(
                      complaint.status
                    )}`}
                  >
                    {complaint.status}
                  </span>
                </div>

                <div className="mt-6 border-t border-slate-100 pt-6">
                  <h3 className="text-2xl font-bold text-slate-900">
                    {complaint.title}
                  </h3>

                  <p className="mt-3 leading-7 text-slate-600">
                    {complaint.description}
                  </p>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                    <div className="flex items-center gap-3">
                      <FileText className="text-blue-600" size={22} />
                      <p className="text-sm font-semibold text-slate-400">
                        Category
                      </p>
                    </div>

                    <p className="mt-3 text-lg font-bold text-slate-800">
                      {complaint.category || "AI Processing"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                    <div className="flex items-center gap-3">
                      <Building2 className="text-blue-600" size={22} />
                      <p className="text-sm font-semibold text-slate-400">
                        Department
                      </p>
                    </div>

                    <p className="mt-3 text-lg font-bold text-slate-800">
                      {complaint.department || "Not assigned"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                    <div className="flex items-center gap-3">
                      <ShieldAlert className="text-blue-600" size={22} />
                      <p className="text-sm font-semibold text-slate-400">
                        AI Priority
                      </p>
                    </div>

                    <span
                      className={`mt-3 inline-flex rounded-full border px-4 py-2 text-sm font-bold ${getPriorityClass(
                        complaint.priority
                      )}`}
                    >
                      {complaint.priority || "Medium"}
                    </span>
                  </div>

                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="text-blue-600" size={22} />
                      <p className="text-sm font-semibold text-slate-400">
                        Risk Score
                      </p>
                    </div>

                    <p className="mt-3 text-lg font-bold text-slate-800">
                      {riskScore}
                      {typeof riskScore === "number" ? "/100" : ""}
                    </p>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-5">
                  <div className="flex items-center gap-3">
                    <MapPin className="text-blue-600" size={22} />
                    <p className="text-sm font-semibold text-slate-400">
                      Location
                    </p>
                  </div>

                  <p className="mt-3 text-slate-700">
                    {complaint.locationText || "Location not available"}
                  </p>
                </div>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-lg">
                <h3 className="text-xl font-bold text-slate-900">
                  AI Analysis
                </h3>

                <div className="mt-5 space-y-4">
                  <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
                    <p className="text-sm font-bold text-blue-700">
                      AI Explanation
                    </p>

                    <p className="mt-2 leading-7 text-slate-700">
                      {aiAnalysis.explanation ||
                        "AI explanation is not available for this complaint."}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                    <p className="text-sm font-bold text-slate-700">
                      Image Observation
                    </p>

                    <p className="mt-2 leading-7 text-slate-600">
                      {aiAnalysis.imageObservation ||
                        "No detailed image observation available."}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                    <p className="text-sm font-bold text-slate-700">
                      Confidence
                    </p>

                    <p className="mt-2 text-slate-600">
                      {aiAnalysis.confidence
                        ? `${aiAnalysis.confidence}%`
                        : "Not available"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-lg">
                <div className="flex items-center gap-3">
                  <ImageIcon className="text-blue-600" size={24} />
                  <h3 className="text-xl font-bold text-slate-900">
                    Uploaded Evidence
                  </h3>
                </div>

                {complaint.images && complaint.images.length > 0 ? (
                  <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {complaint.images.map((image, index) => (
                      <a
                        key={image.publicId || index}
                        href={image.url}
                        target="_blank"
                        rel="noreferrer"
                        className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 transition hover:-translate-y-1 hover:shadow-lg"
                      >
                        <img
                          src={image.url}
                          alt={`Complaint evidence ${index + 1}`}
                          className="h-56 w-full object-cover"
                        />

                        <div className="px-4 py-3">
                          <p className="text-sm font-bold text-slate-700">
                            Evidence Image {index + 1}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            Click to view full image
                          </p>
                        </div>
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 rounded-2xl bg-slate-50 p-5 text-slate-500">
                    No image evidence found.
                  </p>
                )}
              </div>
            </div>

            <aside className="space-y-6">
              <div className="rounded-3xl bg-white p-6 shadow-lg">
                <h3 className="text-xl font-bold text-slate-900">
                  Status Timeline
                </h3>

                <div className="mt-6 space-y-5">
                  {["Pending", "Assigned", "In Progress", "Resolved"].map(
                    (status) => {
                      const active = complaint.status === status;

                      return (
                        <div key={status} className="flex gap-3">
                          <div
                            className={`mt-1 h-4 w-4 rounded-full ${active ? "bg-blue-600" : "bg-slate-300"
                              }`}
                          />

                          <div>
                            <p
                              className={`font-bold ${active ? "text-blue-700" : "text-slate-500"
                                }`}
                            >
                              {status}
                            </p>

                            <p className="text-sm text-slate-400">
                              {active
                                ? "Current complaint stage"
                                : "Stage in complaint lifecycle"}
                            </p>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>

              <div className="rounded-3xl border border-blue-100 bg-blue-50 p-6">
                <h3 className="text-lg font-bold text-blue-800">
                  What happens next?
                </h3>

                <p className="mt-3 leading-7 text-blue-700">
                  Your complaint is reviewed by the assigned department. The
                  officer/admin can update the status as the issue progresses.
                </p>
              </div>

              {complaint.remarks && (
                <div className="rounded-3xl bg-white p-6 shadow-lg">
                  <h3 className="text-xl font-bold text-slate-900">
                    Officer Remarks
                  </h3>

                  <p className="mt-3 leading-7 text-slate-600">
                    {complaint.remarks}
                  </p>
                </div>
              )}
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}

export default TrackComplaint;