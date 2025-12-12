import Complaint from "../models/Complaint.model.js";

export const createComplaint = async (req, res) => {
  try {
    const { id } = req.params; // user ID
    const { username, complaint } = req.body;

    if (!username || !complaint) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newComplaint = await Complaint.create({
      userId: id,
      username,
      complaint,
    });

    console.log(newComplaint);

    return res.status(201).json({ complaint: newComplaint });
  } catch (err) {
    console.error("Complaint Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserComplaints = async (req, res) => {
  try {
    const { id } = req.params;

    const complaints = await Complaint.find({ userId: id }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      complaints,
    });
  } catch (err) {
    console.error("Get Complaint Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
