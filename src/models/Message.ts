import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String },
  message: { type: String, required: true },
  status: { type: String, enum: ["unread", "read", "resolved"], default: "unread" },
}, { timestamps: true });

export default mongoose.models.Message || mongoose.model("Message", MessageSchema);
