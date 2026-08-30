import apiRequest from "./api";

const normalizeComplaint = (complaint = {}) => ({
  ...complaint,
  id: complaint._id || complaint.id || "",
  priority: complaint.priority || "Medium",
  category: complaint.category || "AI Processing",
  department: complaint.department || "AI Processing",
  status: complaint.status || "Pending",
  images: Array.isArray(complaint.images) ? complaint.images : [],
  locationText: complaint.location?.address || complaint.location || "",
  citizen: complaint.citizen || null,
});

export const createComplaint = async ({ formData, images = [] }) => {
  const data = new FormData();

  data.append("title", formData.title);
  data.append("description", formData.description);

  if (formData.category) data.append("category", formData.category);
  if (formData.location) data.append("address", formData.location);
  if (formData.referenceUrl) data.append("referenceUrl", formData.referenceUrl);

  images.forEach((image) => {
    if (image) {
      data.append("images", image);
    }
  });

  const complaint = await apiRequest("/complaints", {
    method: "POST",
    body: data,
  });

  return normalizeComplaint(complaint);
};

export const getMyComplaints = async () => {
  const complaints = await apiRequest("/complaints", {
    method: "GET",
  });

  return Array.isArray(complaints)
    ? complaints.map(normalizeComplaint)
    : [];
};

export const getAllComplaints = async () => {
  const complaints = await apiRequest("/complaints/admin/all", {
    method: "GET",
  });

  return Array.isArray(complaints)
    ? complaints.map(normalizeComplaint)
    : [];
};

export const getComplaintById = async (id) => {
  const complaint = await apiRequest(`/complaints/${id}`, {
    method: "GET",
  });

  return normalizeComplaint(complaint);
};

export const updateComplaint = async (id, formData) => {
  const complaint = await apiRequest(`/complaints/${id}`, {
    method: "PUT",
    body: JSON.stringify(formData),
  });

  return normalizeComplaint(complaint);
};

export const updateComplaintStatus = async (id, status, remarks = "") => {
  const complaint = await apiRequest(`/complaints/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({
      status,
      remarks,
    }),
  });

  return normalizeComplaint(complaint);
};

export const deleteComplaint = async (id) => {
  return await apiRequest(`/complaints/${id}`, {
    method: "DELETE",
  });
};