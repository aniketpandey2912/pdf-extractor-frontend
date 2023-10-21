import React, { useState } from "react";
import styles from "./FileUploadForm.module.css";

function FileUploadForm({ onPdfFileChange }) {
  const [selectedFile, setSelectedFile] = useState(null);

  // Setting up uploaded pdf file
  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      onPdfFileChange(file); // Notify the parent component about the selected PDF file
    } else {
      setSelectedFile(null);
      alert("Please select a valid PDF file.");
    }
  };

  return (
    <div className={styles.upload_container}>
      <h2>PDF-EXTRACTOR</h2>
      <input type="file" accept=".pdf" onChange={handleFileChange} />

      {selectedFile ? (
        <div className="upload_file_info">
          <p>Selected file: {selectedFile.name}</p>
          <p>File size: {selectedFile.size} bytes</p>
        </div>
      ) : null}
    </div>
  );
}

export default FileUploadForm;
