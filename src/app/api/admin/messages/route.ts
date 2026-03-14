import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Message from "@/models/Message";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions) as any;
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const messages = await Message.find().sort({ createdAt: -1 });

    return NextResponse.json({ messages });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions) as any;
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await req.json();
    await dbConnect();
    await Message.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
    try {
      const session = await getServerSession(authOptions) as any;
      if (!session || session.user?.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
  
      const { id, status } = await req.json();
      await dbConnect();
      await Message.findByIdAndUpdate(id, { status });
  
      return NextResponse.json({ success: true });
    } catch (error) {
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }
