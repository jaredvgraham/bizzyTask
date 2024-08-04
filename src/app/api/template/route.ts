import { authMiddleware } from "@/middleware/auth";
import { generateTemplate } from "@/services/chatGPTService";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const authResponse = await authMiddleware(req);
    if (authResponse) {
      return authResponse;
    }
    const body = await req.json();
    const { type, description } = body;
    console.log(
      "Generating template for type:",
      type,
      "and description:",
      description
    );

    if (!type || !description) {
      return NextResponse.json(
        { error: "Type and description are required" },
        { status: 400 }
      );
    }
    const template = await generateTemplate(type, description);
    return NextResponse.json({ template }, { status: 201 });
  } catch (error) {
    console.log("Error generating template: ", error);
    return NextResponse.json(
      { error: "Error generating template" },
      { status: 500 }
    );
  }
}
