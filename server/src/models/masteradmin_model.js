const mongoose = require("mongoose");

const master_admin = new mongoose.Schema({
  name: { type: String, required: [true, "Name is required"],trim: true },
  email: { type: String, unique: [true, "Email already exists"], required: true },
  phone: { type: Number, unique: [true, "Phone already exists"], required: true,minLength: [10, "Phone must be longer than 10 characters"],maxLength: [10, "Phone must be shorter than 10 characters"] },
  password: { type: String, required: true,minLength: [6, "Password must be longer than 6 characters"],select: false },
  status: { type: Boolean, default: true },
  is_blocked: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now() },
  company_code: { type: mongoose.Schema.Types.ObjectId,unique: [true,"Company code already exists"] },
}, {
  timestamps: true,
  versionKey: false,
});


module.exports = mongoose.model("master_admin", master_admin);