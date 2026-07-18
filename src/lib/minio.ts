import { Client } from "minio";

const endpoint = process.env.MINIO_ENDPOINT || "localhost";
const port = parseInt(process.env.MINIO_PORT || "9000");
const accessKey = process.env.MINIO_ACCESS_KEY || "minioadmin";
const secretKey = process.env.MINIO_SECRET_KEY || "minioadmin";
const bucket = process.env.MINIO_BUCKET || "blog-images";
const publicUrl = process.env.MINIO_PUBLIC_URL || "http://localhost/images";

let client: Client | null = null;

export function getMinioClient(): Client {
  if (!client) {
    client = new Client({ endPoint: endpoint, port, useSSL: false, accessKey, secretKey });
  }
  return client;
}

export function getBucket(): string {
  return bucket;
}

export function getPublicUrl(): string {
  return publicUrl;
}

export async function ensureBucket(): Promise<void> {
  const c = getMinioClient();
  const exists = await c.bucketExists(bucket);
  if (!exists) {
    await c.makeBucket(bucket);
    const policy = {
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          Principal: { AWS: ["*"] },
          Action: ["s3:GetObject"],
          Resource: [`arn:aws:s3:::${bucket}/*`],
        },
      ],
    };
    await c.setBucketPolicy(bucket, JSON.stringify(policy));
  }
}
