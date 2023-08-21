const mongoose = require("mongoose");

const order_logs = new mongoose.Schema({
  order_id: { type: mongoose.Schema.Types.ObjectId, ref: "order",required:true },
  order_status: {
    type: String,
    required: true,
    enum: [
      "Pending",
      "Packing",
      "Billed",
      "Dispatched",
      "Delivered",
      "Cancelled",
    ],
  },
  created_at: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model("order_logs", order_logs);