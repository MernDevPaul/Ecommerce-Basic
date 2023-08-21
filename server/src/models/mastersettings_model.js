const mongoose = require("mongoose");
const master_settings = new mongoose.Schema({
  company_code: { type: mongoose.Schema.Types.ObjectId },
  name: { type: String, required: true },
  slug: { type: String},
  parent_id: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
    ref: "mastersettings",
  },
  brand_id: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
    ref: "mastersettings",
  },
  image: { type: String, default: null },
  description: { type: String, default: null },
  country: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
    ref: "mastersettings",
  },
  state: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
    ref: "mastersettings",
  },
  type: { type: String, default: null },
  status: { type: Boolean, default: true },
  done_by: { type: mongoose.Schema.Types.ObjectId },
  created_at: { type: Date, default: Date.now() },
}, {
  timestamps: true,
  versionKey: false,
});

module.exports = mongoose.model("mastersettings", master_settings);
