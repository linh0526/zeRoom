import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";

export async function GET() {
  try {
    await dbConnect();
    // Admin gets ALL posts sorted by latest
    const posts = await Post.find({}).sort({ createdAt: -1 });
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: "Lỗi kết nối CSDL" }, { status: 500 });
  }
}

// Add PUT to approve/reject
export async function PUT(req: Request) {
  try {
    await dbConnect();
    const { id, status, rejectionReason } = await req.json();
    
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { status, rejectionReason },
      { new: true }
    );

    if (!updatedPost) {
      return NextResponse.json({ error: "Không tìm thấy tin đăng" }, { status: 404 });
    }

    return NextResponse.json(updatedPost);
  } catch (error) {
    return NextResponse.json({ error: "Lỗi Server Internal" }, { status: 500 });
  }
}
