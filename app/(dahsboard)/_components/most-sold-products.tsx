import { getMostSoldProducts } from "@/app/_data-access/dashboard/get-most-sold-products";
import MostSoldProductItem from "./most-sold-product-item";

const MostSoldProducts = async () => {
  const mostSoldProducts = await getMostSoldProducts();
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl bg-white">
      <p className="p-6 text-lg font-semibold text-slate-900">
        Produtos mais Vendidos
      </p>

      <div className="space-y-7 overflow-y-auto px-6 pb-6">
        {mostSoldProducts.map((product) => (
          <MostSoldProductItem key={product.productId} product={product} />
        ))}
      </div>
    </div>
  );
};

export const MostSoldProductItemSkeleton = () => {
  return (
    <div className="flex items-center justify-between pt-5">
      <div className="space-y-2">
        <div className="h-[22px] w-[91.23px] rounded-md bg-gray-200" />
        <div className="h-6 w-[91.23px] rounded-md bg-gray-200" />
        <div className="h-6 w-[105px] rounded-md bg-gray-200" />
      </div>
      <div>
        <div className="h-5 w-[86.26px] rounded-md bg-gray-200" />
      </div>
    </div>
  );
};

export default MostSoldProducts;
