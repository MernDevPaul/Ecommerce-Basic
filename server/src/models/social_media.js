const mongoose = require("mongoose");

const social_media = new mongoose.Schema({
  company_code: { type: mongoose.Schema.Types.ObjectId },
  name: { type: String, required: true },
  url: { type: String, required: true },
  image: String,
  status: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now() },
}, {
  timestamps: true,
  versionKey: false,
});

module.exports = mongoose.model("social_media", social_media);