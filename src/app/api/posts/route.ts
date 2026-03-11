import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const data = await req.json();
    
    // Simple validation (you can add more with Zod)
    if (!data.title || !data.price || !data.address) {
      return NextResponse.json({ error: "Thiếu thông tin bắt buộc" }, { status: 400 });
    }

    const { lat, lng, ...rest } = data;

    const newPost = await Post.create({
      ...rest,
      location: { lat, lng },
      status: "pending", // Always pending for admin review
    });

    return NextResponse.json({ success: true, post: newPost }, { status: 201 });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Lỗi Server Internal" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await dbConnect();
    const posts = await Post.find({ status: "approved" }).sort({ createdAt: -1 });
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: "Lỗi Server Internal" }, { status: 500 });
  }
}
