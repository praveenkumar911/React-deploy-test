import React, { useState } from 'react';
import AWS from 'aws-sdk';

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (!selectedFile) {
      setUploadStatus('Please select a file first.');
      return;
    }

    // Configure AWS SDK with your MinIO endpoint, access key, and secret key
    AWS.config.update({
      accessKeyId: 'minioadmin',
      secretAccessKey: 'Minio@0710',
      endpoint: 'http://10.8.0.15:9000',
      s3ForcePathStyle: true, // Required for MinIO
      signatureVersion: 'v4', // Required for MinIO
    });

    const s3 = new AWS.S3();
    const bucketName = 'rcts-audio-data-ncert';
    const objectName = selectedFile.name;

    const params = {
      Bucket: bucketName,
      Key: objectName,
      Body: selectedFile,
    };

    s3.upload(params, (err, data) => {
      if (err) {
        setUploadStatus(`Error uploading: ${err.message}`);
      } else {
        setUploadStatus(`File uploaded successfully: ${objectName}`);
      }
    });
  };

  return (
    <div>
      <h2>Upload a File to MinIO</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      <p>{uploadStatus}</p>
    </div>
  );
};

export default FileUpload;
