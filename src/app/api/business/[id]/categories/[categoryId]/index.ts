import { NextApiRequest, NextApiResponse } from "next";
import {
  updateCategoryName,
  updateCategoryCompletion,
  deleteCategory,
} from "@/services/firebaseCategoryService";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  const { id, categoryId } = req.query;

  switch (method) {
    case "PUT":
      try {
        const updatedCategory = await updateCategoryCompletion(
          id as string,
          categoryId as string
        );
        res.status(200).json(updatedCategory);
      } catch (error) {
        res.status(500).json({ error: "Error updating category completion" });
      }
      break;
    case "PATCH":
      try {
        const { newName } = req.body;
        await updateCategoryName(id as string, categoryId as string, newName);
        res.status(200).json({ message: "Category name updated" });
      } catch (error) {
        res.status(500).json({ error: "Error updating category name" });
      }
      break;
    case "DELETE":
      try {
        await deleteCategory(id as string, categoryId as string);
        res.status(204).end();
      } catch (error) {
        res.status(500).json({ error: "Error deleting category" });
      }
      break;
    default:
      res.setHeader("Allow", ["PATCH", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};
