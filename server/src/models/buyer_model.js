const mongoose = require("mongoose");

const buyer = new mongoose.Schema(
  {
    company_code: { type: mongoose.Schema.Types.ObjectId, required: true },
    name: { type: String, required: [true, "Name is required"], trim: true },
    email: {
      type: String,
      unique: [true, "Email already exists"],
      required: true,
    },
    phone: {
      type: Number,
      unique: [true, "Phone already exists"],
      required: true,
      minLength: [10, "Phone must be longer than 10 characters"],
      maxLength: [10, "Phone must be shorter than 10 characters"],
    },
    password: {
      type: String,
      required: true,
      minLength: [6, "Password must be longer than 6 characters"],
      select: true,
    },
    is_blocked: { type: Boolean, default: false },
    gender: { type: String },
    image: { type: String },
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
      },
    ],
    totalpurchase_amount: { type: Number, default: 0 },
    totalpurchase_quantity: { type: Number, default: 0 },
    status: { type: Boolean, default: true },
    created_at: { type: Date, default: Date.now() },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);


module.exports = mongoose.model("buyer", buyer);