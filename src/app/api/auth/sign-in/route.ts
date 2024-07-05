import { NextRequest, NextResponse } from "next/server";
import { admin, db } from "@/lib/firebaseAdmin";
import { compare } from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const userDocSnapshot = await db
      .collection("users")
      .where("email", "==", email)
      .limit(1)
      .get();
    if (userDocSnapshot.empty) {
      console.log("User not found for email: ", email);
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const userDoc = userDocSnapshot.docs[0];
    const user = userDoc.data();

    if (!user.passwordHash) {
      console.error("Password hash is missing for user: ", email);
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isPasswordValid = await compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = await admin.auth().createCustomToken(user.uid);
    return NextResponse.json({ token }, { status: 200 });
  } catch (error) {
    console.error("Error signing in: ", error);
    return NextResponse.json({ error: "Error signing in" }, { status: 500 });
  }
}
