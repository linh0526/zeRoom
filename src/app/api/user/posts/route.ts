import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const session: any = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Fetch posts belonging to the logged in user
    const posts = await Post.find({ user: session.user.id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(posts);
  } catch (error) {
    console.error("GET User Posts Error:", error);
    return NextResponse.json({ error: "Lỗi Server Internal" }, { status: 500 });
  }
}
