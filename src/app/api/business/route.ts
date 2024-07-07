import { NextResponse, NextRequest } from "next/server";
import {
  getBusinesses,
  createBusiness,
  deleteBusiness,
} from "@/services/firebaseBusinessService";
import { error } from "console";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userEmail = searchParams.get("userEmail");
    if (!userEmail) {
      return NextResponse.json(
        { error: "User email is required" },
        { status: 400 }
      );
    }
    const businesses = await getBusinesses(userEmail as string);
    return NextResponse.json(businesses);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching businesses" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description, type, userId, userEmail, template } = body;
    const bsuinessId = await createBusiness(
      name,
      description,
      type,
      userId,
      userEmail,
      template
    );
    return NextResponse.json({ bsuinessId }, { status: 201 });
  } catch (error) {
    console.log("Error creating business: ", error);
    return NextResponse.json(
      { error: "Error creating business" },
      { status: 500 }
    );
  }
}
