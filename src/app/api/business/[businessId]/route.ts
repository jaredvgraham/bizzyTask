import { authMiddleware } from "@/middleware/auth";
import {
  deleteBusiness,
  getBusiness,
} from "@/services/firebaseBusinessService";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { businessId: string } }
) {
  const authResponse = await authMiddleware(req);
  if (authResponse) {
    return authResponse;
  }
  try {
    const { businessId } = params;
    console.log("DELETE request received for businessId:", businessId);
    if (!businessId) {
      return NextResponse.json(
        { error: "Business ID is required" },
        { status: 400 }
      );
    }
    await deleteBusiness(businessId as string);
    return NextResponse.json(
      { message: "Business deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error deleting business: ", error);
    return NextResponse.json(
      { error: "Error deleting business" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { businessId: string } }
) {
  const authResponse = await authMiddleware(req);
  if (authResponse) {
    return authResponse;
  }
  try {
    const { businessId } = params;
    if (!businessId) {
      return NextResponse.json(
        { error: "Business ID is required" },
        { status: 400 }
      );
    }
    const business = await getBusiness(businessId as string);
    return NextResponse.json(business);
  } catch (error) {
    console.log("Error fetching business: ", error);
    return NextResponse.json(
      { error: "Error fetching business" },
      { status: 500 }
    );
  }
}
