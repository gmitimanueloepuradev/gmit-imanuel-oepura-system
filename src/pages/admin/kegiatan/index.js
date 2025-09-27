import React, { useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Plus,
  Edit,
  Trash2,
} from "lucide-react";

import PageHeader from "@/components/ui/PageHeader";
import ListGrid from "@/components/ui/ListGrid";
import { Badge } from "@/components/ui/Badge";

export default function EventsManagement() {
  // Dummy data for demonstration
  const events = [
    {
      id: "kgt_001",
      nama: "Ibadah Minggu Pagi",
      deskripsi: "Ibadah minggu rutin dengan khotbah dari Pdt. John Doe",
      type: "worship",
      date: "2025-09-01",
      time: "08:00",
      endTime: "10:00",
      location: "Gereja Utama",
      attendees: 450,
      maxAttendees: 500,
      status: "confirmed",
      recurring: "weekly",
    },
  ];

  const eventTypes = {
    worship: { label: "Ibadah", variant: "default" },
    fellowship: { label: "Persekutuan", variant: "secondary" },
    prayer: { label: "Doa", variant: "outline" },
    education: { label: "Pendidikan", variant: "warning" },
    special: { label: "Khusus", variant: "destructive" },
  };

  const columns = [
    {
      key: "nama",
      label: "Nama Kegiatan",
      type: "text",
    },
    {
      key: "type",
      label: "Jenis",
      render: (value) => {
        const typeInfo = eventTypes[value] || {
          label: value,
          variant: "outline",
        };
        return <Badge variant={typeInfo.variant}>{typeInfo.label}</Badge>;
      },
    },
    {
      key: "date",
      label: "Tanggal",
      type: "date",
    },
    {
      key: "schedule",
      label: "Waktu",
      render: (value, item) => `${item.time} - ${item.endTime}`,
    },
    {
      key: "location",
      label: "Lokasi",
      type: "text",
    },
    {
      key: "attendance",
      label: "Peserta",
      render: (value, item) => `${item.attendees}/${item.maxAttendees}`,
    },
    {
      key: "status",
      label: "Status",
      type: "badge",
      badgeVariant: (value) => {
        switch (value) {
          case "confirmed":
            return "success";
          case "pending":
            return "warning";
          case "cancelled":
            return "destructive";
          default:
            return "outline";
        }
      },
      render: (value) => {
        const labels = {
          confirmed: "Dikonfirmasi",
          pending: "Menunggu",
          cancelled: "Dibatalkan",
        };
        return labels[value] || value;
      },
    },
    {
      key: "recurring",
      label: "Berulang",
      render: (value) => {
        if (value === "none") return "-";
        const labels = {
          daily: "Harian",
          weekly: "Mingguan",
          monthly: "Bulanan",
        };
        return (
          <Badge className="text-xs" variant="outline">
            {labels[value] || value}
          </Badge>
        );
      },
    },
  ];

  const filters = [
    {
      key: "type",
      label: "Semua Jenis",
      options: [
        { value: "worship", label: "Ibadah" },
        { value: "fellowship", label: "Persekutuan" },
        { value: "prayer", label: "Doa" },
        { value: "education", label: "Pendidikan" },
        { value: "special", label: "Khusus" },
      ],
    },
    {
      key: "status",
      label: "Semua Status",
      options: [
        { value: "confirmed", label: "Dikonfirmasi" },
        { value: "pending", label: "Menunggu" },
        { value: "cancelled", label: "Dibatalkan" },
      ],
    },
  ];

  const headerStats = [
    {
      label: "Total Acara",
      value: events.length.toString(),
      icon: Calendar,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      change: "Bulan ini",
      changeType: "neutral",
    },
    {
      label: "Total Peserta",
      value: events
        .reduce((sum, event) => sum + event.attendees, 0)
        .toLocaleString(),
      icon: Users,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      change: "Minggu ini",
      changeType: "neutral",
    },
    {
      label: "Acara Dikonfirmasi",
      value: events
        .filter((event) => event.status === "confirmed")
        .length.toString(),
      icon: Clock,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      change: "Siap dilaksanakan",
      changeType: "positive",
    },
    {
      label: "Lokasi Aktif",
      value: new Set(events.map((event) => event.location)).size.toString(),
      icon: MapPin,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      change: "Tempat berbeda",
      changeType: "neutral",
    },
  ];

  const handleAdd = () => {
    console.log("Add new event");
  };

  const handleView = (item) => {
    console.log("View event:", item);
  };

  const handleEdit = (item) => {
    console.log("Edit event:", item);
  };

  const handleDelete = (item) => {
    console.log("Delete event:", item);
  };

  const handleExport = () => {
    console.log("Export events data");
  };

  const rowActions = [
    {
      label: "Edit",
      icon: Edit,
      onClick: handleEdit,
      variant: "outline",
    },
    {
      label: "Hapus",
      icon: Trash2,
      onClick: handleDelete,
      variant: "destructive",
    },
  ];

  return (
    <>
      <PageHeader
        actions={[
          {
            label: "Tambah Acara",
            icon: Plus,
            onClick: handleAdd,
          },
        ]}
        breadcrumb={[{ label: "Admin", href: "/adm" }, { label: "Acara" }]}
        description="Kelola jadwal dan acara gereja GMIT Imanuel Oepura"
        stats={headerStats}
        title="Manajemen Acara"
      />

      <div className="max-w-7xl mx-auto p-6">
        <ListGrid
          actions={rowActions}
          columns={columns}
          data={events}
          filters={filters}
          searchPlaceholder="Cari nama acara, lokasi, atau deskripsi..."
          title="Daftar Acara"
          onAdd={handleAdd}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onExport={handleExport}
          onView={handleView}
        />
      </div>
    </>
  );
}
