import { dbConnect } from "@/lib/dbConnect";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  await dbConnect();

  const { email, password } = await req.json();

  const existing = await User.findOne({ email });
  if (existing) {
    return Response.json(
      { error: "Email already registered" },
      { status: 400 }
    );
  }

  const hashed = await bcrypt.hash(password, 10);
  await User.create({ email, password: hashed });

  return Response.json({ message: "User registered" });
}
