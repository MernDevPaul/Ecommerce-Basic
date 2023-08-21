const mongoose = require("mongoose");

const deliveryaddress = new mongoose.Schema({
  company_code: mongoose.Schema.Types.ObjectId,
  buyer_id:{ type: mongoose.Schema.Types.ObjectId,required: true,ref: "buyer" },
  name: String,
  email: { type: String, required: true },
  phone: { type: Number, required: true, minLength: [10, "Phone must be longer than 10 characters"], maxLength: [10, "Phone must be shorter than 10 characters"] },
  alternate_number: { type: Number },
  address: { type: String,required: true },
  landmark: { type: String },
  country: { type: String,required: true },
  state: { type: String,required: true },
  city: { type: String ,required: true},
  pincode: { type: Number, required: true, minLength: [6, "Pincode must be longer than 6 characters"], maxLength: [6, "Pincode must be shorter than 6 characters"] },
  is_default: { type: Boolean, default: false },
  status: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now() },
}, {
  timestamps: true,
  versionKey: false,
});


module.exports = mongoose.model("deliveryaddress", deliveryaddress);