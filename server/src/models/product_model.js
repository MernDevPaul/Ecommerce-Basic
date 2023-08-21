const mongoose = require("mongoose");

const products = new mongoose.Schema({
  company_code: mongoose.Schema.Types.ObjectId,
  product_name: {
    type: String,
    required: [true, "Product name is required"],
    trim: true,
  },
  slug: { type: String, required: [true, "Slug is required"], trim: true },
  product_description: String,
  product_short_description: String,
  sku: String,
  mrp: { type: Number, required: true },
  sp: { type: Number },
  tags: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "mastersettings",
    },
  ],
  category: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "mastersettings",
    },
  ],
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "mastersettings",
  },
  image: [
    {
      image_path: String,
    },
  ],
  discount: { type: Number, default: 0 },
  hot_sale: { type: Boolean, default: false },
  featured_product: { type: Boolean, default: false },
  popular_product: { type: Boolean, default: false },
  status: { type: Boolean, default: true },
  meta_title: String,
  meta_description: String,
  meta_keywords: String,
  purchase_notes: String,
  display_date: { type: Date, default: Date.now() },
  stock_status: { type: Boolean, default: true },
  tax: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "tax",
  },
  specification: [
    {
      name: String,
      description: String,
    },
  ],
  created_at: { type: Date, default: Date.now() },
});

products.index({
  product_name: "text",
  product_description: "text",
});

module.exports = mongoose.model("products", products);