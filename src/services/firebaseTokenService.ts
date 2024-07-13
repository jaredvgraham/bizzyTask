import { admin } from "@/lib/firebaseAdmin";
export async function verifyIdToken(token: string) {
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    return decodedToken;
  } catch (error: any) {
    if (error.code === "auth/id-token-expired") {
      throw new Error("Token expired");
    }
    throw new Error("Token verification failed");
  }
}
