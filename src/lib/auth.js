import { verifyToken, getTokenFromHeader } from "@/lib/jwt";
import prisma from "@/lib/prisma";
import { supabase } from "@/lib/supabaseClient";

// Get current user from Supabase session
export const getCurrentUser = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session) {
      return null;
    }

    // Get user details from our database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        noWhatsapp: true,
        idJemaat: true,
        jemaat: {
          select: {
            id: true,
            nama: true,
            jenisKelamin: true,
            keluarga: {
              select: {
                noBagungan: true,
                rayon: {
                  select: {
                    namaRayon: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!user) {
      return null;
    }

    return {
      ...user,
      supabase_user: session.user,
      session: session
    };

  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
};

// Check if user has required role
export const hasRole = (user, roles) => {
  if (!user || !user.role) return false;
  
  if (Array.isArray(roles)) {
    return roles.includes(user.role);
  }
  
  return user.role === roles;
};

// Get redirect URL based on user role
export const getRoleRedirectUrl = (role) => {
  switch (role) {
    case "ADMIN":
      return "/admin/dashboard";
    case "JEMAAT":
      return "/jemaat/dashboard";
    case "MAJELIS":
      return "/majelis/dashboard";
    case "EMPLOYEE":
      return "/employee/dashboard";
    default:
      return "/dashboard";
  }
};

// Server-side authentication check
export const requireAuth = async (req, res, allowedRoles = null) => {
  try {
    const authHeader = req.headers.authorization;
    const token = getTokenFromHeader(authHeader);
    
    if (!token) {
      return {
        error: "Token tidak ditemukan",
        status: 401
      };
    }

    // Verify JWT token
    const tokenPayload = verifyToken(token);

    if (!tokenPayload) {
      return {
        error: "Token tidak valid",
        status: 401
      };
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: tokenPayload.id },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        noWhatsapp: true,
        idJemaat: true,
        idMajelis: true,
        jemaat: {
          select: {
            id: true,
            nama: true,
            jenisKelamin: true,
            tanggalLahir: true,
            golonganDarah: true,
            idStatusDalamKeluarga: true,
            idSuku: true,
            idPendidikan: true,
            idPekerjaan: true,
            idPendapatan: true,
            idJaminanKesehatan: true,
            keluarga: {
              select: {
                id: true,
                noBagungan: true,
                rayon: {
                  select: {
                    id: true,
                    namaRayon: true
                  }
                }
              }
            },
            statusDalamKeluarga: {
              select: {
                id: true,
                status: true
              }
            },
            suku: {
              select: {
                id: true,
                namaSuku: true
              }
            },
            pendidikan: {
              select: {
                id: true,
                jenjang: true
              }
            },
            pekerjaan: {
              select: {
                id: true,
                namaPekerjaan: true
              }
            },
            pendapatan: {
              select: {
                id: true,
                label: true
              }
            },
            jaminanKesehatan: {
              select: {
                id: true,
                jenisJaminan: true
              }
            }
          }
        },
        majelis: {
          select: {
            id: true,
            namaLengkap: true,
            mulai: true,
            selesai: true,
            idRayon: true,
            rayon: {
              select: {
                id: true,
                namaRayon: true
              }
            },
            jenisJabatan: {
              select: {
                id: true,
                namaJabatan: true
              }
            }
          }
        }
      }
    });

    if (!user) {
      return {
        error: "User tidak ditemukan",
        status: 404
      };
    }

    // Check role if specified
    if (allowedRoles && !hasRole(user, allowedRoles)) {
      return {
        error: "Tidak memiliki akses",
        status: 403
      };
    }

    return {
      user
    };

  } catch (error) {
    console.error("Error in requireAuth:", error);
    return {
      error: "Terjadi kesalahan server",
      status: 500
    };
  }
};