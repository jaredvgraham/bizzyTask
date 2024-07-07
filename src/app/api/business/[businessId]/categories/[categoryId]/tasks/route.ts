import { NextResponse, NextRequest } from "next/server";
import { getTasks, addTask } from "@/services/firebaseTaskService";

export async function GET(
  req: NextRequest,
  { params }: { params: { businessId: string; categoryId: string } }
) {
  try {
    const { businessId, categoryId } = params;
    if (!businessId || !categoryId) {
      return NextResponse.json(
        { error: "Business ID and category ID are required" },
        { status: 400 }
      );
    }
    const tasks = await getTasks(businessId, categoryId);
    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    console.log("Error fetching tasks: ", error);
    return NextResponse.json(
      { error: "Error fetching tasks" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { businessId: string; categoryId: string } }
) {
  try {
    const body = await req.json();
    const { taskName } = body;
    const { businessId, categoryId } = params;
    if (!businessId || !categoryId || !taskName) {
      return NextResponse.json(
        { error: "Business ID, category ID, and task name are required" },
        { status: 400 }
      );
    }
    const newTask = await addTask(businessId, categoryId, taskName);
    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.log("Error creating task: ", error);
    return NextResponse.json({ error: "Error creating task" }, { status: 500 });
  }
}
