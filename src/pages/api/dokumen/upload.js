// import { DocumentUploadService } from '../../../services/documentUploadService';
// import { verifyToken } from '../../../lib/auth';
import { promisify } from "util";

import multer from "multer";

import { verifyToken } from "@/lib/jwt";
import DocumentUploadService from "@/services/documentUploadService";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1024 * 1024, // 1MB
  },
});

const uploadMiddleware = promisify(upload.single("dokumen"));

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method tidak diizinkan",
    });
  }

  try {
    const user = verifyToken(req);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Token tidak valid",
      });
    }

    await uploadMiddleware(req, res);

    const { jemaatId, tipeDokumen } = req.body;
    const file = req.file;

    if (!jemaatId || !tipeDokumen || !file) {
      return res.status(400).json({
        success: false,
        message: "jemaatId, tipeDokumen, dan file harus disediakan",
      });
    }

    if (!["BAPTIS", "SIDI", "NIKAH"].includes(tipeDokumen)) {
      return res.status(400).json({
        success: false,
        message: "tipeDokumen harus BAPTIS, SIDI, atau NIKAH",
      });
    }

    const result = await DocumentUploadService.uploadDocument(
      jemaatId,
      tipeDokumen,
      file,
      file.size,
      user.id
    );

    res.status(200).json(result);
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Gagal upload dokumen",
    });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
