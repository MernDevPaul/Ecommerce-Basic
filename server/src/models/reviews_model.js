const mongoose = require("mongoose");

const review = new mongoose.Schema(
  {
    company_code: { type: mongoose.Schema.Types.ObjectId },
    buyer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "buyer",
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
      required: true,
    },
    rating: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: Boolean, default: true },
    created_at: { type: Date, default: Date.now() },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("review", review);