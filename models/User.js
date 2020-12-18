const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  googleUserId: String,
  name: String,
  avatar: {
    type: String,
    default:
      "https://cityhope.cc/wp-content/uploads/2020/01/default-avatar.png",
  },
  balance: { type: Number, default: 0 },
});

module.exports = mongoose.model("User", userSchema);
