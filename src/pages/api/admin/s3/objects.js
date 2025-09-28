import { ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function GET(request) {
  try {
    // Check if user is authenticated and has admin role
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const prefix = searchParams.get("prefix") || "";
    const search = searchParams.get("search") || "";

    const bucketName = process.env.AWS_S3_BUCKET_NAME;

    if (!bucketName) {
      return NextResponse.json(
        { error: "S3 bucket not configured" },
        { status: 500 }
      );
    }

    const command = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: prefix,
      Delimiter: "/",
    });

    const response = await s3Client.send(command);

    // Filter objects by search query if provided
    let objects = response.Contents || [];
    let folders =
      response.CommonPrefixes?.map((prefix) =>
        prefix.Prefix.replace(/\/$/, "").split("/").pop()
      ) || [];

    if (search) {
      objects = objects.filter((obj) =>
        obj.Key.toLowerCase().includes(search.toLowerCase())
      );
      folders = folders.filter((folder) =>
        folder.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Transform objects to include additional info
    const transformedObjects = objects.map((obj) => ({
      key: obj.Key,
      size: obj.Size,
      lastModified: obj.LastModified,
      url: `https://${bucketName}.s3.${process.env.AWS_REGION || "us-east-1"}.amazonaws.com/${obj.Key}`,
    }));

    return NextResponse.json({
      success: true,
      data: {
        objects: transformedObjects,
        folders: folders,
        currentPath: prefix,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to list S3 objects" },
      { status: 500 }
    );
  }
}
