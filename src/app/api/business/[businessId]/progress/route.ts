import { calculateProgress } from "@/services/firebaseProgressService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { businessId: string } }
) {
  try {
    const { businessId } = params;
    if (!businessId) {
      return NextResponse.json(
        { error: "Business ID is required" },
        { status: 400 }
      );
    }
    const progress = await calculateProgress(businessId as string);
    return NextResponse.json({ progress }, { status: 200 });
  } catch (error) {
    console.log("Error fetching progress: ", error);
    return NextResponse.json(
      { error: "Error fetching progress" },
      { status: 500 }
    );
  }
}
