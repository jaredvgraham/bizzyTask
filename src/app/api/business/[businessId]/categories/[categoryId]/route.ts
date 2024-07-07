import { NextResponse, NextRequest } from "next/server";
import {
  updateCategoryName,
  updateCategoryCompletion,
  deleteCategory,
} from "@/services/firebaseCategoryService";

function convertTimestampToISO(category: any) {
  if (category && category.createdAt && category.createdAt.toDate) {
    category.createdAt = category.createdAt.toDate().toISOString();
  }
  return category;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { businessId: string; categoryId: string } }
) {
  try {
    const { businessId, categoryId } = params;
    const body = await req.json();
    const { action, newName } = body;

    if (!action) {
      return NextResponse.json(
        { error: "Action is required" },
        { status: 400 }
      );
    }

    let updatedCategory;
    if (action === "toggle-completed") {
      updatedCategory = await updateCategoryCompletion(businessId, categoryId);
    } else if (action === "update-name") {
      if (!newName) {
        return NextResponse.json(
          { error: "New category name is required" },
          { status: 400 }
        );
      }
      updatedCategory = await updateCategoryName(
        businessId,
        categoryId,
        newName
      );
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    if (updatedCategory) {
      updatedCategory = convertTimestampToISO(updatedCategory);
      return NextResponse.json(updatedCategory, { status: 200 });
    } else {
      return NextResponse.json(
        { error: "Error updating category" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: "Error updating category" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { businessId: string; categoryId: string } }
) {
  try {
    const { businessId, categoryId } = params;

    if (!businessId || !categoryId) {
      return NextResponse.json(
        { error: "Business ID and Category ID are required" },
        { status: 400 }
      );
    }
    //
    await deleteCategory(businessId, categoryId);

    return NextResponse.json(
      { message: "Category deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Error deleting category" },
      { status: 500 }
    );
  }
}
