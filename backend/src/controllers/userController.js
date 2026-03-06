const User = require("../models/User");

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId).select("-password");

    res.json({
      message: "User profile fetched",
      user
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch profile"
    });
  }
};