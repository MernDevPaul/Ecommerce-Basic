const mongoose = require("mongoose");

const order = new mongoose.Schema({
  company_code: {
    type: mongoose.Schema.Types.ObjectId,
  },
  buyer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "buyer",
  },
  product: [
    {
      product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
      },
      product_name: String,
      quantity: Number,
      tax: Number,
      tax_persentage: Number,
      tax_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "tax",
      },
      discount_persentage: Number,
      total_discount: Number,
      total: Number,
      mrp: Number,
      sp: Number,
      image: [String],
    },
  ],
  delivery_address: {
    name: String,
    email: String,
    phone: Number,
    alternate_number: Number,
    address: String,
    landmark: String,
    country: String,
    state: String,
    city: String,
    pincode: Number,
  },
  name: String,
  email: String,
  phone: Number,
  cart_total_quantity: {
    type: Number,
    required: true,
  },
  cart_sub_total: {
    type: Number,
    required: true,
  },
  cart_tax: {
    type: Number,
    required: true,
  },
  cart_amount: {
    type: Number,
    required: true,
  },
  cart_total_discount: {
    type: Number,
    required: true,
  },
  company_details: {
    logo: String,
    address: String,
    city: String,
    company_name: String,
    country: String,
    email: String,
    gst_in: String,
    landline: Number,
    map: String,
    pan_no: String,
    phone: Number,
    pincode: Number,
    state: String,
    website: String,
  },
  // response: [String],
  razorpay_payment_id: String,
  razorpay_signature: String,
  razorpay_order_id: String,
  payment_status: String,
  payment_message: String,
  payment_info: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "paymentinfo",
  },
  order_status: {
    type: String,
    default: "Pending",
    enum: [
      "Pending",
      "Packing",
      "Billed",
      "Dispatched",
      "Delivered",
      "Cancelled",
    ],
  },
  order_no: {
    type: Number,
  },
  invoice_no: {
    type: Number,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});


module.exports = mongoose.model("order", order);