import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    password: { type: String, required: true }, // For future auth
    role: { type: String, enum: ["user", "admin"], default: "user" },
    status: { type: String, enum: ["active", "warning", "banned"], default: "active" },
    joinedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const User = models.User || model("User", UserSchema);
export default User;
