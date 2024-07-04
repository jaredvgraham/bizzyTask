import { NextRequest, NextResponse } from "next/server";
import {
  getCategoriesWithTasks,
  createCategory,
} from "@/services/firebaseCategoryService";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const businessId = req.nextUrl.pathname.split("/")[3]; // Extract businessId from URL path
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

export async function POST(req: NextRequest) {
  try {
    const { name } = await req.json();
    const businessId = req.nextUrl.pathname.split("/")[3]; // Extract businessId from URL path
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
