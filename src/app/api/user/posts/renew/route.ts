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

    // Kiểm tra spam: Chỉ cho phép gia hạn nếu còn <= 10 ngày hoặc đã hết hạn
    const now = new Date();
    if (post.expiresAt) {
      const currentExpiry = new Date(post.expiresAt);
      const daysRemaining = (currentExpiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
      
      if (daysRemaining > 10) {
        return NextResponse.json({ 
          error: `Bạn chỉ có thể gia hạn khi tin còn dưới 10 ngày (Hiện còn ${Math.ceil(daysRemaining)} ngày)` 
        }, { status: 400 });
      }
    }

    // Gia hạn thêm 60 ngày
    const currentExpiry = post.expiresAt ? new Date(post.expiresAt) : new Date();
    const baseDate = currentExpiry < now ? now : currentExpiry;
    
    const newExpiry = new Date(baseDate);
    newExpiry.setDate(newExpiry.getDate() + 60);

    post.expiresAt = newExpiry;
    // Nếu đang ở trạng thái expired, chuyển về approved sau khi gia hạn? 
    // Thường cần duyệt lại hoặc tự động approved tùy policy. 
    // Ở đây ta giữ nguyên trạng thái cũ hoặc chuyển về approved nếu đang expired.
    if (post.status === "expired") {
        post.status = "approved";
    }
    
    await post.save();

    return NextResponse.json({ success: true, newExpiry });
  } catch (error) {
    console.error("Renew Post Error:", error);
    return NextResponse.json({ error: "Lỗi Server Internal" }, { status: 500 });
  }
}
