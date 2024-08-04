import { NextRequest, NextResponse } from "next/server";
import {
  getCategoriesWithTasks,
  createCategory,
} from "@/services/firebaseCategoryService";
import { authMiddleware } from "@/middleware/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { businessId: string } }
) {
  const authResponse = await authMiddleware(req);
  if (authResponse) {
    return authResponse;
  }
  console.log("GET request received for cats +++++++++++");

  try {
    const { searchParams } = new URL(req.url);
    const { businessId } = params; // Extract businessId from URL path
    if (!businessId) {
      return NextResponse.json(
        { error: "Business ID is required" },
        { status: 400 }
      );
    }
    const categories = await getCategoriesWithTasks(businessId);
    return NextResponse.json(categories);
  } catch (error) {
    console.log("Error fetching categories: ", error);
    return NextResponse.json(
      { error: "Error fetching categories" },
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
    const { name } = await req.json();
    const { businessId } = params; // Extract businessId from URL path
    if (!businessId || !name) {
      return NextResponse.json(
        { error: "Business ID and category name are required" },
        { status: 400 }
      );
    }
    const newCategory = await createCategory(businessId, name);
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.log("Error creating category: ", error);
    return NextResponse.json(
      { error: "Error creating category" },
      { status: 500 }
    );
  }
}
