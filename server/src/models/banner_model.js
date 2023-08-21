const mongoose = require("mongoose");

const banner = new mongoose.Schema(
  {
    company_code: mongoose.Schema.Types.ObjectId,
    title: { type: String, required: true },
    image: String,
    description: String,
    tagline: String,
    button: [
      {
        name: String,
        link: String,
      },
    ],
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


module.exports = mongoose.model("banner", banner);