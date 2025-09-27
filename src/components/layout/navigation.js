import { Menu } from "lucide-react";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

import useKategoriPengumuman from "@/hooks/useKategoriPengumuman";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function Navigation({ children }) {
  const menuItems = [
    { name: "Beranda", path: "/" },
    { name: "Galeri", path: "/galeri" },
    { name: "Tentang", path: "/tentang" },
    { name: "Sejarah", path: "/sejarah" },
  ];

  // Fetch kategori pengumuman data for UPP dropdown
  const { kategoriOptions: uppItems, loading: uppLoading } = useKategoriPengumuman();

  return (
    <>
      <div className="drawer text-gray-900 dark:text-white transition-colors duration-300">
        <input
          className="drawer-toggle"
          id="my-drawer-3"
          type="checkbox"
        />
        <div className="drawer-content flex flex-col">
          {/* Navbar */}
          <div className="navbar bg-black/30 dark:bg-black/50 w-full fixed top-0 left-0 z-50 transition-all duration-300">
            <div className="flex-none lg:hidden">
              <label
                aria-label="open sidebar"
                className="btn btn-square btn-ghost text-white hover:bg-white/20 dark:hover:bg-white/30 transition-colors duration-200"
                htmlFor="my-drawer-3"
              >
                <Menu className="w-8 h-8" />
              </label>
            </div>
            <div className="mx-2 flex-1 px-2 text-white flex items-center gap-3">
              <img
                alt="GMIT Imanuel Oepura Logo"
                className="h-12 w-12 object-contain"
                src="/logo-GMIT.png"
              />
              <div>
                <p className="font-extrabold text-2xl">GMIT Imanuel</p>
                <p className="text-2xl">Oepura</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Navbar
                menuItems={menuItems}
                uppItems={uppItems}
                uppLoading={uppLoading}
              />
            </div>
          </div>
          {/* Page content here */}
          <main>{children}</main>
        </div>
        <Sidebar
          menuItems={menuItems}
          uppItems={uppItems}
          uppLoading={uppLoading}
        />
      </div>
    </>
  );
}
