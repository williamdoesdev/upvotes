const mongoose = require("mongoose");

module.exports = mongoose.model(
  "Topic",
  new mongoose.Schema({
    name: {
      type: String,
      trim: true,
      maxlength: 255,
      required: true,
    },
    description: {
      type: String,
      maxlength: 500,
    },
    upvotes: [
      {
        type: String,
        maxlength: 50,
      },
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  })
);
