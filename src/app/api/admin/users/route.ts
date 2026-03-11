import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  try {
    await dbConnect();
    const users = await User.find({}).sort({ joinedAt: -1 });
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: "Lỗi kết nối CSDL" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await dbConnect();
    const { id, status } = await req.json();
    const user = await User.findByIdAndUpdate(id, { status }, { new: true });
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: "Lỗi Server Internal" }, { status: 500 });
  }
}
