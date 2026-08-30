import { useState } from "react";
import {
  Upload,
  MapPin,
  Send,
  X,
  CheckCircle2,
  Image as ImageIcon,
  Link as LinkIcon,
} from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { createComplaint } from "../services/complaintService";
import { isAuthenticated } from "../services/authService";

const categories = [
  "Roads",
  "Street Lights",
  "Garbage",
  "Water Supply",
  "Drainage",
  "Traffic",
  "Parks",
  "Other",
];

const uploadViews = [
  {
    key: "front",
    title: "Front View",
    description: "Show the complete issue area",
  },
  {
    key: "side",
    title: "Side View",
    description: "Show depth and surroundings",
  },
  {
    key: "close",
    title: "Close View",
    description: "Show detailed damage clearly",
  },
];

function ReportComplaint() {
  const [formData, setFormData] = useState({
    category: "",
    title: "",
    description: "",
    location: "",
    referenceUrl: "",
  });

  const [images, setImages] = useState({
    front: null,
    side: null,
    close: null,
  });

  const [imagePreviews, setImagePreviews] = useState({
    front: null,
    side: null,
    close: null,
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [complaintId, setComplaintId] = useState("");
  const [locationLoading, setLocationLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  const currentUser = JSON.parse(localStorage.getItem("citypulse_user"));

  if (currentUser?.role === "admin" || currentUser?.role === "officer") {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("Each image size must be less than 5 MB.");
      e.target.value = "";
      return;
    }

    if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
      setError("Only JPG, JPEG, and PNG images are allowed.");
      e.target.value = "";
      return;
    }

    if (imagePreviews[type]) {
      URL.revokeObjectURL(imagePreviews[type]);
    }

    setImages((prev) => ({
      ...prev,
      [type]: file,
    }));

    setImagePreviews((prev) => ({
      ...prev,
      [type]: URL.createObjectURL(file),
    }));

    setError("");
  };

  const removeImage = (type) => {
    if (imagePreviews[type]) {
      URL.revokeObjectURL(imagePreviews[type]);
    }

    setImages((prev) => ({
      ...prev,
      [type]: null,
    }));

    setImagePreviews((prev) => ({
      ...prev,
      [type]: null,
    }));
  };

  const clearAllImages = () => {
    Object.values(imagePreviews).forEach((preview) => {
      if (preview) URL.revokeObjectURL(preview);
    });

    setImages({
      front: null,
      side: null,
      close: null,
    });

    setImagePreviews({
      front: null,
      side: null,
      close: null,
    });
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude.toFixed(5);
        const longitude = position.coords.longitude.toFixed(5);

        setFormData((prev) => ({
          ...prev,
          location: `${latitude}, ${longitude}`,
        }));

        setLocationLoading(false);
      },
      () => {
        setLocationLoading(false);
        setError("Unable to get your location. Please enter it manually.");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const resetForm = () => {
    setSubmitted(false);
    setComplaintId("");

    setFormData({
      category: "",
      title: "",
      description: "",
      location: "",
      referenceUrl: "",
    });

    clearAllImages();
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const selectedImages = Object.values(images).filter(Boolean);

      if (selectedImages.length === 0) {
        setError("Please upload at least one image of the issue before submitting.");
        setSubmitting(false);
        return;
      }

      const complaint = await createComplaint({
        formData,
        images: selectedImages,
      });

      setComplaintId(complaint.id);
      setSubmitted(true);
    } catch (err) {
      setError(err.message || "Unable to submit complaint. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-slate-50 px-4 py-12">
        <div className="w-full max-w-xl rounded-3xl bg-white p-8 text-center shadow-xl sm:p-12">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle2 size={42} className="text-emerald-600" />
          </div>

          <h1 className="mt-6 text-3xl font-extrabold text-navy">
            Complaint Submitted!
          </h1>

          <p className="mt-3 text-slate-500">
            Your complaint has been successfully registered with CityPulse AI.
          </p>

          <div className="mt-7 rounded-2xl border border-blue-100 bg-blue-50 p-5">
            <p className="text-sm font-medium text-blue-600">
              Your Complaint ID
            </p>

            <p className="mt-2 break-all text-xl font-extrabold tracking-wide text-navy sm:text-2xl">
              {complaintId}
            </p>

            <p className="mt-2 text-xs text-slate-500">
              Save this ID to track your complaint.
            </p>
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              to={`/track?id=${complaintId}`}
              className="flex-1 rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white transition hover:bg-blue-800"
            >
              Track Complaint
            </Link>

            <button
              type="button"
              onClick={resetForm}
              className="flex-1 rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Report Another
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-[calc(100vh-80px)] bg-slate-50 px-4 py-10 pb-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange">
            Citizen Portal
          </p>

          <h1 className="mt-3 text-4xl font-extrabold text-navy sm:text-5xl">
            Report an Infrastructure Issue
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-slate-500">
            Help improve your city by reporting roads, lighting, sanitation,
            water, and other infrastructure problems.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-10 rounded-3xl bg-white p-6 shadow-lg sm:p-8 lg:p-10"
        >
          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          <div>
            <h2 className="text-xl font-bold text-navy">Complaint Details</h2>
            <p className="mt-1 text-sm text-slate-500">
              Tell us what is wrong.
            </p>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div>
              <label className="text-sm font-semibold text-slate-700">
                Issue Category
              </label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Let AI detect category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">
                AI Priority Detection
              </label>

              <div className="mt-2 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">
                Priority will be automatically decided by AI after analyzing
                complaint text and multi-angle image evidence.
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-slate-700">
                Complaint Title *
              </label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Example: Large pothole near main road"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-slate-700">
                Description *
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={5}
                placeholder="Describe the problem in detail..."
                className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          <div className="mt-10 border-t border-slate-100 pt-8">
            <h2 className="text-xl font-bold text-navy">
              Multi-View Evidence *
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Upload at least one image of the issue. Front, side, and close views help AI understand the problem more accurately.
            </p>

            <div className="mt-5 grid gap-5 md:grid-cols-3">
              {uploadViews.map((item) => (
                <div key={item.key}>
                  {!imagePreviews[item.key] ? (
                    <label className="flex h-56 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 text-center transition hover:border-blue-400 hover:bg-blue-50">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100">
                        <Upload size={24} className="text-blue-600" />
                      </div>

                      <p className="mt-3 font-semibold text-slate-700">
                        {item.title}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {item.description}
                      </p>

                      <p className="mt-2 text-xs text-slate-400">
                        PNG, JPG or JPEG • Max 5 MB
                      </p>

                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/jpg"
                        onChange={(e) => handleImageChange(e, item.key)}
                        className="hidden"
                      />
                    </label>
                  ) : (
                    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white">
                      <img
                        src={imagePreviews[item.key]}
                        alt={item.title}
                        className="h-56 w-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={() => removeImage(item.key)}
                        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-black"
                      >
                        <X size={18} />
                      </button>

                      <div className="flex items-center gap-2 px-4 py-3 text-sm text-slate-600">
                        <ImageIcon size={17} />

                        <div className="min-w-0">
                          <p className="font-semibold text-slate-700">
                            {item.title}
                          </p>

                          <p className="truncate text-xs text-slate-400">
                            {images[item.key]?.name}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="relative mt-5">
              <LinkIcon
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="url"
                name="referenceUrl"
                value={formData.referenceUrl}
                onChange={handleChange}
                placeholder="Optional reference URL, example: news/video/social post link"
                className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          <div className="mt-10 border-t border-slate-100 pt-8">
            <h2 className="text-xl font-bold text-navy">Location</h2>
            <p className="mt-1 text-sm text-slate-500">
              Tell us where the issue is located.
            </p>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <MapPin
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  placeholder="Example: Civil Lines, Prayagraj or 25.4358, 81.8463"
                  className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <button
                type="button"
                disabled={locationLoading}
                onClick={detectLocation}
                className="flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-5 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {locationLoading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-blue-300 border-t-blue-700" />
                    <span>Detecting Location...</span>
                  </>
                ) : (
                  <>
                    <MapPin size={18} />
                    <span>Use My Location</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="mt-10 border-t border-slate-100 pt-8">
            <button
              type="submit"
              disabled={submitting}
              style={{
                backgroundColor: "#1d4ed8",
                color: "white",
              }}
              className="flex min-h-[56px] w-full items-center justify-center gap-3 rounded-xl px-6 py-4 text-base font-bold shadow-lg shadow-blue-900/20 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  <span>Submitting Complaint...</span>
                </>
              ) : (
                <>
                  <Send size={20} />
                  <span>Submit Complaint</span>
                </>
              )}
            </button>

            <p className="mt-3 text-center text-xs text-slate-400">
              Your complaint will be securely registered and assigned a unique
              complaint ID.
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}

export default ReportComplaint;