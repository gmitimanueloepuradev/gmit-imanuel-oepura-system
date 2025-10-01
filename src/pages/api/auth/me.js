import { apiResponse } from "@/lib/apiHelper";
import { createApiHandler } from "@/lib/apiHandler";
import { requireAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";

async function handleGet(req, res) {
  try {
    const authResult = await requireAuth(req, res);
    
    if (authResult.error) {
      return res
        .status(authResult.status)
        .json(apiResponse(false, null, authResult.error));
    }

    const user = authResult.user;
    
    // Check if jemaat user has profile data
    let isHasProfile = true;
    if (user.role === "JEMAAT" && !user.idJemaat) {
      isHasProfile = false;
    }

    // Include majelis data if user has idMajelis
    let userData = {
      ...user,
      isHasProfile
    };

    if (user.idMajelis) {
      try {
        const majelis = await prisma.majelis.findUnique({
          where: { id: user.idMajelis },
          include: {
            rayon: true
          }
        });
        
        if (majelis) {
          userData.majelis = majelis;
        }
      } catch (error) {
        console.error("Error fetching majelis data:", error);
        // Continue without majelis data if there's an error
      }
    }

    return res
      .status(200)
      .json(apiResponse(true, userData, "Data user berhasil diambil"));

  } catch (error) {
    console.error("Error getting user data:", error);
    return res
      .status(500)
      .json(apiResponse(false, null, "Terjadi kesalahan server", error.message));
  }
}

export default createApiHandler({
  GET: handleGet,
});