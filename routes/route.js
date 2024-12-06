const express = require("express");
const User = require("../models/user");
const router = express.Router();
const multer = require("multer");
const path = require("path");

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/"); // Create this directory in your project
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const mimeType = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimeType && extname) {
      return cb(null, true);
    }
    cb(new Error("Only image files are allowed"));
  },
});

router.get("/", async (req, res) => {
  try {
    const users = await User.find().sort({ created: -1 });
    res.render("index", {
      title: "Home Page",
      users: users,
    });
  } catch (error) {
    res.status(500).render("index", {
      title: "Home Page",
      users: [],
      error: "Error fetching users",
    });
  }
});

// Create new user
router.post("/users", upload.single("image"), async (req, res) => {
  try {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      image: req.file ? `/uploads/${req.file.filename}` : null,
    });
    await user.save();
    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update user
router.put("/users/:id", upload.single("image"), async (req, res) => {
  try {
    const updateData = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    };

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete user
router.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
