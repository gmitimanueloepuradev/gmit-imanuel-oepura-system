import { Clock, MapPin } from "lucide-react";
import Image from "next/image";

export default function JoinUs() {
  return (
    <div className="flex flex-col md:flex-row md:bg-gray-300 md:dark:bg-gray-700 md:rounded-2xl p-4 md:p-6 md:shadow-lg w-full md:w-3/4 mx-auto gap-4 md:gap-8 transition-colors duration-300">
      {/* texts */}
      <div className="flex flex-col justify-center text-gray-800 dark:text-white flex-1 transition-colors duration-300">
        <h2 className="divider divider-start divider-neutral dark:divider-gray text-4xl font-bold mb-4 tracking-wide font-sans">
          Bergabunglah
        </h2>
        <p className="text-xl font-medium mb-4 text-gray-700 dark:text-gray-200">
          Bersama dalam kasih & firman Tuhan
        </p>
        <div className="mb-6">
          <div className="flex items-center text-gray-600 dark:text-gray-300 mb-2">
            <Clock className="h-5 w-5 mr-2" />
            <span>Bergabunglah Setiap Hari Minggu Pukul 08.00 dan 17.00</span>
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <MapPin className="h-5 w-5 mr-2" />
            <span>GMIT Imanuel Oepura</span>
          </div>
        </div>
        <button className="btn btn-success btn-wide self-start rounded-full">
          Info Lebih Lanjut
        </button>
      </div>

      {/* image */}
      <div className="flex-shrink-0 rounded-xl overflow-hidden md:w-72 md:h-72 relative flex-1">
        <Image
          fill
          alt="Bergabung Event"
          className="object-cover"
          sizes="(min-width: 768px) 384px, 100vw"
          src="/header/76324234-evening.webp"
        />
      </div>
    </div>
  );
}
