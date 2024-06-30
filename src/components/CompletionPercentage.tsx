import { useState, useEffect } from "react";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface CompletionPercentageProps {
  businessId: string;
  categoryId?: string; // Optional, if provided, calculate for a specific category
}

const CompletionPercentage: React.FC<CompletionPercentageProps> = ({
  businessId,
  categoryId,
}) => {
  const [percentage, setPercentage] = useState<number>(0);

  useEffect(() => {
    const calculateCompletion = async () => {
      try {
        if (categoryId) {
          // Calculate completion for a specific category
          const categoryRef = doc(
            db,
            "businesses",
            businessId,
            "categories",
            categoryId
          );
          const categorySnap = await getDoc(categoryRef);
          if (categorySnap.exists()) {
            const categoryData = categorySnap.data();
            const tasksRef = collection(
              db,
              "businesses",
              businessId,
              "categories",
              categoryId,
              "tasks"
            );
            const tasksSnap = await getDocs(tasksRef);
            const tasks = tasksSnap.docs.map((doc) => doc.data());
            const completedTasks = tasks.filter(
              (task) => task.completed
            ).length;
            const totalTasks = tasks.length;
            setPercentage(
              totalTasks === 0
                ? 0
                : Math.round((completedTasks / totalTasks) * 100)
            );
          }
        } else {
          // Calculate overall completion for the business
          const categoriesRef = collection(
            db,
            "businesses",
            businessId,
            "categories"
          );
          const categoriesSnap = await getDocs(categoriesRef);
          const categories = categoriesSnap.docs.map((doc) => doc.data());
          let totalTasks = 0;
          let completedTasks = 0;

          for (const category of categories) {
            const tasksRef = collection(
              db,
              "businesses",
              businessId,
              "categories",
              category.id,
              "tasks"
            );
            const tasksSnap = await getDocs(tasksRef);
            const tasks = tasksSnap.docs.map((doc) => doc.data());
            totalTasks += tasks.length;
            completedTasks += tasks.filter((task) => task.completed).length;
          }

          setPercentage(
            totalTasks === 0
              ? 0
              : Math.round((completedTasks / totalTasks) * 100)
          );
        }
      } catch (error) {
        console.error("Error calculating completion percentage:", error);
      }
    };

    calculateCompletion();
  }, [businessId, categoryId]);

  return (
    <div className="flex items-center">
      <span className="text-gray-700">{percentage}% Complete</span>
      <div className="w-full bg-gray-200 rounded-full h-2.5 ml-2">
        <div
          className="bg-green-500 h-2.5 rounded-full"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default CompletionPercentage;
