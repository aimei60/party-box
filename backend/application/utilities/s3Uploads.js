import crypto from "crypto";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const bucketName = process.env.ACCOUNT_IMAGES_BUCKET_NAME;
const cloudfrontDomain = process.env.ACCOUNT_IMAGES_CLOUDFRONT_DOMAIN;

//creates connection to S3 
const s3 = new S3Client({
  region: region,
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
  },
});

//file extension helper
function getExtension(mimetype) {
  if (mimetype === "image/jpeg") return ".jpg";
  if (mimetype === "image/png") return ".png";
  if (mimetype === "image/webp") return ".webp";
  return "";
}

function buildCloudfrontUrl(key) {
  return "https://" + cloudfrontDomain + "/" + key;
}

//takes an uploaded image file, stores it securely in S3, and returns a CloudFront URL
export async function uploadProductImageToS3(file, productId) {
  if (!bucketName || !cloudfrontDomain) {
    throw new Error("Missing S3/CloudFront env vars");
  }

  if (!file) {
    throw new Error("No file received");
  }

  const ext = getExtension(file.mimetype);
  if (ext === "") {
    throw new Error("Only JPEG, PNG, or WEBP allowed");
  }

  const randomId = crypto.randomBytes(16).toString("hex");
  const key = "product-images/" + String(productId) + "/" + randomId + ext;

  await s3.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: "private",
    })
  );

  return {
    key: key,
    url: buildCloudfrontUrl(key),
  };
}