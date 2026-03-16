import mongoose from "mongoose";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Post from "@/models/Post";

export async function GET() {
  try {
    await dbConnect();
    const users = await User.aggregate([
      {
        $lookup: {
          from: "posts",
          localField: "_id",
          foreignField: "user",
          as: "userPosts"
        }
      },
      {
        $project: {
          _id: { $toString: "$_id" },
          name: 1,
          email: 1,
          phone: 1,
          role: 1,
          status: { $ifNull: ["$status", "active"] },
          isVerified: { $ifNull: ["$isVerified", false] },
          joinedAt: { $ifNull: ["$createdAt", "$updatedAt"] },
          postsCount: { $size: "$userPosts" }
        }
      },
      { $sort: { joinedAt: -1 } }
    ]);

    console.log(`API GET: Found ${users.length} users`);
    return NextResponse.json(users);
  } catch (error) {
    console.error("GET Admin Users Error:", error);
    return NextResponse.json({ error: "Lỗi kết nối CSDL" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { id, ...updateData } = body;
    
    console.log("Admin User Update Request:", { id, updateData });

    if (!id) {
      return NextResponse.json({ error: "Thiếu ID người dùng" }, { status: 400 });
    }

    // Use direct update on the collection to bypass any Mongoose schema caching issues
    const result = await User.collection.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!result) {
      console.log("User not found for ID:", id);
      return NextResponse.json({ error: "Không tìm thấy người dùng" }, { status: 404 });
    }

    console.log("User updated successfully. New stats:", {
      id: id,
      isVerified: result.isVerified,
      status: result.status
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("PUT Admin Users Error:", error);
    return NextResponse.json({ error: error.message || "Lỗi Server Internal" }, { status: 500 });
  }
}
