import { useEffect, useState } from "react";
import { User, Calendar, GraduationCap, Award } from "lucide-react";

import PageTitle from "@/components/ui/PageTitle";

export default function ProfilPendetaPage() {
  const [scrollY, setScrollY] = useState(0);
  const [profiles, setProfiles] = useState([]);
  const [activeProfile, setActiveProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);

        // Fetch all profiles
        const allProfilesResponse = await fetch("/api/public/profil-pendeta");
        const allProfilesData = await allProfilesResponse.json();

        // Fetch active profile
        const activeProfileResponse = await fetch("/api/public/profil-pendeta?active=true");
        const activeProfileData = await activeProfileResponse.json();

        if (allProfilesData.success) {
          setProfiles(allProfilesData.data);
        }

        if (activeProfileData.success && activeProfileData.data) {
          setActiveProfile(activeProfileData.data);
        }
      } catch (error) {
        console.error("Error fetching pastor profiles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  if (loading) {
    return (
      <>
        <PageTitle
          title="Profil Pendeta"
          description="Profil pendeta dan pelayan gereja GMIT Jemaat Imanuel Oepura yang melayani dengan dedikasi tinggi."
        />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat profil pendeta...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageTitle
        title="Profil Pendeta"
        description="Profil pendeta dan pelayan gereja GMIT Jemaat Imanuel Oepura yang melayani dengan dedikasi tinggi."
      />

      <div className="bg-gray-50 min-h-screen">
        {/* Hero Section with Parallax */}
        <div className="relative h-96 flex justify-center items-center overflow-hidden bg-gradient-to-r from-blue-600 to-blue-800">
          <div
            className="absolute inset-0 w-full h-full opacity-20"
            style={{ transform: `translateY(${scrollY * 0.3}px)` }}
          >
            <div className="w-full h-full bg-pattern"></div>
          </div>

          <div className="relative z-10 text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Profil Pendeta
            </h1>
            <p className="text-xl md:text-2xl max-w-2xl mx-auto px-4">
              Pelayan Tuhan yang Membimbing Jemaat
            </p>
          </div>
        </div>

        {/* Active Pastor Section */}
        {activeProfile && (
          <div className="py-16 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                  Pendeta Saat Ini
                </h2>
                <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="md:flex">
                  {/* Photo Section */}
                  <div className="md:w-1/3 bg-gradient-to-br from-blue-50 to-blue-100 p-8 flex items-center justify-center">
                    {activeProfile.urlFoto ? (
                      <img
                        src={activeProfile.urlFoto}
                        alt={activeProfile.nama}
                        className="w-64 h-64 object-cover rounded-full shadow-lg border-4 border-white"
                      />
                    ) : (
                      <div className="w-64 h-64 bg-gray-300 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                        <User className="w-24 h-24 text-gray-500" />
                      </div>
                    )}
                  </div>

                  {/* Info Section */}
                  <div className="md:w-2/3 p-8">
                    <h3 className="text-3xl font-bold text-gray-800 mb-2">
                      {activeProfile.nama}
                    </h3>

                    <div className="flex items-center text-blue-600 mb-6">
                      <Award className="w-5 h-5 mr-2" />
                      <span className="text-lg font-medium">Pendeta GMIT Imanuel Oepura</span>
                    </div>

                    <div className="text-center">
                      <p className="text-gray-600 leading-relaxed">
                        Melayani dengan penuh dedikasi dan kasih di GMIT Jemaat Imanuel Oepura.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* All Pastors Section */}
        {/* {profiles.length > 0 && (
          <div className="py-16 px-4 bg-white">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                  Para Pendeta
                </h2>
                <div className="w-24 h-1 bg-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Profil lengkap para pendeta yang pernah dan sedang melayani di GMIT Jemaat Imanuel Oepura
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {profiles.map((profile) => (
                  <div
                    key={profile.id}
                    className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border-2 ${
                      profile.isActive ? 'border-blue-500' : 'border-gray-200'
                    }`}
                  >
                    {profile.isActive && (
                      <div className="bg-blue-500 text-white text-center py-2 text-sm font-medium">
                        Aktif Melayani
                      </div>
                    )}

                    <div className="p-6">
                      <div className="text-center mb-4">
                        {profile.urlFoto ? (
                          <img
                            src={profile.urlFoto}
                            alt={profile.nama}
                            className="w-24 h-24 object-cover rounded-full mx-auto shadow-md border-2 border-gray-200"
                          />
                        ) : (
                          <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto flex items-center justify-center shadow-md border-2 border-gray-200">
                            <User className="w-10 h-10 text-gray-500" />
                          </div>
                        )}
                      </div>

                      <h3 className="text-xl font-bold text-gray-800 text-center mb-2">
                        {profile.nama}
                      </h3>

                      <p className="text-blue-600 font-medium text-center mb-4">
                        Pendeta GMIT
                      </p>

                      <div className="text-center">
                        <p className="text-gray-600 text-sm leading-relaxed">
                          Melayani dengan dedikasi di GMIT Jemaat Imanuel Oepura
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )} */}

        {profiles.length === 0 && !loading && (
          <div className="py-16 px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="bg-white rounded-xl shadow-lg p-12">
                <User className="w-24 h-24 text-gray-400 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Belum Ada Profil Pendeta
                </h3>
                <p className="text-gray-600">
                  Informasi profil pendeta akan segera ditambahkan.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .bg-pattern {
          background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm0 0c0 11.046 8.954 20 20 20s20-8.954 20-20-8.954-20-20-20-20 8.954-20 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </>
  );
}