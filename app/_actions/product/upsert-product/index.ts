"use server";

import { db } from "@/app/_lib/prisma";
import { revalidatePath } from "next/cache";
import { UpsertProductSchema } from "./schema";
import { actionClient } from "@/app/_lib/safe-action";

export const upsertProduct = actionClient
  .schema(UpsertProductSchema)
  .action(async ({ parsedInput: { id, ...data } }) => {
    UpsertProductSchema.parse(data);
    await db.product.upsert({
      where: { id: id ?? "" },
      update: data,
      create: data,
    });
    revalidatePath("/products");
  });
