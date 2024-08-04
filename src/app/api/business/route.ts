import { NextResponse, NextRequest } from "next/server";
import {
  getBusinesses,
  createBusiness,
  deleteBusiness,
} from "@/services/firebaseBusinessService";
import { error } from "console";
import { generateTemplate } from "@/services/chatGPTService";
import { authMiddleware } from "@/middleware/auth";

export const maxDuration = 300; // 300 seconds or 5 minutes
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const authResponse = await authMiddleware(req);
  if (authResponse) {
    return authResponse;
  }

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

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();
//     const { name, description, type, userId, userEmail, template } = body;
//     const bsuinessId = await createBusiness(
//       name,
//       description,
//       type,
//       userId,
//       userEmail,
//       template
//     );
//     return NextResponse.json({ bsuinessId }, { status: 201 });
//   } catch (error) {
//     console.log("Error creating business: ", error);
//     return NextResponse.json(
//       { error: "Error creating business" },
//       { status: 500 }
//     );
//   }
// }
export async function POST(req: NextRequest) {
  const authResponse = await authMiddleware(req);
  if (authResponse) {
    return authResponse;
  }
  try {
    const body = await req.json();
    const { name, description, type, userId, userEmail } = body;
    const template = await generateTemplate(type, description);
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
