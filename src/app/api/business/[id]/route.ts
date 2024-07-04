import {
  deleteBusiness,
  getBusiness,
} from "@/services/firebaseBusinessService";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  console.log("DELETE request received+++++++++++");
  try {
    const { searchParams } = new URL(req.url);
    const businessId = searchParams.get("businessId");
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

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const businessId = searchParams.get("businessId");
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
