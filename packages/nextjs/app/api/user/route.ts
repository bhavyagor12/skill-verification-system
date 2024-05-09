import { NextRequest, NextResponse } from "next/server";
import connectDB from "~~/lib/connectDB";
import { User } from "~~/model/User";

export async function GET() {
  await connectDB();
  const users = await User.find();
  return new NextResponse(JSON.stringify({ users }));
}

export async function POST(req: NextRequest) {
  await connectDB();
  const payload = await req.json();
  const newUser = new User(payload);
  const user = await newUser.save();
  return new NextResponse(JSON.stringify(user));
}
