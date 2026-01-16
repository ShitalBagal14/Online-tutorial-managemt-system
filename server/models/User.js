const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  photo: { type: String, default: "" }, // image URL
  phone: { type: String, default: "" },
  className: { type: String, default: "" },
  bio: { type: String, default: "" },

  enrolledCourses: {
    type: Array,
    default: []
  }
});

module.exports = mongoose.model("User", UserSchema);
