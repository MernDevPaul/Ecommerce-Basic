const mongoose = require("mongoose");

const company_profile = new mongoose.Schema(
  {
    admin_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
      ref: "master_admin",
    },
    company_code: { type: mongoose.Schema.Types.ObjectId, required: true },
    website: { type: String },
    company_name: { type: String },
    address: { type: String },
    phone: { type: Number },
    email: { type: String },
    logo: { type: String },
    pan_no: { type: String },
    gst_in: { type: String },
    map: { type: String },
    landline: { type: String },
    country: { type: String },
    state: { type: String },
    city: { type: String },
    pincode: { type: Number },
    payment_key: { type: String },
    payment_salt: { type: String },
    smtp_username: { type: String },
    smtp_password: { type: String },
    notify_receive: { type: Boolean, default: false },
    new_order_email: { type: Boolean, default: false },
    new_enquiry_email: { type: Boolean, default: false },
    status: { type: Boolean, default: true },
    created_at: { type: Date, default: Date.now() },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("company_profile", company_profile);