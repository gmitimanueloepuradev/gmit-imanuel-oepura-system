// import { DocumentUploadService } from '../../../../services/documentUploadService';
// import { verifyToken } from '../../../../lib/auth';

import { verifyToken } from "@/lib/jwt";
import DocumentUploadService from "@/services/documentUploadService";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const user = verifyToken(req);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Token tidak valid",
        });
      }

      const dokumen = await DocumentUploadService.getDokumenByJemaat(id);

      res.status(200).json({
        success: true,
        data: dokumen,
        message: "Data dokumen berhasil diambil",
      });
    } catch (error) {
      console.error("Get dokumen error:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Gagal mengambil data dokumen",
      });
    }
  } else {
    res.status(405).json({
      success: false,
      message: "Method tidak diizinkan",
    });
  }
}
