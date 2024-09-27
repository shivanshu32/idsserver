const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { S3Client, GetObjectCommand, ListObjectsV2Command, PutObjectCommand } = require('@aws-sdk/client-s3');
// const sharp = require('sharp');
// const { Readable } = require('stream');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accessKey = process.env.ACCESS_KEY;
const secretKey = process.env.SECRET_ACCESS_KEY;

// Initialize S3 client
const s3Client = new S3Client({
  credentials: { accessKeyId: accessKey, secretAccessKey: secretKey },
  region: bucketRegion,
});

const getSignedUrlFromS3 = async (key, expiresIn = 3600) => {
  if (key) {
    try {
      const newKey = `compressed/${key}`;
      const getObjectParams = {
        Bucket: bucketName,
        Key: newKey,
      };
      const command = new GetObjectCommand(getObjectParams);
      return await getSignedUrl(s3Client, command, { expiresIn });
    } catch (error) {
      throw new Error('Error generating signed URL: ' + error.message);
    }
  }
};




module.exports = {
  getSignedUrlFromS3,
};




