import { NextRequest, NextResponse } from "next/server";
import {
  getTeamMembers,
  addTeamMember,
  removeTeamMember,
} from "@/services/firebaseTeamManagement";
import { authMiddleware } from "@/middleware/auth";

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
    const teamMembers = await getTeamMembers(businessId as string);
    return NextResponse.json(teamMembers, { status: 200 });
  } catch (error) {
    console.log("Error fetching team members: ", error);
    return NextResponse.json(
      { error: "Error fetching team members" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { businessId: string } }
) {
  const authResponse = await authMiddleware(req);
  if (authResponse) {
    return authResponse;
  }
  try {
    const { businessId } = params;
    const body = await req.json();
    const { email } = body;
    await addTeamMember(businessId as string, email);
    return NextResponse.json({ message: "Team member added" }, { status: 201 });
  } catch (error) {
    console.log("Error adding team member: ", error);
    return NextResponse.json(
      { error: "Error adding team member" },
      { status: 500 }
    );
  }
}

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
    const body = await req.json();
    const { email } = body;
    await removeTeamMember(businessId as string, email);
    return NextResponse.json(
      { message: "Team member removed" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error removing team member: ", error);
    return NextResponse.json(
      { error: "Error removing team member" },
      { status: 500 }
    );
  }
}
