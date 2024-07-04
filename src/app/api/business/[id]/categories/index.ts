import { NextApiRequest, NextApiResponse } from "next";
import {
  getCategoriesWithTasks,
  createCategory,
} from "@/services/firebaseCategoryService";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  const { id } = req.query;

  switch (method) {
    case "GET":
      try {
        const categories = await getCategoriesWithTasks(id as string);
        res.status(200).json(categories);
      } catch (error) {
        res.status(500).json({ error: "Error fetching categories" });
      }
      break;
    case "POST":
      try {
        const { name } = req.body;
        const newCategory = await createCategory(id as string, name);
        res.status(201).json(newCategory);
      } catch (error) {
        res.status(500).json({ error: "Error creating category" });
      }
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};
