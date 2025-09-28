import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { S3Client, DeleteObjectsCommand } from "@aws-sdk/client-s3";

import { authOptions } from "@/lib/auth";

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function POST(request) {
  try {
    // Check if user is authenticated and has admin role
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 },
      );
    }

    const { keys } = await request.json();

    if (!keys || !Array.isArray(keys) || keys.length === 0) {
      return NextResponse.json({ error: "No keys provided" }, { status: 400 });
    }

    const bucketName = process.env.AWS_S3_BUCKET_NAME;

    if (!bucketName) {
      return NextResponse.json(
        { error: "S3 bucket not configured" },
        { status: 500 },
      );
    }

    const deleteObjects = keys.map((key) => ({ Key: key }));

    const command = new DeleteObjectsCommand({
      Bucket: bucketName,
      Delete: {
        Objects: deleteObjects,
      },
    });

    const response = await s3Client.send(command);

    return NextResponse.json({
      success: true,
      message: `${keys.length} files deleted successfully`,
      deleted: response.Deleted || [],
      errors: response.Errors || [],
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete files" },
      { status: 500 },
    );
  }
}
