import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../../../lib/connectDB";
import { User } from "~~/model/User";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const user_id = params.id;
  const user = await User.findById(user_id);
  if (!user) {
    return new NextResponse(JSON.stringify({ message: "User not found" }), { status: 404 });
  }
  return new NextResponse(JSON.stringify(user));
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const user_id = params.id;
  const payload = await req.json();

  const { userJson } = payload;
  const user = await User.findByIdAndUpdate(user_id, { userJson }, { new: true });
  if (!user) {
    return new NextResponse(JSON.stringify({ message: "User not found" }), { status: 404 });
  }
  return new NextResponse(JSON.stringify(user));
}

// delete user
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const user_id = params.id;
  const user = await User.findByIdAndDelete(user_id);
  if (!user) {
    return new NextResponse(JSON.stringify({ message: "User not found" }), { status: 404 });
  }
  return new NextResponse(JSON.stringify(user));
}
