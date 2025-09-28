// api/keuangan/realisasi/summary.js
import prisma from "@/lib/prisma";

const apiResponse = (success, data = null, message = "", errors = null) => {
  return {
    success,
    data,
    message,
    errors,
    timestamp: new Date().toISOString(),
  };
};

export default async function handler(req, res) {
  const { method } = req;

  try {
    switch (method) {
      case "GET":
        return await handleGet(req, res);
      default:
        res.setHeader("Allow", ["GET"]);
        return res
          .status(405)
          .json(apiResponse(false, null, `Method ${method} not allowed`));
    }
  } catch (error) {
    console.error("API Realisasi Summary Error:", error);
    return res
      .status(500)
      .json(apiResponse(false, null, "Server error", error.message));
  }
}

async function handleGet(req, res) {
  try {
    const {
      itemKeuanganId,
      kategoriId,
      periodeId,
      level,
      tanggalMulai,
      tanggalSelesai,
    } = req.query;

    // Build where clause for realisasi
    const whereRealisasi = {};

    // Only filter by periode in realisasi if not filtering by specific item
    if (!itemKeuanganId && periodeId && periodeId !== "all") {
      whereRealisasi.periodeId = periodeId;
    }

    // Filter berdasarkan tanggal
    if (tanggalMulai || tanggalSelesai) {
      whereRealisasi.tanggalRealisasi = {};
      if (tanggalMulai) {
        whereRealisasi.tanggalRealisasi.gte = new Date(tanggalMulai);
      }
      if (tanggalSelesai) {
        whereRealisasi.tanggalRealisasi.lte = new Date(tanggalSelesai);
      }
    }

    // Build where clause for item keuangan
    const whereItem = { isActive: true };

    // If specific item is requested, filter by that item only
    if (itemKeuanganId && itemKeuanganId !== "all") {
      whereItem.id = itemKeuanganId;
    } else {
      // Only apply other filters if not filtering by specific item
      if (kategoriId && kategoriId !== "all") {
        whereItem.kategoriId = kategoriId;
      }

      if (periodeId && periodeId !== "all") {
        whereItem.periodeId = periodeId;
      }

      if (level && level !== "all") {
        whereItem.level = parseInt(level);
      }
    }

    // Get items with their realization summary
    const items = await prisma.itemKeuangan.findMany({
      where: whereItem,
      include: {
        kategori: {
          select: {
            id: true,
            nama: true,
            kode: true,
          },
        },
        periode: {
          select: {
            id: true,
            nama: true,
            tahun: true,
          },
        },
        realisasiItemKeuangan: {
          where: whereRealisasi,
          select: {
            id: true,
            tanggalRealisasi: true,
            totalRealisasi: true,
            keterangan: true,
          },
          orderBy: [
            { tanggalRealisasi: "desc" },
          ],
        },
        _count: {
          select: {
            realisasiItemKeuangan: {
              where: whereRealisasi,
            },
          },
        },
      },
      orderBy: [
        { kategoriId: "asc" },
        { level: "asc" },
        { urutan: "asc" },
        { kode: "asc" },
      ],
    });

    // Process the data to include summary calculations
    const summaryData = items.map(item => {
      // Calculate totals
      const totalRealisasiAmount = item.realisasiItemKeuangan.reduce((sum, real) => {
        return sum + parseFloat(real.totalRealisasi || 0);
      }, 0);

      // Frequency is simply the count of realization records
      const totalFrekuensiActual = item.realisasiItemKeuangan.length;

      // Calculate variance (realisasi vs target)
      const targetAmount = parseFloat(item.totalTarget || 0);
      const targetFrekuensi = item.targetFrekuensi || 0;

      const varianceAmount = totalRealisasiAmount - targetAmount;
      const varianceFrekuensi = totalFrekuensiActual - targetFrekuensi;

      const variancePercentage = targetAmount > 0 ?
        ((totalRealisasiAmount / targetAmount) * 100) : 0;

      return {
        id: item.id,
        kode: item.kode,
        nama: item.nama,
        level: item.level,
        deskripsi: item.deskripsi,
        kategori: item.kategori,
        periode: item.periode,

        // Target data
        targetFrekuensi: item.targetFrekuensi,
        satuanFrekuensi: item.satuanFrekuensi,
        nominalSatuan: item.nominalSatuan ? item.nominalSatuan.toString() : null,
        totalTarget: item.totalTarget ? item.totalTarget.toString() : null,

        // Realization summary
        jumlahRealisasi: item._count.realisasiItemKeuangan,
        totalFrekuensiActual,
        totalRealisasiAmount: totalRealisasiAmount.toString(),

        // Variance analysis
        varianceAmount: varianceAmount.toString(),
        varianceFrekuensi,
        variancePercentage: Math.round(variancePercentage * 100) / 100,

        // Achievement status
        isTargetAchieved: totalRealisasiAmount >= targetAmount,
        achievementPercentage: Math.round(variancePercentage * 100) / 100,

        // Recent realizations (last 5)
        recentRealisasi: item.realisasiItemKeuangan.slice(0, 5).map(real => ({
          ...real,
          totalRealisasi: real.totalRealisasi.toString(),
        })),
      };
    });

    // Calculate overall summary
    const overallSummary = {
      totalItems: summaryData.length,
      totalTargetAmount: summaryData.reduce((sum, item) =>
        sum + parseFloat(item.totalTarget || 0), 0).toString(),
      totalRealisasiAmount: summaryData.reduce((sum, item) =>
        sum + parseFloat(item.totalRealisasiAmount || 0), 0).toString(),
      totalVarianceAmount: summaryData.reduce((sum, item) =>
        sum + parseFloat(item.varianceAmount || 0), 0).toString(),
      itemsWithRealisasi: summaryData.filter(item => item.jumlahRealisasi > 0).length,
      itemsTargetAchieved: summaryData.filter(item => item.isTargetAchieved).length,
    };

    return res
      .status(200)
      .json(apiResponse(true, {
        items: summaryData,
        summary: overallSummary,
      }, "Summary realisasi berhasil diambil"));
  } catch (error) {
    console.error("Error fetching realisasi summary:", error);
    return res
      .status(500)
      .json(
        apiResponse(
          false,
          null,
          "Gagal mengambil summary realisasi",
          error.message
        )
      );
  }
}