import React, { useState } from "react";
import axios from "axios";
import styles from "./FileUploadForm.module.css";

function FileUploadForm({
  onPdfFileChange,
  handleExtractFile,
  handleServerFile,
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  // const [selectedServerFile, setSelecServertedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
      alert("Please select a valid PDF file.");
    }
  };

  // const getExtractedFile = (filename, selectedPages) => {
  //   // Check if filename or selected pages missing
  //   if (!filename || !selectedPages?.length) {
  //     alert("Please provide valid filename and selected array of pages");
  //   }
  //   axios
  //     .post(
  //       "http://localhost:4500/file/extract",
  //       {
  //         filename, // Use the uploaded file name
  //         selectedPages,
  //       },
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         responseType: "arraybuffer",
  //       }
  //     )
  //     .then((response) => {
  //       const blob = new Blob([response.data], { type: "application/pdf" });
  //       const pdfUrl = URL.createObjectURL(blob);
  //       handleExtractFile(pdfUrl);
  //     })
  //     .catch((error) => {
  //       console.error("Error:", error);
  //     });
  // };

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
        // setSelecServertedFile(pdfUrl);
        handleServerFile(pdfUrl);
        onPdfFileChange(pdfUrl);
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

      {/* <div>
        {selectedServerFile && (
          <button
            onClick={() =>
              getExtractedFile(
                "83463ea0-7290-11ee-9ab6-df446a9e71fc-Aniket-Pandey-Resume.pdf",
                [0]
              )
            }
          >
            Get Extracted PDF
          </button>
        )}
      </div> */}
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
