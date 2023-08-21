const mongoose = require("mongoose");

const pages = new mongoose.Schema(
  {
    company_code: mongoose.Schema.Types.ObjectId,
    title: { type: String, required: true },
    slug: { type: String, required: true },
    image: String,
    description: String,
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

module.exports = mongoose.model("pages", pages);
