"use client";

import { LayoutGridIcon, PackageIcon, ShoppingBasketIcon } from "lucide-react";
import SidebarButton from "./sidebar-button";

const Sidebar = () => {
  return (
    <div className="fixed w-full bg-white md:relative md:w-64">
      {/* IMAGEM */}
      <div className="px-8 py-1 md:py-6">
        <h1 className="text-2xl font-bold">STOCKLY</h1>
      </div>
      {/* BOTOES */}
      <div className="flex flex-row gap-2 p-2 md:flex-col">
        <SidebarButton href="/">
          <LayoutGridIcon size={20} />
          Dashboard
        </SidebarButton>

        <SidebarButton href="/products">
          <PackageIcon size={20} />
          Produtos
        </SidebarButton>

        <SidebarButton href="/sales">
          <ShoppingBasketIcon size={20} />
          Vendas
        </SidebarButton>
      </div>
    </div>
  );
};

export default Sidebar;
