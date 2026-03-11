import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import User from "@/models/User";
import Report from "@/models/Report";

export async function GET() {
  try {
    await dbConnect();
    
    const [pendingPosts, totalApproved, totalUsers, pendingReports] = await Promise.all([
      Post.countDocuments({ status: "pending" }),
      Post.countDocuments({ status: "approved" }),
      User.countDocuments({}),
      Report.countDocuments({ status: "pending" })
    ]);

    // Simple "Hot Areas" logic
    const hotAreas = await Post.aggregate([
      { $match: { status: "approved" } },
      { $group: { _id: "$address", count: { $sum: 1 }, views: { $sum: "$views" } } },
      { $sort: { count: -1 } },
      { $limit: 4 }
    ]);

    return NextResponse.json({
      stats: {
        pendingPosts,
        totalApproved,
        totalUsers,
        pendingReports
      },
      hotAreas: hotAreas.map(a => ({
        name: a._id.split(",").slice(0, 2).join(",").trim(),
        count: a.count,
        views: (a.views > 1000 ? (a.views/1000).toFixed(1) + "k" : a.views)
      }))
    });
  } catch (error) {
    return NextResponse.json({ error: "Lỗi kết nối" }, { status: 500 });
  }
}
