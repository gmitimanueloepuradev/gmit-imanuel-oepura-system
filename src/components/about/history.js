export default function History() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl" />
        <div className="absolute top-40 right-20 w-24 h-24 bg-blue-300 rounded-full blur-2xl" />
        <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-indigo-300 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-indigo-200 bg-clip-text text-transparent">
            Sejarah Kami
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-indigo-400 mx-auto rounded-full" />
        </div>

        {/* Timeline */}
        <div className="space-y-12">
          {/* Timeline Item 1 - Foundation */}
          <div className="flex flex-col md:flex-row items-center gap-8 group">
            <div className="flex-1 md:text-right">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 transform group-hover:scale-105 transition-all duration-300">
                <h3 className="text-2xl font-bold text-blue-300 mb-4">
                  Awal Mula (1950-an)
                </h3>
                <p className="text-lg leading-relaxed text-gray-200">
                  GMIT Imanuel Oepura didirikan sebagai bagian dari pelayanan
                  gereja di wilayah Timor. Gereja ini lahir dari semangat
                  penyebaran Injil dan kebutuhan masyarakat lokal untuk memiliki
                  tempat ibadah yang dapat melayani komunitas dengan budaya dan
                  bahasa setempat.
                </p>
              </div>
            </div>
            <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full flex-shrink-0 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full animate-ping opacity-75" />
            </div>
            <div className="flex-1 hidden md:block" />
          </div>

          {/* Timeline Item 2 - Growth */}
          <div className="flex flex-col md:flex-row items-center gap-8 group">
            <div className="flex-1 hidden md:block" />
            <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex-shrink-0 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-ping opacity-75" />
            </div>
            <div className="flex-1">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 transform group-hover:scale-105 transition-all duration-300">
                <h3 className="text-2xl font-bold text-green-300 mb-4">
                  Periode Pertumbuhan (1970-1990)
                </h3>
                <p className="text-lg leading-relaxed text-gray-200">
                  Masa ini ditandai dengan pembangunan gedung gereja yang lebih
                  besar dan pengembangan berbagai pelayanan. Jemaat mulai
                  bertumbuh pesat dengan berbagai program pelayanan seperti
                  sekolah minggu, persekutuan pemuda, dan pelayanan sosial
                  kepada masyarakat.
                </p>
              </div>
            </div>
          </div>

          {/* Timeline Item 3 - Modern Era */}
          <div className="flex flex-col md:flex-row items-center gap-8 group">
            <div className="flex-1 md:text-right">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 transform group-hover:scale-105 transition-all duration-300">
                <h3 className="text-2xl font-bold text-purple-300 mb-4">
                  Era Modern (1990-Sekarang)
                </h3>
                <p className="text-lg leading-relaxed text-gray-200">
                  Memasuki era modern, GMIT Imanuel Oepura terus berkembang
                  dengan adopsi teknologi dalam pelayanan, program-program
                  inovatif untuk berbagai kalangan usia, dan keterlibatan aktif
                  dalam pembangunan masyarakat lokal serta pelestarian budaya
                  Timor.
                </p>
              </div>
            </div>
            <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex-shrink-0 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-ping opacity-75" />
            </div>
            <div className="flex-1 hidden md:block" />
          </div>

          {/* Current Vision */}
          <div className="text-center mt-16">
            <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl">
              <h3 className="text-3xl font-bold text-yellow-300 mb-6">
                Visi Kedepan
              </h3>
              <p className="text-xl leading-relaxed text-gray-200 max-w-4xl mx-auto">
                Hari ini, GMIT Imanuel Oepura terus berkomitmen untuk menjadi
                gereja yang hidup, relevan, dan melayani dengan kasih. Kami
                mengintegrasikan nilai-nilai Kristen dengan kearifan lokal,
                menciptakan ruang dimana setiap orang dapat bertumbuh dalam iman
                dan memberikan kontribusi nyata bagi masyarakat.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
