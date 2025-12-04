import Settings from "../models/Settings.js";

// @desc    Get company settings
// @route   GET /api/settings
// @access  Private
export const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      // Create default settings if none exist
      settings = await Settings.create({});
    }
    res.status(200).json(settings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Update company settings
// @route   PUT /api/settings
// @access  Private
export const updateSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings(req.body);
    } else {
      Object.assign(settings, req.body);
    }
    const updatedSettings = await settings.save();
    res.status(200).json(updatedSettings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
