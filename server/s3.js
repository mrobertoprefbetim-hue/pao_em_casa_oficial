const AWS = require('aws-sdk');
const fs = require('fs');
const s3 = new AWS.S3({ accessKeyId: process.env.S3_KEY, secretAccessKey: process.env.S3_SECRET, region: process.env.S3_REGION });
async function uploadFile(localPath, destKey){ const fileContent = fs.readFileSync(localPath); const params = { Bucket: process.env.S3_BUCKET, Key: destKey, Body: fileContent, ACL: 'private' }; const res = await s3.upload(params).promise(); return res.Location; }
module.exports = { uploadFile };
