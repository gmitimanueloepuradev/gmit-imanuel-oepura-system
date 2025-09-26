"use client";

import {
  AlertCircle,
  BookOpen,
  Calendar,
  DollarSign,
  UserCheck,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

import AdminLayout from "@/components/layout/AdminLayout";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";
import { formatNumber } from "@/lib/formatUtils";
import dashboardService from "@/services/dashboardService";
import DailyVerse from "@/components/dashboard/DailyVerse";

export default function DashboardPageAdmin() {
  const [stats, setStats] = useState({
    totalMembers: 0,
    membersByGender: { male: 0, female: 0 },
    totalFamilies: 0,
    sacraments: {
      baptis: { total: 0, thisYear: 0 },
      sidi: { total: 0, thisYear: 0 },
      pernikahan: { total: 0, thisYear: 0 },
    },
    ageGroups: { children: 0, youth: 0, adults: 0, elderly: 0 },
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const [dashboardStats, activities, events] = await Promise.all([
          dashboardService.getDashboardStats(),
          dashboardService.getRecentActivities(),
          dashboardService.getUpcomingEvents(),
        ]);

        setStats(dashboardStats);
        setRecentActivities(activities);
        setUpcomingEvents(events);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
        setError("Gagal memuat data dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const headerStats = [
    {
      label: "Total Jemaat",
      value: formatNumber(stats.totalMembers || 0),
      icon: Users,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      change: `${stats.sacraments?.baptis?.thisYear || 0} baptis tahun ini`,
      changeType: "positive",
    },
    {
      label: "Total Keluarga",
      value: formatNumber(stats.totalFamilies || 0),
      icon: UserCheck,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      change: `${stats.membersByGender?.male || 0}L, ${stats.membersByGender?.female || 0}P`,
      changeType: "neutral",
    },
    {
      label: "Jadwal Ibadah",
      value: upcomingEvents.length,
      icon: Calendar,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      change: "Mendatang",
      changeType: "neutral",
    },
    {
      label: "Baptis & Sidi",
      value: `${stats.sacraments?.baptis?.total || 0}/${stats.sacraments?.sidi?.total || 0}`,
      icon: AlertCircle,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      change: "Total baptis/sidi",
      changeType: "neutral",
    },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return <Badge variant="success">Selesai</Badge>;
      case "approved":
        return <Badge variant="success">Disetujui</Badge>;
      case "pending":
        return <Badge variant="warning">Menunggu</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getEventTypeBadge = (type) => {
    switch (type) {
      case "worship":
        return <Badge variant="default">Ibadah</Badge>;
      case "fellowship":
        return <Badge variant="secondary">Persekutuan</Badge>;
      case "prayer":
        return <Badge variant="outline">Doa</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2" />
          <p className="text-gray-600">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-2">{error}</p>
          <Button onClick={() => window.location.reload()}>Muat Ulang</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        breadcrumb={[
          { label: "Admin", href: "/admin" },
          { label: "Dashboard" },
        ]}
        description="Ringkasan sistem administrasi GMIT Imanuel Oepura"
        stats={headerStats}
        title="Dashboard"
      />

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Pernikahan
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.sacraments?.pernikahan?.total || 0}
              </div>
              <p className="text-xs text-muted-foreground">Total Pernikahan</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Jemaat Remaja
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.ageGroups?.youth || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Jemaat Remaja (13-25)
              </p>
            </CardContent>
          </Card>

          {/* Daily Verse Card */}
          <div className="md:col-span-2 lg:col-span-1">
            <DailyVerse />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle>Aktivitas Terbaru</CardTitle>
              <CardDescription>
                Kegiatan administrasi terbaru di gereja
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{activity.member}</p>
                      <p className="text-sm text-gray-500 capitalize">
                        {activity.type} • {activity.date}
                      </p>
                    </div>
                    {getStatusBadge(activity.status)}
                  </div>
                ))}
              </div>
              {/* <div className="mt-4">
                <Button className="w-full" variant="outline">
                  Lihat Semua Aktivitas
                </Button>
              </div> */}
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle>Jadwal Ibadah</CardTitle>
              <CardDescription>
                Jadwal ibadah dan kegiatan gereja mendatang
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-h-96 overflow-y-auto space-y-3">
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event) => (
                    <div
                      key={event.id}
                      className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{event.title}</h4>
                          <p className="text-xs text-gray-500 mt-1">
                            {event.date} • {event.time}
                          </p>
                          {event.location && (
                            <p className="text-xs text-gray-600 mt-1">
                              📍 {event.location}
                            </p>
                          )}
                          {event.speaker &&
                            event.speaker !== "Belum ditentukan" && (
                              <p className="text-xs text-gray-600">
                                👤 {event.speaker}
                              </p>
                            )}
                          {event.tema && (
                            <p className="text-xs text-blue-600 font-medium mt-1">
                              {event.tema}
                            </p>
                          )}
                          {event.firman && (
                            <p className="text-xs text-green-600">
                              📖 {event.firman}
                            </p>
                          )}
                          {event.rayon && (
                            <p className="text-xs text-purple-600">
                              🏘️ Rayon {event.rayon}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col gap-1">
                          {getEventTypeBadge(event.type)}
                          {event.kategori && (
                            <Badge className="text-xs" variant="outline">
                              {event.kategori}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-sm">Tidak ada jadwal ibadah mendatang</p>
                    <p className="text-xs mt-1">
                      Hubungi administrator untuk menambah jadwal
                    </p>
                  </div>
                )}
              </div>
              {/* <div className="mt-4 flex gap-2">
                <Button className="flex-1" variant="outline">
                  Kelola Jadwal
                </Button>
                <Button size="sm" variant="outline">
                  Lihat Semua
                </Button>
              </div> */}
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Aksi Cepat</CardTitle>
            <CardDescription>
              Fungsi administrasi yang sering digunakan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button
                className="flex flex-col items-center p-6 h-auto"
                onClick={() => (window.location.href = "/admin/jemaat")}
              >
                <Users className="h-6 w-6 mb-2" />
                <span>Kelola Jemaat</span>
              </Button>
              <Button
                className="flex flex-col items-center p-6 h-auto"
                variant="outline"
                onClick={() => (window.location.href = "/admin/keluarga")}
              >
                <Calendar className="h-6 w-6 mb-2" />
                <span>Kelola Keluarga</span>
              </Button>
              <Button
                className="flex flex-col items-center p-6 h-auto"
                variant="outline"
                onClick={() => (window.location.href = "/admin/baptis")}
              >
                <BookOpen className="h-6 w-6 mb-2" />
                <span>Data Baptis</span>
              </Button>
              <Button
                className="flex flex-col items-center p-6 h-auto"
                variant="outline"
                onClick={() => (window.location.href = "/admin/sidi")}
              >
                <DollarSign className="h-6 w-6 mb-2" />
                <span>Data Sidi</span>
              </Button>
              <Button
                className="flex flex-col items-center p-6 h-auto"
                variant="outline"
                onClick={() => (window.location.href = "/admin/rayon")}
              >
                <Users className="h-6 w-6 mb-2" />
                <span>Kelola Rayon</span>
              </Button>
              <Button
                className="flex flex-col items-center p-6 h-auto"
                variant="outline"
                onClick={() =>
                  (window.location.href = "/admin/data-master/klasis")
                }
              >
                <Calendar className="h-6 w-6 mb-2" />
                <span>Data Klasis</span>
              </Button>
              <Button
                className="flex flex-col items-center p-6 h-auto"
                variant="outline"
                onClick={() => (window.location.href = "/admin/users")}
              >
                <BookOpen className="h-6 w-6 mb-2" />
                <span>Kelola User</span>
              </Button>
              <Button
                className="flex flex-col items-center p-6 h-auto"
                variant="outline"
                onClick={() => (window.location.href = "/admin/laporan")}
              >
                <DollarSign className="h-6 w-6 mb-2" />
                <span>Laporan</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

// Add layout to component
DashboardPageAdmin.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};
