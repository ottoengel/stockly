"use server";

import { db } from "@/app/_lib/prisma";
import { revalidatePath } from "next/cache";
import { createProductSchema } from "./schema";

export const createProduct = async (data: createProductSchema) => {
  createProductSchema.parse(data);
  await db.product.create({
    data,
  });
  revalidatePath("/products");
};
