import Complaint from "../models/Complaint.js";

export const createComplaint = async (data) => {
    return await Complaint.create(data);
};

export const getComplaintsByCitizen = async (citizenId) => {
    return await Complaint.find({ citizen: citizenId })
        .sort({ createdAt: -1 });
};

export const getComplaintById = async (id) => {
    return await Complaint.findById(id)
        .populate("citizen", "-password")
        .populate("assignedOfficer", "-password");
};

export const updateComplaint = async (id, data) => {
    return await Complaint.findByIdAndUpdate(
        id,
        data,
        {
            new: true,
            runValidators: true,
        }
    );
};

export const deleteComplaint = async (id) => {
    return await Complaint.findByIdAndDelete(id);
};

export const getAllComplaints = async () => {
    return await Complaint.find()
        .sort({ createdAt: -1 })
        .populate("citizen", "fullName email phone role")
        .populate("assignedOfficer", "fullName email phone role");
};

export const updateComplaintStatus = async (id, status, remarks, officerId) => {
    const complaint = await Complaint.findById(id);

    if (!complaint) {
        return null;
    }

    complaint.status = status;

    if (remarks !== undefined) {
        complaint.remarks = remarks;
    }

    complaint.assignedOfficer = officerId;

    return await complaint.save();
};