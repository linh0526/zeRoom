import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Message from "@/models/Message";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { name, phone, email, subject, message } = body;

    if (!name || !phone || !email || !message) {
      return NextResponse.json({ error: "Thiếu thông tin bắt buộc" }, { status: 400 });
    }

    const newMessage = await Message.create({
      name,
      phone,
      email,
      subject,
      message
    });

    return NextResponse.json({ success: true, message: newMessage });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json({ error: "Lỗi máy chủ nội bộ" }, { status: 500 });
  }
}
