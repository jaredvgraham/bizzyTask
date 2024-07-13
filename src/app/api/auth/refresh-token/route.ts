// app/api/auth/refresh-token/route.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import cookie from "cookie";

const SECRET_KEY = "your_secret_key"; // Replace with a secure key in production
const REFRESH_SECRET_KEY = "your_refresh_secret_key"; // Secure key for refresh tokens

export async function POST(req: NextRequest) {
  const cookies = cookie.parse(req.headers.get("cookie") || "");
  const refreshToken = cookies.refreshToken;

  if (!refreshToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      REFRESH_SECRET_KEY
    ) as jwt.JwtPayload & { uid: string; email: string };
    const newAccessToken = jwt.sign(
      { uid: decoded.uid, email: decoded.email },
      SECRET_KEY,
      { expiresIn: "15m" }
    );

    const response = NextResponse.json({
      accessToken: newAccessToken,
      email: decoded.email,
      uid: decoded.uid,
    });
    response.headers.set(
      "Set-Cookie",
      cookie.serialize("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 900, // 15 minutes
        path: "/",
      })
    );

    return response;
  } catch (err) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}
