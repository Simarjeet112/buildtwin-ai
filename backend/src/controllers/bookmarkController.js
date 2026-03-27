const Bookmark = require("../models/Bookmark");

exports.createBookmark = async (req, res) => {
  try {
    const { title, url } = req.body;

    const bookmark = await Bookmark.create({
      userId: req.user.id,
      title,
      url
    });

    res.status(201).json({ message: "Bookmark added", bookmark });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add bookmark" });
  }
};

exports.getBookmarks = async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ userId: req.user.id });
    res.json(bookmarks);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch bookmarks" });
  }
};

exports.deleteBookmark = async (req, res) => {
  try {
    await Bookmark.findByIdAndDelete(req.params.id);
    res.json({ message: "Bookmark removed" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
};