const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name cannot be blank"],
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: [true, "Email cannot be blank"],
      validate: {
        validator: validator.isEmail,
        message: "Please provide a valid email",
      },
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password cannot be blank"],
      minlength: 8,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function () {
  console.log(this.password);
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.method("comparePassword", async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
});

module.exports = mongoose.model("User", UserSchema);
