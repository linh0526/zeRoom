import mongoose, { Schema, model, models } from "mongoose";

const ReportSchema = new Schema(
  {
    post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    reporterName: { type: String, required: true },
    reason: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ["pending", "processed", "dismissed"], default: "pending" },
    urgent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Report = models.Report || model("Report", ReportSchema);
export default Report;
