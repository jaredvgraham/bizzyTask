import { NextRequest, NextResponse } from "next/server";
import {
  deleteTask,
  toggleTaskCompletedFire,
  addDescription,
  editDescription,
  deleteDescription,
  toggleDescriptionCompleted,
} from "@/services/firebaseTaskService";

export async function DELETE(
  req: NextRequest,
  {
    params,
  }: { params: { businessId: string; categoryId: string; taskId: string } }
) {
  try {
    const { businessId, categoryId, taskId } = params;
    console.log("DELETE request received for taskId:", taskId);
    if (!businessId || !categoryId || !taskId) {
      return NextResponse.json(
        { error: "Business ID, category ID, and task ID are required" },
        { status: 400 }
      );
    }
    await deleteTask(businessId, categoryId, taskId);
    return NextResponse.json(
      { message: "Task deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error deleting task: ", error);
    return NextResponse.json({ error: "Error deleting task" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  {
    params,
  }: { params: { businessId: string; categoryId: string; taskId: string } }
) {
  try {
    const { businessId, categoryId, taskId } = params;
    const body = await req.json();
    const { action, description, newDescription, oldDescription } = body;

    if (!action) {
      return NextResponse.json(
        { error: "Action is required" },
        { status: 400 }
      );
    }

    if (action === "toggle-completed") {
      const updatedTask = await toggleTaskCompletedFire(
        businessId,
        categoryId,
        taskId
      );
      return NextResponse.json(updatedTask, { status: 200 });
    } else if (action === "add-description") {
      await addDescription(businessId, categoryId, taskId, description);
      return NextResponse.json(
        { message: "Description added successfully" },
        { status: 200 }
      );
    } else if (action === "edit-description") {
      await editDescription(
        businessId,
        categoryId,
        taskId,
        oldDescription,
        newDescription
      );
      return NextResponse.json(
        { message: "Description edited successfully" },
        { status: 200 }
      );
    } else if (action === "delete-description") {
      if (description && description.text && description.createdAt) {
        await deleteDescription(businessId, categoryId, taskId, description);
        return NextResponse.json(
          { message: "Description deleted successfully" },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { error: "Invalid description object" },
          { status: 400 }
        );
      }
    } else if (action === "toggle-description-completed") {
      const updatedTask = await toggleDescriptionCompleted(
        businessId,
        categoryId,
        taskId,
        description
      );
      return NextResponse.json(updatedTask, { status: 200 });
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json({ error: "Error updating task" }, { status: 500 });
  }
}
