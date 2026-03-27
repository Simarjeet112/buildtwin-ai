const File = require("../models/File");

exports.uploadFile = async (req, res) => {
  try {

    const file = await File.create({
      userId: req.user.userId,
      filename: req.file.filename,
      filepath: req.file.path,
      filetype: req.file.mimetype
    });

    res.status(201).json({
      message: "File uploaded",
      file
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Upload failed"
    });

  }
};


exports.getFiles = async (req, res) => {
  try {

    const files = await File.find({
      userId: req.user.userId
    });

    res.json(files);

  } catch (error) {

    res.status(500).json({
      message: "Failed to fetch files"
    });

  }
};