require('dotenv').config({
  path: `${process.cwd()}/.env`,
  quiet: true,
});

const { S3Client, ListObjectsV2Command } = require("@aws-sdk/client-s3");

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function testS3() {
  try {
    const command = new ListObjectsV2Command({
      Bucket: process.env.AWS_BUCKET_NAME,
    });

    const result = await s3.send(command);
    console.log(result.Contents);
  } catch (error) {
    console.error(error);
  }
}

module.exports = s3;
