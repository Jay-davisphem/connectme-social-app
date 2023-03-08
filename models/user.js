const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
      maxLength: 16
    },
    name: {
      type: String,
      required: true,
      minLength: 3 
    },
    status: {
      type: String,
      required: true,
      enum: ['Active', 'Inactive']
    },
    posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
