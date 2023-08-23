const AWS = require("aws-sdk");
const fs = require("fs");
const AdmZip = require("adm-zip");

// Configure AWS credentials and region
AWS.config.update({
  accessKeyId: " accessKeyId ",
  secretAccessKey: "secretAccessKey ",
  region: "region",
  sessionToken: "sessionToken",
});

const s3 = new AWS.S3();

// Function to read files from a zip archive and upload them to S3 with a delay
const uploadFilesFromZipToS3 = (zipFilePath, bucketName, delay) => {
  const zip = new AdmZip(zipFilePath);
  const zipEntries = zip.getEntries();
  zipEntries.forEach((zipEntry) => {
    if (zipEntry != null) {
      const fileData = zipEntry.getData();
      const fileKey = zipEntry.entryName.split("/").pop();
      uploadFileToS3(bucketName, fileKey, fileData, delay);
    }
  });
};

const uploadFileToS3 = (bucketName, fileKey, fileData, delay) => {
  setTimeout(() => {
    s3.upload(
      {
        Bucket: bucketName,
        Key: fileKey,
        Body: fileData,
      },
      (err, data) => {
        if (err) {
          console.error(`Error uploading ${fileKey}:`, err);
        } else {
          console.log(`${fileKey} uploaded successfully.`);
        }
      }
    );
  }, delay);
};

// Usage
const zipFilePath = "tech.zip";
const bucketName = "sampledatab00934514";
const delayBetweenUploads = 100;

uploadFilesFromZipToS3(zipFilePath, bucketName, delayBetweenUploads);
