import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import UppCardContainer from "@/components/upp/uppCardContainer";
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
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg" />
      </div>
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
      <div className="flex justify-center items-center h-screen">
        <img
          alt="UPP Header"
          className="object-cover w-full h-full"
          src="/header/anak.webp"
        />
        <h1 className="absolute text-6xl md:text-8xl text-white font-bold mt-4">
          UPP {categoryData.nama}
        </h1>
      </div>

      {/* Show subcategories if available, otherwise show all pengumuman from this category */}
      {hasSubcategories ? (
        <div className="min-h-screen bg-gray-100 p-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              Pilih Kategori {categoryData.nama}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryData.jenisPengumuman.map((jenis) => (
                <Link
                  key={jenis.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 text-center"
                  href={`/upp/${category}/${jenis.nama.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {jenis.nama}
                  </h3>
                  {jenis.deskripsi && (
                    <p className="text-gray-600 text-sm">{jenis.deskripsi}</p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <UppCardContainer kategoriId={categoryData.id} />
      )}
    </div>
  );
}
