export default function VisionAndMission() {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-900 p-8 md:p-16">
      {/* Vision Section - Image Left, Text Right */}
      <div className="flex flex-col md:flex-row items-center gap-8 mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 order-1 md:hidden text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Visi Kami
        </h2>

        <div className="flex-1 order-2 md:order-1 group">
          <div className="relative overflow-hidden rounded-xl shadow-2xl transform group-hover:scale-105 transition-all duration-300">
            <img
              alt="Visi GMIT Imanuel Oepura"
              className="w-full h-64 md:h-96 object-cover"
              src="/bible-on-church.webp"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent" />
          </div>
        </div>

        <div className="flex-1 order-3 md:order-2 md:pl-8">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 hidden md:block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Visi Kami
          </h2>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <p className="text-lg md:text-xl leading-relaxed text-gray-700">
              Menjadi gereja yang hidup, bertumbuh dalam iman, pengharapan dan
              kasih, serta menjadi berkat bagi sesama dan lingkungan, dengan
              berpedoman pada Alkitab sebagai Firman Allah yang hidup.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section - Text Left, Image Right */}
      <div className="flex flex-col md:flex-row items-center gap-8">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 order-1 md:hidden text-center bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          Misi Kami
        </h2>

        <div className="flex-1 order-3 md:order-1 md:pr-8">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 hidden md:block bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Misi Kami
          </h2>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <ul className="text-lg md:text-xl leading-relaxed text-gray-700 space-y-3">
              <li className="flex items-start">
                <span className="text-green-600 mr-3 font-bold">•</span>
                Memberitakan Injil Yesus Kristus kepada semua orang
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-3 font-bold">•</span>
                Membina dan mengembangkan kehidupan rohani jemaat
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-3 font-bold">•</span>
                Melayani sesama dengan kasih dan keadilan sosial
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-3 font-bold">•</span>
                Melestarikan dan mengembangkan budaya lokal yang selaras dengan
                iman Kristen
              </li>
            </ul>
          </div>
        </div>

        <div className="flex-1 order-2 group">
          <div className="relative overflow-hidden rounded-xl shadow-2xl transform group-hover:scale-105 transition-all duration-300">
            <img
              alt="Misi GMIT Imanuel Oepura"
              className="w-full h-64 md:h-96 object-cover"
              src="/salib.webp"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-green-900/20 to-transparent" />
          </div>
        </div>
      </div>
    </div>
  );
}
