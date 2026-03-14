import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import User from "@/models/User";
import Report from "@/models/Report";

export async function GET() {
  try {
    await dbConnect();
    
    const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    const [
      pendingPosts, 
      totalApproved, 
      totalUsers, 
      pendingReports,
      newPosts24h,
      newUsers24h
    ] = await Promise.all([
      Post.countDocuments({ status: "pending" }),
      Post.countDocuments({ status: "approved" }),
      User.countDocuments({}),
      Report.countDocuments({ status: "pending" }),
      Post.countDocuments({ createdAt: { $gte: last24h } }),
      User.countDocuments({ createdAt: { $gte: last24h } })
    ]);

    // Logic "Khu vực Hot" theo tỉnh thành (đã lọc Việt Nam và mã bưu chính)
    const hotAreasRaw = await Post.aggregate([
      { $match: { status: "approved" } },
      { 
        $project: { 
          address: 1, 
          views: { $ifNull: ["$views", 0] },
          // Chuyển địa chỉ thành mảng các phần và lọc bỏ rác
          parts: { $split: ["$address", ", "] }
        } 
      },
      {
        $project: {
          views: 1,
          cleanParts: {
            $filter: {
              input: "$parts",
              as: "part",
              cond: {
                $and: [
                  { $ne: [{ $toLower: "$$part" }, "việt nam"] },
                  { $ne: [{ $toLower: "$$part" }, "vietnam"] },
                  { $not: { $regexMatch: { input: "$$part", regex: "^\\d+$" } } }
                ]
              }
            }
          }
        }
      },
      { 
        $project: { 
          views: 1,
          city: { $arrayElemAt: ["$cleanParts", -1] } 
        } 
      },
      { 
        $group: { 
          _id: "$city", 
          count: { $sum: 1 }, 
          views: { $sum: "$views" } 
        } 
      },
      { $sort: { views: -1, count: -1 } },
      { $limit: 4 }
    ]);

    return NextResponse.json({
      stats: {
        pendingPosts,
        totalApproved,
        totalUsers,
        pendingReports,
        newPosts24h,
        newUsers24h
      },
      hotAreas: hotAreasRaw.map(a => ({
        name: a._id || "Toàn quốc",
        count: a.count,
        views: (a.views > 1000 ? (a.views/1000).toFixed(1) + "k" : a.views || 0)
      }))
    });
  } catch (error) {
    return NextResponse.json({ error: "Lỗi kết nối" }, { status: 500 });
  }
}
