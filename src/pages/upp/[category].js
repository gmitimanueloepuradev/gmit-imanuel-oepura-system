import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import UppCardContainer from "@/components/upp/uppCardContainer";
import PasalSection from "@/components/upp/PasalSection";
import PageTitle from "@/components/ui/PageTitle";
import LoadingScreen from "@/components/ui/LoadingScreen";
import useKategoriPengumuman from "@/hooks/useKategoriPengumuman";

export default function UppCategory() {
  const router = useRouter();
  const { category } = router.query;
  const { getCategoryBySlug, loading } = useKategoriPengumuman();
  const [categoryData, setCategoryData] = useState(null);

  useEffect(() => {
    if (!loading && category) {
      const catData = getCategoryBySlug(category);

      setCategoryData(catData);
    }
  }, [category, loading, getCategoryBySlug]);

  if (loading) {
    return (
      <LoadingScreen
        isLoading={true}
        message="Memuat kategori UPP..."
      />
    );
  }

  if (!categoryData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Category Not Found
          </h1>
          <p className="text-gray-600">
            The requested UPP category could not be found.
          </p>
        </div>
      </div>
    );
  }

  const hasSubcategories =
    categoryData.jenisPengumuman && categoryData.jenisPengumuman.length > 0;

  return (
    <div>
      <PageTitle
        title={`UPP ${categoryData.nama} - GMIT Imanuel Oepura`}
        description={`Unit Pelayanan Persekutuan (UPP) ${categoryData.nama} di GMIT Jemaat Imanuel Oepura Kupang, Nusa Tenggara Timur.`}
        keywords={`UPP ${categoryData.nama}, Unit Pelayanan Persekutuan, Pelayanan Gereja, GMIT Imanuel Oepura, Gereja Kupang, Pelayanan Jemaat`}
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
            {categoryData.nama}
          </h1>
          {categoryData.deskripsi && (
            <p className="text-white text-sm sm:text-lg md:text-xl mt-4 max-w-3xl mx-auto">
              {categoryData.deskripsi}
            </p>
          )}
        </div>
      </div>

      {/* Pasal Section - Always show if exists */}
      <PasalSection
        pasalDeskripsi={categoryData.pasalDeskripsi}
        categoryName={categoryData.nama}
      />

      {/* Show subcategories if available, otherwise show all pengumuman from this category */}
      {hasSubcategories ? (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-8 text-center">
              Pilih Kategori {categoryData.nama}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryData.jenisPengumuman.map((jenis) => (
                <Link
                  key={jenis.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 text-center border border-gray-200 dark:border-gray-700"
                  href={`/upp/${category}/${jenis.nama.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                    {jenis.nama}
                  </h3>
                  {jenis.deskripsi && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{jenis.deskripsi}</p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <UppCardContainer
          kategoriId={categoryData.id}
          emptyStateMessage={`Belum ada pengumuman untuk kategori ${categoryData.nama}.`}
        />
      )}
    </div>
  );
}
