import styles from "./FileUploadForm.module.css";
import React, { useState } from "react";
import axios from "axios";

function FileUploadForm({
  handlePdfFileChange,
  handleServerFile,
  handleFileName,
  handleExtractFile,
  emptyPageSelection,
}) {
  const [selectedFile, setSelectedFile] = useState(null);

  // Clear previous rendered UI
  const cleanUp = () => {
    handleExtractFile(null);
    handlePdfFileChange(null);
    handleExtractFile(null);
    handleServerFile(null);
    emptyPageSelection();
  };

  // When input file is selected
  const handleFileChange = (event) => {
    // handleReset();
    cleanUp();
    const file = event.target.files[0];

    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      handleFileName(file.name);
    } else {
      setSelectedFile(null);
      alert("Please select a valid PDF file.");
    }
  };

  // On Form Submit
  const handleFormSubmit = (event) => {
    event.preventDefault();

    if (!selectedFile) {
      alert("Please select a PDF file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    axios
      .post("http://localhost:4500/file/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        responseType: "arraybuffer",
      })
      .then((response) => {
        const blob = new Blob([response.data], { type: "application/pdf" });
        const pdfUrl = URL.createObjectURL(blob);
        handleServerFile(pdfUrl);
        handlePdfFileChange(pdfUrl);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div className={styles.form_container}>
      <h2>Choose Your PDF File</h2>

      <form onSubmit={handleFormSubmit}>
        <div>
          <input
            type="file"
            accept=".pdf"
            name="file"
            onChange={handleFileChange}
          />
        </div>
        <button type="submit">Click To Upload File On Server</button>
      </form>

      <div>
        {selectedFile && (
          <div className="upload_file_info">
            <p>Selected file: {selectedFile.name}</p>
            <p>File size: {selectedFile.size} bytes</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default FileUploadForm;
