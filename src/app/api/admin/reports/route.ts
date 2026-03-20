import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import Report from "@/models/Report";

export async function GET() {
  try {
    await dbConnect();
    const reports = await Report.find({}).populate('post').sort({ createdAt: -1 });
    return NextResponse.json(reports);
  } catch (error) {
    return NextResponse.json({ error: "Lỗi kết nối CSDL" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await dbConnect();
    const { id, status } = await req.json();
    const report = await Report.findByIdAndUpdate(id, { status }, { new: true });
    return NextResponse.json(report);
  } catch (error) {
    return NextResponse.json({ error: "Lỗi Server Internal" }, { status: 500 });
  }
}
