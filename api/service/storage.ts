import { S3, ListObjectsV2Command, PutObjectCommand, PutObjectCommandOutput, GetObjectCommand } from "npm:@aws-sdk/client-s3";

const client = new S3({
  region: "ap-northeast-1",
});

const bucket = Deno.env.get("BUCKET_NAME") ?? "";

export async function listObjects() {
  if (!bucket) {
    console.error("BUCKET_NAME environment variable is not set.");
    throw new Error("S3 bucket name is not configured.");
  }

  const command = new ListObjectsV2Command({
    Bucket: bucket,
    // You can add other parameters here if needed, like Prefix, MaxKeys, etc.
  });

  try {
    const data = await client.send(command);
    return data.Contents || []; // Contents might be undefined if the bucket is empty
  } catch (error) {
    console.error("Error listing objects from S3:", error);
    throw error; // Re-throw the error for the caller to handle
  }
}

/**
 * Puts an object into the S3 bucket.
 * @param key The key (path/filename) for the object in S3.
 * @param body The content of the object. Can be a string, Uint8Array, or ReadableStream.
 * @param contentType The MIME type of the object (e.g., 'image/jpeg', 'text/plain'). Optional.
 * @returns The S3 PutObjectCommandOutput on success.
 */
export async function putObject(
  key: string,
  body: string | Uint8Array | ReadableStream,
  contentType?: string,
): Promise<PutObjectCommandOutput> {
  if (!bucket) {
    console.error("BUCKET_NAME environment variable is not set.");
    throw new Error("S3 bucket name is not configured.");
  }

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: body,
    ContentType: contentType,
  });

  try {
    const response = await client.send(command);
    console.log(`Successfully uploaded ${key} to ${bucket}. ETag: ${response.ETag}`);
    return response;
  } catch (error) {
    console.error(`Error uploading ${key} to S3:`, error);
    throw error; // Re-throw the error for the caller to handle
  }
}


export async function getObject(key: string) {
  if (!bucket) {
    console.error("BUCKET_NAME environment variable is not set.");
    throw new Error("S3 bucket name is not configured.");
  }

  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  try {
    const response = await client.send(command);
    return response;
  } catch (error) {
    console.error(`Error getting ${key} from S3:`, error);
    throw error; // Re-throw the error for the caller to handle
  }
}