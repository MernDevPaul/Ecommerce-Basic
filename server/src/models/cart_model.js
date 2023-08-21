const mongoose = require("mongoose");

const cart = new mongoose.Schema({
  company_code: { type: mongoose.Schema.Types.ObjectId,required:true },
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: "products" ,required:true},
  quantity: { type: Number, required: true, default: 1 },
  buyer_id: { type: mongoose.Schema.Types.ObjectId, ref: "buyer",required:true },
  created_at: { type: Date, default: Date.now },
}, {
  timestamps: true,
  versionKey: false,
});

module.exports = mongoose.model("cart", cart);