import { PrismaClient } from "@prisma/client";
import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || "us-east-1",
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

const ALLOWED_FILE_TYPES = {
  "application/pdf": ".pdf",
  "image/png": ".png",
  "image/jpeg": ".jpg",
};

const MAX_FILE_SIZE = 1024 * 1024; // 1MB

export class DocumentUploadService {
  static validateFile(file, fileSize) {
    if (!file || !fileSize) {
      throw new Error("File dan ukuran file harus disediakan");
    }

    if (fileSize > MAX_FILE_SIZE) {
      throw new Error("Ukuran file maksimal 1MB");
    }

    if (!ALLOWED_FILE_TYPES[file.type]) {
      throw new Error("Tipe file harus PDF, PNG, atau JPG");
    }

    return true;
  }

  static async uploadToS3(file, fileName, jemaatId, tipeDokumen) {
    try {
      const fileExtension = ALLOWED_FILE_TYPES[file.type];
      const s3Key = `dokumen-jemaat/${jemaatId}/${tipeDokumen}/${fileName}${fileExtension}`;

      const uploadParams = {
        Bucket: BUCKET_NAME,
        Key: s3Key,
        Body: file,
        ContentType: file.type,
        ServerSideEncryption: "AES256",
        Metadata: {
          jemaatId: jemaatId,
          tipeDokumen: tipeDokumen,
          originalName: fileName,
        },
      };

      const result = await s3.upload(uploadParams).promise();

      return {
        url: result.Location,
        key: result.Key,
        bucket: result.Bucket,
      };
    } catch (error) {
      throw new Error(`Gagal upload ke S3: ${error.message}`);
    }
  }

  static async deleteFromS3(s3Key) {
    try {
      const deleteParams = {
        Bucket: BUCKET_NAME,
        Key: s3Key,
      };

      await s3.deleteObject(deleteParams).promise();

      return true;
    } catch (error) {
      throw new Error(`Gagal hapus dari S3: ${error.message}`);
    }
  }

  static async saveDokumenToDatabase(
    jemaatId,
    tipeDokumen,
    fileData,
    uploadedBy
  ) {
    try {
      const dokumen = await prisma.dokumenJemaat.create({
        data: {
          jemaatId: jemaatId,
          tipeDokumen: tipeDokumen,
          namaFile: fileData.originalName,
          urlFile: fileData.url,
          s3Key: fileData.key,
          statusDokumen: "PENDING",
          uploadedBy: uploadedBy,
        },
        include: {
          jemaat: {
            select: {
              nama: true,
              id: true,
            },
          },
        },
      });

      return dokumen;
    } catch (error) {
      throw new Error(`Gagal simpan ke database: ${error.message}`);
    }
  }

  static async uploadDocument(
    jemaatId,
    tipeDokumen,
    file,
    fileSize,
    uploadedBy
  ) {
    try {
      this.validateFile({ type: file.mimetype }, fileSize);

      const fileName = `${tipeDokumen.toLowerCase()}_${Date.now()}_${uuidv4()}`;

      const s3Data = await this.uploadToS3(
        file,
        fileName,
        jemaatId,
        tipeDokumen
      );

      const fileData = {
        originalName: file.originalname || file.name,
        url: s3Data.url,
        key: s3Data.key,
      };

      const dokumen = await this.saveDokumenToDatabase(
        jemaatId,
        tipeDokumen,
        fileData,
        uploadedBy
      );

      return {
        success: true,
        data: dokumen,
        message: "Dokumen berhasil diupload",
      };
    } catch (error) {
      throw error;
    }
  }

  static async getDokumenByJemaat(jemaatId) {
    try {
      const dokumen = await prisma.dokumenJemaat.findMany({
        where: {
          jemaatId: jemaatId,
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          jemaat: {
            select: {
              nama: true,
              id: true,
            },
          },
        },
      });

      return dokumen;
    } catch (error) {
      throw new Error(`Gagal ambil dokumen: ${error.message}`);
    }
  }

  static async updateStatusDokumen(
    dokumenId,
    status,
    verifiedBy,
    catatan = null
  ) {
    try {
      const dokumen = await prisma.dokumenJemaat.update({
        where: {
          id: dokumenId,
        },
        data: {
          statusDokumen: status,
          verifiedBy: verifiedBy,
          verifiedAt: new Date(),
          catatan: catatan,
        },
        include: {
          jemaat: {
            select: {
              nama: true,
              id: true,
            },
          },
        },
      });

      return dokumen;
    } catch (error) {
      throw new Error(`Gagal update status: ${error.message}`);
    }
  }

  static async deleteDokumen(dokumenId, deletedBy) {
    try {
      const dokumen = await prisma.dokumenJemaat.findUnique({
        where: { id: dokumenId },
      });

      if (!dokumen) {
        throw new Error("Dokumen tidak ditemukan");
      }

      await this.deleteFromS3(dokumen.s3Key);

      await prisma.dokumenJemaat.delete({
        where: { id: dokumenId },
      });

      return {
        success: true,
        message: "Dokumen berhasil dihapus",
      };
    } catch (error) {
      throw error;
    }
  }

  static async getDokumenPendingVerification() {
    try {
      const dokumen = await prisma.dokumenJemaat.findMany({
        where: {
          statusDokumen: "PENDING",
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          jemaat: {
            select: {
              nama: true,
              id: true,
            },
          },
        },
      });

      return dokumen;
    } catch (error) {
      throw new Error(`Gagal ambil dokumen pending: ${error.message}`);
    }
  }

  static async getJemaatProgressDokumen(jemaatId) {
    try {
      const totalDokumen = 3; // BAPTIS, SIDI, NIKAH

      const dokumenUploaded = await prisma.dokumenJemaat.count({
        where: {
          jemaatId: jemaatId,
          statusDokumen: {
            in: ["PENDING", "APPROVED"],
          },
        },
      });

      const dokumenApproved = await prisma.dokumenJemaat.count({
        where: {
          jemaatId: jemaatId,
          statusDokumen: "APPROVED",
        },
      });

      const progress = Math.round((dokumenApproved / totalDokumen) * 100);

      const missingDocuments = [];
      const uploadedTypes = await prisma.dokumenJemaat.findMany({
        where: {
          jemaatId: jemaatId,
          statusDokumen: {
            in: ["PENDING", "APPROVED"],
          },
        },
        select: {
          tipeDokumen: true,
        },
      });

      const uploadedTypesList = uploadedTypes.map((doc) => doc.tipeDokumen);

      if (!uploadedTypesList.includes("BAPTIS"))
        missingDocuments.push("BAPTIS");
      if (!uploadedTypesList.includes("SIDI")) missingDocuments.push("SIDI");
      if (!uploadedTypesList.includes("NIKAH")) missingDocuments.push("NIKAH");

      return {
        progress: progress,
        dokumenUploaded: dokumenUploaded,
        dokumenApproved: dokumenApproved,
        totalDokumen: totalDokumen,
        missingDocuments: missingDocuments,
      };
    } catch (error) {
      throw new Error(`Gagal ambil progress: ${error.message}`);
    }
  }
}

export default DocumentUploadService;
