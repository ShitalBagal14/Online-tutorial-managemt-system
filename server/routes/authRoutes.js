const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const upload = require("../middleware/uploadMiddleware");
const User = require("../models/User");

const {
  registerUser,
  loginUser,
  getProfileData,
  updateProfile,
} = require("../controllers/authController");

// ========================
//     AUTH MIDDLEWARE
// ========================
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// ========================
//        ROUTES
// ========================
router.post("/register", registerUser);
router.post("/login", loginUser);

// Get profile
router.get("/profile", authMiddleware, getProfileData);

// Update profile (text + photo upload)
router.put(
  "/profile",
  authMiddleware,
  upload.single("photo"),
  updateProfile
);

// ========================
//      ENROLL COURSE
// ========================
router.post("/enroll-course", authMiddleware, async (req, res) => {
  try {
    const { courseName } = req.body;

    if (!courseName) {
      return res.status(400).json({ message: "Course name required" });
    }

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.enrolledCourses.includes(courseName)) {
      return res.status(400).json({ message: "Already enrolled in this course" });
    }

    user.enrolledCourses.push(courseName);
    await user.save();

    res.json({
      message: "Course enrolled successfully",
      enrolledCourses: user.enrolledCourses
    });

  } catch (error) {
    console.log("Enroll course error:", error);
    res.status(500).json({ message: "Server error enrolling course" });
  }
});

module.exports = router;
