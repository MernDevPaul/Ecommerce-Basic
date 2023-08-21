const mongoose = require("mongoose");

const webmenus = new mongoose.Schema(
  {
    company_code: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    url: { type: String, required: true },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "webmenus",
      required: false,
      default: null,
    },
    image: String,
    order_no:{type:Number,required:true},
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

module.exports = mongoose.model("webmenus", webmenus);
