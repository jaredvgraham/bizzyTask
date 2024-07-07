import React from "react";
import TaskItem from "./TaskItem";
import handleEnterSubmit from "@/utils/handleEnterSubmit";
import { useTasks } from "@/context/TasksContext";
import { Category } from "@/types";

interface TaskListProps {
  category: Category;
  businessId: string;
  isExpanded: boolean;
}

const TaskList: React.FC<TaskListProps> = ({
  category,
  businessId,
  isExpanded,
}) => {
  const {
    newTask,
    newDescriptions,
    hiddenTasks,
    handleAddTask,
    handleTaskInputChange,
  } = useTasks();

  return (
    <>
      {category?.tasks?.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          categoryId={category.id}
          newDescription={newDescriptions[task.id] || ""}
          hidden={hiddenTasks.has(task.id)}
          businessId={businessId}
          isExpanded={isExpanded}
        />
      ))}
      <div className="mt-4" onClick={(e) => e.stopPropagation()}>
        <input
          type="text"
          value={newTask.name}
          onChange={(e) => handleTaskInputChange(e.target.value, category.id)}
          placeholder="Task Name"
          className="mr-2 p-2 border rounded"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) =>
            handleEnterSubmit(e, () =>
              handleAddTask({ name: newTask.name, categoryId: category.id })
            )
          }
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleAddTask({ name: newTask.name, categoryId: category.id });
          }}
          className="btn-yellow text-white p-2 rounded"
        >
          Add Task
        </button>
      </div>
    </>
  );
};

export default TaskList;
