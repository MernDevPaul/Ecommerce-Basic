const mongoose = require("mongoose");

const includes = new mongoose.Schema(
  {
    company_code: mongoose.Schema.Types.ObjectId,
    header: { type: String, required: true },
    footer: { type: String, required: true },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("includes", includes);
