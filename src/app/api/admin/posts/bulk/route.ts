import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { posts } = await req.json();

    console.log("[API Bulk] Received posts count:", posts?.length);

    if (!Array.isArray(posts) || posts.length === 0) {
      return NextResponse.json({ error: "Không có dữ liệu bài đăng" }, { status: 400 });
    }

    // Default status when importing
    const { slugify } = await import("@/lib/slugify");
    const User = (await import("@/models/User")).default;
    const adminUser = await User.findOne({ role: "admin" });
    
    const postsWithStatus = posts.map((post: any) => {
      const baseSlug = slugify(post.title || "post");
      return {
        ...post,
        user: adminUser?._id || post.user, // Assign admin as default poster
        slug: `${baseSlug}-${Math.random().toString(36).substring(2, 7)}`, // Unique slug
        status: post.status || "approved",
        category: post.category || "Thuê trọ",
        expiresAt: post.expiresAt || new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) // 60 days
      };
    });

    const result = await Post.insertMany(postsWithStatus, { ordered: false });

    return NextResponse.json({ 
      success: true, 
      count: result.length,
      message: `Đã nhập thành công ${result.length} bài đăng.` 
    });
  } catch (error: any) {
    if (error.name === 'BulkWriteError' || error.name === 'MongoBulkWriteError') {
      return NextResponse.json({ 
        success: true, 
        count: error.result.nInserted,
        errorCount: error.writeErrors?.length || 0,
        message: `Đã nhập thành công ${error.result.nInserted} bài đăng. Có ${error.writeErrors?.length} bài bị lỗi (có thể do trùng lặp).`
      });
    }
    console.error("Bulk import error:", error);
    return NextResponse.json({ 
      error: "Lỗi khi lưu dữ liệu vào database: " + error.message 
    }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await dbConnect();
    const { ids } = await req.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "Danh sách ID không hợp lệ" }, { status: 400 });
    }

    const result = await Post.deleteMany({ _id: { $in: ids } });

    return NextResponse.json({ 
      success: true, 
      count: result.deletedCount,
      message: `Đã xóa thành công ${result.deletedCount} bài đăng.` 
    });
  } catch (error: any) {
    console.error("Bulk delete error:", error);
    return NextResponse.json({ 
      error: "Lỗi khi xóa dữ liệu: " + (error.message || "Lỗi không xác định") 
    }, { status: 500 });
  }
}
