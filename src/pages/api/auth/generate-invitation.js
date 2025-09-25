import { apiResponse } from "@/lib/apiHelper";
import { createApiHandler } from "@/lib/apiHandler";
import { requireAuth } from "@/lib/auth";
import { signToken } from "@/lib/jwt";
import prisma from "@/lib/prisma";

async function handlePost(req, res) {
  try {
    const authResult = await requireAuth(req, res, "ADMIN");
    
    if (authResult.error) {
      return res
        .status(authResult.status)
        .json(apiResponse(false, null, authResult.error));
    }

    const { userId, keluargaId, whatsappNumber } = req.body;

    if (!userId || !keluargaId || !whatsappNumber) {
      return res
        .status(400)
        .json(apiResponse(false, null, "Data tidak lengkap"));
    }

    // Get user data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        role: true
      }
    });

    if (!user) {
      return res
        .status(404)
        .json(apiResponse(false, null, "User tidak ditemukan"));
    }

    if (user.role !== "JEMAAT") {
      return res
        .status(400)
        .json(apiResponse(false, null, "Hanya user dengan role JEMAAT yang dapat diundang"));
    }

    // Get keluarga data
    const keluarga = await prisma.keluarga.findUnique({
      where: { id: keluargaId },
      select: {
        id: true,
        noBagungan: true,
        rayon: {
          select: {
            id: true,
            namaRayon: true
          }
        },
        jemaats: {
          where: {
            statusDalamKeluarga: {
              status: "Kepala Keluarga"
            }
          },
          select: {
            nama: true
          },
          take: 1
        }
      }
    });

    if (!keluarga) {
      return res
        .status(404)
        .json(apiResponse(false, null, "Keluarga tidak ditemukan"));
    }

    // Generate compact invitation token - only essential IDs
    const tokenPayload = {
      type: "invitation",
      userId: user.id,
      keluargaId: keluarga.id,
      whatsappNumber // Keep this for tracking
    };

    const invitationToken = signToken(tokenPayload, "7d");

    // Create WhatsApp invitation URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const onboardingUrl = `${baseUrl}/onboarding?token=${invitationToken}`;

    // Ensure URL has proper protocol for WhatsApp link detection
    const cleanUrl = onboardingUrl.startsWith('http') ? onboardingUrl : `https://${onboardingUrl}`;
    
    const keluargaDisplayName = keluarga.jemaats[0]?.nama || `Bangunan ${keluarga.noBagungan}`;

    const whatsappMessage = encodeURIComponent(
      `🙏 *GMIT Imanuel Oepura*\n\n` +
      `Halo ${user.username}!\n\n` +
      `Anda telah diundang untuk melengkapi profil jemaat.\n\n` +
      `👨‍👩‍👧‍👦 *Keluarga:* ${keluargaDisplayName}\n` +
      `📍 *Rayon:* ${keluarga.rayon.namaRayon}\n\n` +
      `👆 *KLIK LINK DI BAWAH INI:*\n` +
      `${cleanUrl}\n\n` +
      `⏰ Link berlaku 7 hari\n` +
      `📝 Lengkapi data pribadi Anda\n\n` +
      `Terima kasih! 🙏`
    );

    // Format WhatsApp number for Indonesia (+62)
    const formatWhatsAppNumber = (phone) => {
      // Remove all non-digit characters
      const cleaned = phone.replace(/\D/g, '');
      
      // If starts with 0, replace with 62
      if (cleaned.startsWith('0')) {
        return '62' + cleaned.substring(1);
      }
      
      // If already starts with 62, keep as is
      if (cleaned.startsWith('62')) {
        return cleaned;
      }
      
      // Otherwise, assume it needs 62 prefix
      return '62' + cleaned;
    };

    const formattedWhatsAppNumber = formatWhatsAppNumber(whatsappNumber);
    const whatsappUrl = `https://wa.me/${formattedWhatsAppNumber}?text=${whatsappMessage}`;

    return res
      .status(200)
      .json(apiResponse(true, {
        token: invitationToken,
        onboardingUrl,
        whatsappUrl,
        user: {
          username: user.username,
          email: user.email
        },
        keluarga: {
          noBagungan: keluarga.noBagungan,
          namaKepalaKeluarga: keluarga.jemaats[0]?.nama || null,
          rayon: keluarga.rayon.namaRayon
        },
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      }, "Token undangan berhasil dibuat"));

  } catch (error) {
    console.error("Error generating invitation token:", error);
    return res
      .status(500)
      .json(apiResponse(false, null, "Terjadi kesalahan server", error.message));
  }
}

export default createApiHandler({
  POST: handlePost,
});