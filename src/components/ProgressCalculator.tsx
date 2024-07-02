import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

const ProgressCalculator = ({ businessId }: { businessId: string }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const calculateProgress = async () => {
      try {
        const categoriesRef = collection(
          db,
          "businesses",
          businessId,
          "categories"
        );
        const categoriesSnapshot = await getDocs(categoriesRef);
        const fetchedCategories = categoriesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        let totalTasks = 0;
        let completedTasks = 0;

        for (const category of fetchedCategories) {
          const tasksRef = collection(
            db,
            "businesses",
            businessId,
            "categories",
            category.id,
            "tasks"
          );
          const tasksSnapshot = await getDocs(tasksRef);
          const tasks = tasksSnapshot.docs.map((taskDoc) => ({
            id: taskDoc.id,
            ...taskDoc.data(),
            completed: taskDoc.data().completed, // Add the 'completed' property
          }));

          totalTasks += tasks.length;
          completedTasks += tasks.filter((task) => task.completed).length;
        }

        if (totalTasks > 0) {
          setProgress(Math.round((completedTasks / totalTasks) * 100));
        } else {
          setProgress(0);
        }
      } catch (error) {
        console.error("Error calculating progress: ", error);
      }
    };

    calculateProgress();
  }, [businessId]);

  const getColor = (progress: number) => {
    if (progress < 30) return "bg-red-400 text-red-400";
    if (progress < 70) return "bg-yellow-500 text-yellow-500";
    return "bg-green-500 text-green-500";
  };

  return (
    <div>
      <div className="relative pt-1">
        <div className="flex mb-2 items-center justify-between">
          <div>
            <span
              className={`text-xs font-semibold inline-block py-1 px-2  rounded-full ${
                getColor(progress).split(" ")[1]
              }`}
            >
              Progress
            </span>
          </div>
          <div className="text-right">
            <span
              className={`text-xs font-semibold inline-block ${
                getColor(progress).split(" ")[1]
              }`}
            >
              {progress}%
            </span>
          </div>
        </div>
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
          <div
            style={{ width: `${progress}%` }}
            className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
              getColor(progress).split(" ")[0]
            }`}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ProgressCalculator;
