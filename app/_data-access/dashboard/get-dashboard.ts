import "server-only";

import { db } from "@/app/_lib/prisma";
import dayjs from "dayjs";
import { ProductStatusDto } from "../product/get-products";

export interface DayTotalRevenue {
  day: string;
  totalRevenue: number;
}

export interface MostSoldProductDto {
  productId: string;
  name: string;
  totalSold: number;
  status: ProductStatusDto;
  price: number;
}

interface DashboardDto {
  todayRevenue: number;
  totalSales: number;
  totalStock: number;
  totalProducts: number;
  totalLast14DaysRevenue: DayTotalRevenue[];
  mostSoldProducts: MostSoldProductDto[];
}

export const getDashboard = async (): Promise<DashboardDto> => {
  //pegar as receitas de 14 dias atrás até o final do dia de hoje
  const today = dayjs().endOf("day").toDate();
  const last14Days = [13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0].map(
    (day) => {
      return dayjs(today).subtract(day, "day");
    },
  );
  //guardadr os dados dos ultimos dias
  const totalLast14DaysRevenue: DayTotalRevenue[] = [];
  for (const day of last14Days) {
    const dayTotalRevenue = await db.$queryRawUnsafe<
      { totalRevenue: number }[]
    >(
      `
        SELECT SUM("unityPrice" * "quantity") as "totalRevenue"
        FROM "SaleProduct"
        WHERE "createdAt" >= $1 AND "createdAt" <= $2;
        `,
      day.startOf("day").toDate(),
      day.endOf("day").toDate(),
    );
    totalLast14DaysRevenue.push({
      day: day.format("DD/MM"),
      totalRevenue: dayTotalRevenue[0].totalRevenue,
    });
  }

  //pegar todos os produtos vendidos e somar o valor total

  const todayRevenueQuery = `
    SELECT SUM("unityPrice" * "quantity") as "todayRevenue"
    FROM "SaleProduct"
    WHERE "createdAt" >= $1 AND "createdAt" <= $2;
  `;
  const startOfDay = new Date(new Date().setHours(0, 0, 0, 0));
  const endOfDay = new Date(new Date().setHours(23, 59, 59, 999));

  // Run the raw SQL queries

  const todayRevenuePromise = db.$queryRawUnsafe<{ todayRevenue: number }[]>(
    todayRevenueQuery,
    startOfDay,
    endOfDay,
  );

  const totalSalesPromise = db.sale.count();
  const totalStockPromise = db.product.aggregate({
    _sum: {
      stock: true,
    },
  });
  const totalProductsPromise = db.product.count();
  const mostSoldProductsQuery = `
    SELECT "Product"."name", SUM("SaleProduct"."quantity") as "totalSold", "Product"."price", "Product"."stock", "Product"."id" as "productId"
    FROM "SaleProduct"
    JOIN "Product" ON "SaleProduct"."productId" = "Product"."id"
    GROUP BY "Product"."name", "Product"."price", "Product"."stock", "Product"."id"
    ORDER BY "totalSold" DESC
    LIMIT 5;
  `;

  const mostSoldProductsPromise = db.$queryRawUnsafe<
    {
      productId: string;
      name: string;
      totalSold: number;
      stock: number;
      price: number;
    }[]
  >(mostSoldProductsQuery);

  const [
    todayRevenue,
    totalSales,
    totalStock,
    totalProducts,
    mostSoldProducts,
  ] = await Promise.all([
    todayRevenuePromise,
    totalSalesPromise,
    totalStockPromise,
    totalProductsPromise,
    mostSoldProductsPromise,
  ]);

  return {
    todayRevenue: todayRevenue[0].todayRevenue,
    totalSales,
    totalStock: Number(totalStock._sum.stock),
    totalProducts,
    totalLast14DaysRevenue,
    mostSoldProducts: mostSoldProducts.map((product) => ({
      ...product,
      totalSold: Number(product.totalSold),
      price: Number(product.price),
      status: product.stock > 0 ? "IN_STOCK" : "OUT_OF_STOCK",
    })),
  };
};