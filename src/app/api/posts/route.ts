import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const revalidate = 60; // Revalidate every 60 seconds

export async function POST(req: Request) {
  try {
    await dbConnect();
    const data = await req.json();
    
    // Simple validation (you can add more with Zod)
    if (!data.title || !data.price || !data.address) {
      return NextResponse.json({ error: "Thiếu thông tin bắt buộc" }, { status: 400 });
    }

    const session: any = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { lat, lng, ...rest } = data;

    const newPost = await Post.create({
      ...rest,
      location: { lat, lng },
      status: "pending", // Always pending for admin review
      user: session.user.id,
    });

    return NextResponse.json({ success: true, post: newPost }, { status: 201 });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Lỗi Server Internal" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(req.url);
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : 0;
    const includeImages = searchParams.get("includeImages") === "true";
    
    // Projection: always exclude images unless specifically requested
    const projection: any = {
      title: 1,
      price: 1,
      address: 1,
      location: 1,
      createdAt: 1,
      category: 1,
      bedrooms: 1,
      phone: 1,
      availableDate: 1,
    };
    
    if (includeImages) {
      projection.images = { $slice: 1 };
    }

    let query = Post.find({ status: "approved" })
      .select(projection)
      .sort({ createdAt: -1 })
      .lean();
    
    if (limit > 0) {
      query = query.limit(limit);
    }

    const posts = await query;
    return NextResponse.json(posts);
  } catch (error) {
    console.error("GET Posts Error:", error);
    return NextResponse.json({ error: "Lỗi Server Internal" }, { status: 500 });
  }
}
