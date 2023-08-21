const mongoose = require("mongoose");

const blog = new mongoose.Schema(
  {
    company_code: mongoose.Schema.Types.ObjectId,
    title: { type: String, required: true },
    slug:{type:String,required:true},
    image: String,
    description: String,
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "mastersettings",
    },
    tags: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "mastersettings",
    },
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

module.exports = mongoose.model("blog", blog);
