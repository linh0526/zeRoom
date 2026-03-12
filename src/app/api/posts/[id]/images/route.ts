import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await dbConnect();
    
    const post: any = await Post.findById(id).select("images").lean();
    
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    
    return NextResponse.json({ images: post.images || [] });
  } catch (error) {
    console.error("Error fetching post images:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
