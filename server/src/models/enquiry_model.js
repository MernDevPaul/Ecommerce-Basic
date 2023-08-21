const mongoose = require("mongoose");

const enquiry = new mongoose.Schema(
  {
    company_code: { type: mongoose.Schema.Types.ObjectId },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String},
    created_at: { type: Date, default: Date.now() },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);


module.exports = mongoose.model("enquiry", enquiry);