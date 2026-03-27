const Activity = require("../models/Activity");

exports.getActivities = async (req, res) => {
  try {

    const activities = await Activity.find({
      userId: req.user.userId
    })
    .sort({ createdAt: -1 })
    .limit(50);

    res.json(activities);

  } catch (error) {

    res.status(500).json({
      message: "Failed to fetch activities"
    });

  }
};