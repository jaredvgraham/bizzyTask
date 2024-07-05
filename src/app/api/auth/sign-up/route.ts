import { NextRequest, NextResponse } from "next/server";
import { admin, db } from "@/lib/firebaseAdmin";
import { hash } from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const userRecord = await admin.auth().createUser({
      email,
      password,
    });

    const passwordHash = await hash(password, 10);

    await db.collection("users").doc(userRecord.uid).set({
      email: userRecord.email,
      uid: userRecord.uid,
      passwordHash,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    const token = await admin.auth().createCustomToken(userRecord.uid);

    return NextResponse.json(
      { message: "User signed up successfully", token },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error signing up: ", error);
    return NextResponse.json({ error: "Error signing up" }, { status: 500 });
  }
}
