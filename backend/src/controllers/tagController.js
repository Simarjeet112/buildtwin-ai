const Tag = require("../models/Tag");

exports.createTag = async (req, res) => {
  try {

    const { name } = req.body;

    const tag = await Tag.create({
      name,
      userId: req.user.userId
    });

    res.status(201).json({
      message: "Tag created",
      tag
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to create tag"
    });

  }
};


exports.getTags = async (req, res) => {
  try {

    const tags = await Tag.find({
      userId: req.user.userId
    });

    res.json(tags);

  } catch (error) {

    res.status(500).json({
      message: "Failed to fetch tags"
    });

  }
};


exports.deleteTag = async (req, res) => {
  try {

    await Tag.findByIdAndDelete(req.params.id);

    res.json({
      message: "Tag deleted"
    });

  } catch (error) {

    res.status(500).json({
      message: "Delete failed"
    });

  }
};