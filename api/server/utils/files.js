const AWS = require('aws-sdk');
const { aws } = require('../config');

AWS.config.update({
  accessKeyId: aws.keyId,
  secretAccessKey: aws.secretKey,
});

const s3 = new AWS.S3();
const bucketName = 'barberTurn';

const uploadFile = (file) => {
  const params = {
    Bucket: bucketName,
    Body: file.data,
    Key: `${file.name}_${Date.now()}`,
    ACL: 'public-read',
  };

  return s3.upload(params).promise();
};

const deleteFile = (Key) => {
  const params = {
    Bucket: bucketName,
    Key,
  };

  return s3.deleteObject(params).promise();
};

module.exports = {
  s3,
  uploadFile,
  deleteFile,
};
