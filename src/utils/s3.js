const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const s3 = require("../config/s3Client");

const sanitizeFileName = (fileName) =>
  fileName.replace(/[^a-zA-Z0-9._-]/g, "-");

const buildPublicUrl = (key) =>
  `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

const buildObjectKey = (fileName) =>
  `uploads/${Date.now()}-${sanitizeFileName(fileName)}`;

async function genUploadPresignedUrl(fileName, contentType) {
  const key = buildObjectKey(fileName);

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  const url = await getSignedUrl(s3, command, {
    expiresIn: 60 * 5,
  });

  return { url, key, imageUrl: buildPublicUrl(key) };
}

async function uploadToS3(fileName, contentType, buffer) {
  const key = buildObjectKey(fileName);

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  });

  await s3.send(command);

  return { key, imageUrl: buildPublicUrl(key) };
}

module.exports = { genUploadPresignedUrl, uploadToS3, buildPublicUrl };
