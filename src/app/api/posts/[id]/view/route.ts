import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import { cookies } from "next/headers";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await dbConnect();

    const cookieStore = await cookies();
    const viewedKey = `viewed_${id}`;
    const hasViewed = cookieStore.get(viewedKey);

    if (!hasViewed) {
      // Tăng lượt xem trong Database
      if (require("mongoose").Types.ObjectId.isValid(id)) {
        await Post.findByIdAndUpdate(id, { $inc: { views: 1 } });
      } else {
        await Post.findOneAndUpdate({ slug: id }, { $inc: { views: 1 } });
      }

      // Thiết lập cookie để đánh dấu đã xem, hết hạn sau 24h
      const response = NextResponse.json({ success: true });
      response.cookies.set(viewedKey, "true", {
        maxAge: 60 * 60 * 24, // 24 hours
        path: "/",
        httpOnly: true,
      });
      return response;
    }

    return NextResponse.json({ success: true, message: "Already viewed today" });
  } catch (error) {
    console.error("View Count API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
