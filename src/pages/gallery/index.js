import Image from "next/image";
import { useEffect, useState } from "react";

import EmptyState from "@/components/common/EmptyState";
import Images from "@/components/gallery/images";
import axios from "@/lib/axios";

export default function Gallery() {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchGaleri() {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get("/galeri");

        if (response.data.success && response.data.data.items.length > 0) {
          // Pass the gallery items directly without flattening
          setGalleryItems(response.data.data.items);
        } else {
          setGalleryItems([]);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Gagal memuat data galeri");
        setGalleryItems([]);
      } finally {
        setLoading(false);
      }
    }

    fetchGaleri();
  }, []);

  return (
    <div>
      <div className="flex justify-center items-center h-screen relative">
        <Image
          priority
          alt="Gallery Head"
          layout="fill"
          objectFit="cover"
          src="/header/gallery.webp"
        />
        <h1 className="absolute text-8xl font-bold mt-4 text-white">Gallery</h1>
      </div>
      <div className="bg-gray-500 min-h-screen">
        {loading ? (
          <div className="flex justify-center items-center min-h-screen">
            <div className="loading loading-xl text-neutral" />
          </div>
        ) : error ? (
          <EmptyState
            actionText="Coba Lagi"
            description={`Terjadi kesalahan: ${error}`}
            title="Gagal Memuat Galeri"
            type="error"
            onAction={() => window.location.reload()}
          />
        ) : (
          <Images galleryItems={galleryItems} />
        )}
      </div>
    </div>
  );
}
