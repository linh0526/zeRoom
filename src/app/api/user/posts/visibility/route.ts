import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    const session: any = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { postId } = await req.json();
    if (!postId) {
      return NextResponse.json({ error: "Missing post ID" }, { status: 400 });
    }

    await dbConnect();

    const post = await Post.findOne({ _id: postId, user: session.user.id });
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Toggle logic
    if (post.status === "hidden") {
      post.status = "approved"; // Or "pending" if you want re-approval
    } else if (post.status === "approved") {
      post.status = "hidden";
    } else {
      return NextResponse.json({ 
        error: "Chỉ có thể ẩn/hiện các bài đăng đã được duyệt" 
      }, { status: 400 });
    }
    
    await post.save();

    return NextResponse.json({ success: true, status: post.status });
  } catch (error) {
    console.error("Toggle Visibility Error:", error);
    return NextResponse.json({ error: "Lỗi Server Internal" }, { status: 500 });
  }
}
