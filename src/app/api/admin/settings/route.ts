import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Settings from "@/models/Settings";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    await dbConnect();
    const settings = await Settings.find({});
    // Convert to a simple key-value object
    const config = settings.reduce((acc: any, curr: any) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});
    
    // Default values if not exist
    const finalConfig = {
      requireApprovalNew: config.requireApprovalNew ?? true,
      requireApprovalEdit: config.requireApprovalEdit ?? true,
      ...config
    };

    return NextResponse.json(finalConfig);
  } catch (error) {
    return NextResponse.json({ error: "Lỗi tải cấu hình" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session: any = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const data = await req.json();

    for (const [key, value] of Object.entries(data)) {
      await Settings.findOneAndUpdate(
        { key },
        { key, value },
        { upsert: true, new: true }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Lỗi lưu cấu hình" }, { status: 500 });
  }
}
