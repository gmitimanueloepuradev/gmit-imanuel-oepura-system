import multer from "multer";
import { v4 as uuidv4 } from "uuid";

import { requireAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { uploadFileToS3, deleteFileFromS3 } from "@/lib/s3";
import { apiResponse } from "@/lib/apiHelper";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
  fileFilter: (req, file, cb) => {
    // Allow only image files
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipe file harus PNG, JPG, atau JPEG'), false);
    }
  },
});

// GET - Get pastor profile by ID
async function handleGet(req, res) {
  try {
    const { id } = req.query;

    const profile = await prisma.profilPendeta.findUnique({
      where: { id },
    });

    if (!profile) {
      return res.status(404).json(
        apiResponse(false, null, "Profil pendeta tidak ditemukan")
      );
    }

    return res.status(200).json(
      apiResponse(true, profile, "Data profil pendeta berhasil diambil")
    );
  } catch (error) {
    console.error("Error fetching pastor profile:", error);
    return res.status(500).json(
      apiResponse(false, null, "Gagal mengambil data profil pendeta", error.message)
    );
  }
}

// PATCH - Update pastor profile
async function handlePatch(req, res) {
  // Check authentication
  const authResult = await requireAuth(req, res);
  if (authResult.error) {
    return res.status(authResult.status).json(
      apiResponse(false, null, authResult.error)
    );
  }

  const { user } = authResult;

  // Check if user is admin
  if (user.role !== 'ADMIN') {
    return res.status(403).json(
      apiResponse(false, null, "Hanya admin yang dapat mengubah profil pendeta")
    );
  }

  upload.single("foto")(req, res, async (err) => {
    if (err) {
      console.error('Multer error:', err);
      return res.status(400).json(
        apiResponse(false, null, err.message)
      );
    }

    try {
      const { id } = req.query;
      const { nama } = req.body;
      const file = req.file;

      // Check if profile exists
      const existingProfile = await prisma.profilPendeta.findUnique({
        where: { id },
      });

      if (!existingProfile) {
        return res.status(404).json(
          apiResponse(false, null, "Profil pendeta tidak ditemukan")
        );
      }

      const updateData = {
        updatedBy: user.id,
      };

      // Update name if provided
      if (nama) {
        updateData.nama = nama;
      }

      // Handle photo update
      if (file) {
        // Delete old photo if exists
        if (existingProfile.s3Key) {
          try {
            await deleteFileFromS3(existingProfile.s3Key);
          } catch (deleteError) {
            console.warn("Failed to delete old photo:", deleteError);
          }
        }

        // Upload new photo
        const fileName = `profil-pendeta-${Date.now()}-${uuidv4()}`;
        const fileExtension = file.mimetype === 'image/png' ? '.png' : '.jpg';
        const s3Key = `profil-pendeta/${fileName}${fileExtension}`;

        const uploadResult = await uploadFileToS3(file, s3Key);
        if (!uploadResult.success) {
          throw new Error(uploadResult.error);
        }

        updateData.urlFoto = uploadResult.url;
        updateData.s3Key = s3Key;
      }

      // Update profile
      const updatedProfile = await prisma.profilPendeta.update({
        where: { id },
        data: updateData,
      });

      return res.status(200).json(
        apiResponse(true, updatedProfile, "Profil pendeta berhasil diperbarui")
      );
    } catch (error) {
      console.error("Error updating pastor profile:", error);
      return res.status(500).json(
        apiResponse(false, null, "Gagal memperbarui profil pendeta", error.message)
      );
    }
  });
}

// DELETE - Delete pastor profile
async function handleDelete(req, res) {
  // Check authentication
  const authResult = await requireAuth(req, res);
  if (authResult.error) {
    return res.status(authResult.status).json(
      apiResponse(false, null, authResult.error)
    );
  }

  const { user } = authResult;

  // Check if user is admin
  if (user.role !== 'ADMIN') {
    return res.status(403).json(
      apiResponse(false, null, "Hanya admin yang dapat menghapus profil pendeta")
    );
  }

  try {
    const { id } = req.query;

    // Check if profile exists
    const existingProfile = await prisma.profilPendeta.findUnique({
      where: { id },
    });

    if (!existingProfile) {
      return res.status(404).json(
        apiResponse(false, null, "Profil pendeta tidak ditemukan")
      );
    }

    // Delete photo from S3 if exists
    if (existingProfile.s3Key) {
      try {
        await deleteFileFromS3(existingProfile.s3Key);
      } catch (deleteError) {
        console.warn("Failed to delete photo from S3:", deleteError);
      }
    }

    // Delete profile
    await prisma.profilPendeta.delete({
      where: { id },
    });

    return res.status(200).json(
      apiResponse(true, { id }, "Profil pendeta berhasil dihapus")
    );
  } catch (error) {
    console.error("Error deleting pastor profile:", error);
    return res.status(500).json(
      apiResponse(false, null, "Gagal menghapus profil pendeta", error.message)
    );
  }
}

export default async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      return handleGet(req, res);
    case 'PATCH':
      return handlePatch(req, res);
    case 'DELETE':
      return handleDelete(req, res);
    default:
      return res.status(405).json(
        apiResponse(false, null, "Method tidak diizinkan")
      );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};