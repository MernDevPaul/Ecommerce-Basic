const mongoose = require("mongoose");

const tax = new mongoose.Schema({
  company_code: { type: mongoose.Schema.Types.ObjectId },
  name: { type: String, required: [true, "Name is required"], trim: true },
  hsn_code: { type: String },
  tax_persentage: { type: Number, required: true },
  status: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now() },
}, {
  timestamps: true,
  versionKey: false,
});

module.exports = mongoose.model("tax", tax);