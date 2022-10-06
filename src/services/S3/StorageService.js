const Aws = require('aws-sdk');
const config = require('../../utils/config');

module.exports = class StorageService {
  constructor() {
    this._S3 = new Aws.S3();
  }

  writeFile(file, meta) {
    const parameter = {
      Bucket: config.aws.s3.bucketName,
      Key: +new Date() + meta.filename,
      Body: file._data,
      ContentType: meta.headers['content-type'],
    };

    return new Promise((resolve, reject) => {
      this._S3.upload(parameter, (error, data) => {
        if (error) {
          return reject(error);
        }

        return resolve(data.Location);
      });
    });
  }
};
