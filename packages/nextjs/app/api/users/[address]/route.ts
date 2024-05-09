import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../../../lib/connectDB";
import { User } from "~~/model/User";

export async function GET(req: NextRequest, { params }: { params: { address: string } }) {
  await connectDB();
  const user_address = params.address;
  const user = await User.find({ address: user_address });
  if (!user) {
    return new NextResponse(JSON.stringify({ message: "User not found" }), { status: 404 });
  }
  return new NextResponse(JSON.stringify(user));
}

export async function PUT(req: NextRequest, { params }: { params: { address: string } }) {
  await connectDB();
  const user_address = params.address;
  const payload = await req.json();

  const { userJson } = payload;
  const user = await User.findOneAndUpdate({ address: user_address }, { userJson }, { new: true });
  if (!user) {
    return new NextResponse(JSON.stringify({ message: "User not found" }), { status: 404 });
  }
  return new NextResponse(JSON.stringify(user));
}

// delete user
export async function DELETE(req: NextRequest, { params }: { params: { address: string } }) {
  await connectDB();
  const user_address = params.address;
  const user = await User.findOneAndDelete({ address: user_address });
  if (!user) {
    return new NextResponse(JSON.stringify({ message: "User not found" }), { status: 404 });
  }
  return new NextResponse(JSON.stringify(user));
}
