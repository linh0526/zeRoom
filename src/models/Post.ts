import mongoose, { Schema, model, models } from "mongoose";

const PostSchema = new Schema(
  {
    title: { type: String, required: true },
    category: { type: String, default: "Thuê trọ" },
    address: { type: String, required: true },
    displayAddress: { type: String },
    areaInfo: { type: String },
    price: { type: Number, required: true },
    areaSize: { type: Number },
    bedrooms: { type: Number, default: 1 },
    amenities: [{ type: String }],
    availableDate: { type: Date },
    phone: { type: String, required: true },
    images: [{ type: String }], // URLs to images
    location: {
      lat: { type: Number },
      lng: { type: Number },
    },
    status: { 
      type: String, 
      enum: ["pending", "approved", "rejected", "expired", "hidden"], 
      default: "pending" 
    },
    rejectionReason: { type: String }, // For Admin to specify why
    user: { type: Schema.Types.ObjectId, ref: "User" }, // Poster
    views: { type: Number, default: 0 },
    expiresAt: { type: Date }, // For auto-hiding
    note: { type: String }, // Additional notes/description
  },
  { timestamps: true }
);

// Add indexes for performance optimization
PostSchema.index({ status: 1 });
PostSchema.index({ createdAt: -1 });
PostSchema.index({ status: 1, createdAt: -1 });

const Post = models.Post || model("Post", PostSchema);
export default Post;
