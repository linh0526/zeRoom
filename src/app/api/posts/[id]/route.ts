import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import Settings from "@/models/Settings";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const post = await Post.findById(id).lean();
    if (!post) {
      return NextResponse.json({ error: "Không tìm thấy bài đăng" }, { status: 404 });
    }
    return NextResponse.json(post);
  } catch (error: any) {
    console.error("GET Post Error:", error);
    return NextResponse.json({ error: "Lỗi Server Internal" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session: any = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;
    const data = await req.json();

    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json({ error: "Không tìm thấy bài đăng" }, { status: 404 });
    }

    // Check ownership or admin role
    if (post.user.toString() !== session.user.id && session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Lấy cấu hình duyệt khi sửa
    const approvalSetting = await Settings.findOne({ key: "requireApprovalEdit" });
    const requireApproval = approvalSetting ? approvalSetting.value : true;

    // Xác định trạng thái mới
    let newStatus = post.status;
    let clearRejection = false;
    
    if (session.user.role !== "admin" && requireApproval) {
      newStatus = "pending";
      clearRejection = true;
    }

    // Update fields
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { 
        ...data, 
        status: newStatus,
        ...(clearRejection ? { rejectionReason: "" } : {})
      },
      { new: true }
    );

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("Update Post Error:", error);
    return NextResponse.json({ error: "Lỗi Server Internal" }, { status: 500 });
  }
}
