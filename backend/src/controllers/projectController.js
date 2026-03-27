const Project = require("../models/Project");

exports.createProject = async (req, res) => {
  try {

    const { name, description } = req.body;

    const project = await Project.create({
      name,
      description,
      userId: req.user.id  // ✅ fixed
    });

    res.status(201).json({
      message: "Project created",
      project
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create project",
      error: error.message
    });
  }
};

exports.getProjects = async (req, res) => {
  try {

    const projects = await Project.find({
      userId: req.user.id  // ✅ fixed
    });

    res.json(projects);

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch projects"
    });
  }
};

exports.getProjectById = async (req, res) => {
  try {

    const project = await Project.findById(req.params.id);

    res.json(project);

  } catch (error) {
    res.status(500).json({
      message: "Project not found"
    });
  }
};

exports.deleteProject = async (req, res) => {
  try {

    await Project.findByIdAndDelete(req.params.id);

    res.json({
      message: "Project deleted"
    });

  } catch (error) {
    res.status(500).json({
      message: "Delete failed"
    });
  }
};