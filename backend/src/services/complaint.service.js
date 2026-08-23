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