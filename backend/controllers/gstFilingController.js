import GstFiling from "../models/GstFilingModel.js";

// Save a new filing
export const createGSTFiling = async (req, res) => {
  try {
    const newFiling = new GstFiling(req.body);
    await newFiling.save();
    res
      .status(201)
      .json({ message: "GST Filing saved successfully", filing: newFiling });
  } catch (error) {
    res.status(500).json({ message: "Error saving filing", error });
  }
};

// Get all filings
export const getAllFilings = async (req, res) => {
  try {
    const filings = await GstFiling.find().sort({ createdAt: -1 });
    res.json(filings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching filings", error });
  }
};
