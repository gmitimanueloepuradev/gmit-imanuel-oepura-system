import prisma from "@/lib/prisma";
import { apiResponse } from "@/lib/apiHelper";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { active } = req.query;

    let where = {};
    if (active === 'true') {
      where.isActive = true;
    }

    const profiles = await prisma.profilPendeta.findMany({
      where,
      select: {
        id: true,
        nama: true,
        urlFoto: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: [
        { isActive: 'desc' },
        { createdAt: 'desc' }
      ],
    });

    // If requesting active profile, return only the first one
    if (active === 'true') {
      const activeProfile = profiles.length > 0 ? profiles[0] : null;
      return res.status(200).json(
        apiResponse(true, activeProfile, "Data profil pendeta aktif berhasil diambil")
      );
    }

    return res.status(200).json(
      apiResponse(true, profiles, "Data profil pendeta berhasil diambil")
    );
  } catch (error) {
    console.error("Error fetching public pastor profiles:", error);
    return res.status(500).json(
      apiResponse(false, null, "Gagal mengambil data profil pendeta", error.message)
    );
  }
}