import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import UppCardContainer from "@/components/upp/uppCardContainer";
import PageTitle from "@/components/ui/PageTitle";
import useKategoriPengumuman from "@/hooks/useKategoriPengumuman";

export default function UppSubcategory() {
  const router = useRouter();
  const { category, subcategory } = router.query;
  const { getCategoryBySlug, getSubcategoryBySlug, loading } =
    useKategoriPengumuman();
  const [categoryData, setCategoryData] = useState(null);
  const [subcategoryData, setSubcategoryData] = useState(null);

  useEffect(() => {
    if (!loading && category && subcategory) {
      const catData = getCategoryBySlug(category);
      const subData = getSubcategoryBySlug(category, subcategory);

      setCategoryData(catData);
      setSubcategoryData(subData);
    }
  }, [category, subcategory, loading, getCategoryBySlug, getSubcategoryBySlug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (!categoryData || !subcategoryData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Category Not Found
          </h1>
          <p className="text-gray-600">
            The requested UPP category or subcategory could not be found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageTitle
        title={`UPP ${categoryData.nama} - ${subcategoryData.nama} - GMIT Imanuel Oepura`}
        description={`Unit Pelayanan Persekutuan (UPP) ${categoryData.nama} - ${subcategoryData.nama} di GMIT Jemaat Imanuel Oepura Kupang, Nusa Tenggara Timur.`}
        keywords={`UPP ${categoryData.nama}, ${subcategoryData.nama}, Unit Pelayanan Persekutuan, Pelayanan Gereja, GMIT Imanuel Oepura, Gereja Kupang`}
      />
      <div className="relative flex justify-center items-center h-screen">
        <Image
          fill
          priority
          alt="UPP Header"
          className="object-cover w-full h-full"
          sizes="100vw"
          src="/header/anak.webp"
        />
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="absolute text-center px-4">
          <h1 className="text-4xl sm:text-6xl md:text-8xl text-white font-bold">
            UPP {categoryData.nama}
          </h1>
          <h2 className="text-2xl sm:text-3xl md:text-4xl text-white font-semibold mt-4">
            {subcategoryData.nama}
          </h2>
          {subcategoryData.deskripsi && (
            <p className="text-white text-sm sm:text-lg md:text-xl mt-4 max-w-3xl mx-auto">
              {subcategoryData.deskripsi}
            </p>
          )}
        </div>
      </div>

      {/* UPP cards filtered by jenisId */}
      <UppCardContainer
        jenisId={subcategoryData.id}
        emptyStateMessage={`Belum ada pengumuman untuk ${subcategoryData.nama}.`}
      />
    </div>
  );
}
