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
    const { id, status, rejectionReason, expiresAt } = await req.json();
    
    const updateData: any = { status, rejectionReason };
    if (expiresAt) updateData.expiresAt = new Date(expiresAt);
    
    // Nếu duyệt bài và chưa có ngày hết hạn, mới tự động set
    if (status === "approved" && !expiresAt) {
      const post = await Post.findById(id);
      if (post && !post.expiresAt) {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 60);
        updateData.expiresAt = expiryDate;
      }
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      updateData,
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

// Add DELETE to remove post
export async function DELETE(req: Request) {
  try {
    await dbConnect();
    const { id } = await req.json();
    
    const deletedPost = await Post.findByIdAndDelete(id);

    if (!deletedPost) {
      return NextResponse.json({ error: "Không tìm thấy tin đăng" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Lỗi Server Internal" }, { status: 500 });
  }
}
