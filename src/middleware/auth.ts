// authMiddleware.ts
import { NextRequest, NextResponse } from "next/server";
import { admin } from "@/lib/firebaseAdmin";

export async function authMiddleware(req: NextRequest) {
  const token = req.headers.get("Authorization")?.split("Bearer ")[1];
  console.log("Token:", token); // Log the token for debugging

  if (!token) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    (req as any).user = decodedToken; // Modify the request object to include user data
    return null; // No error
  } catch (error) {
    console.error("Error verifying token:", error);
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 }
    );
  }
}
