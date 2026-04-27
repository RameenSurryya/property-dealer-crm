import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { connectDB } from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET;

export async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

export async function comparePassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

export function createToken(user) {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export async function getCurrentUser(request) {
  await connectDB();

  const token = request.cookies.get("token")?.value;

  if (!token) {
    return null;
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    return null;
  }

  const user = await User.findById(decoded.id).select("-password");

  return user;
}

export function requireRole(user, allowedRoles = []) {
  if (!user) {
    return false;
  }

  return allowedRoles.includes(user.role);
}