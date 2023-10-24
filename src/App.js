import React, { useState } from "react";
import FileUploadForm from "./components/FileUploadForm/FileUploadForm";
import PDFViewer from "./components/PDFViewer/PDFViewer";
import createNewPDF from "./components/utils/createNewPDF";

import "./App.css";
import ExtractedPDFViewer from "./components/ExtractedPDFViewer/ExtractedPDFViewer";
import axios from "axios";

function App() {
  const [selectedPdfFile, setSelectedPdfFile] = useState(null);
  const [selectedServerFile, setSelecServertedFile] = useState(null);
  const [extractedFile, setExtractedFile] = useState(null);
  const [selectedPages, setSelectedPages] = useState([]);
  const [downloadLink, setDownloadLink] = useState(null);

  // Setting up pdf file when uploaded
  const handlePdfFileChange = (file) => {
    setSelectedPdfFile(file);
  };

  //Pages selection
  const handlePageSelection = (page) => {
    const updatedPages = selectedPages.includes(page)
      ? selectedPages.filter((selectedPage) => selectedPage !== page)
      : [...selectedPages, page];
    setSelectedPages(updatedPages);
  };

  // Generating new PDF
  const handleGeneratePdf = async () => {
    try {
      if (selectedPdfFile && selectedPages.length > 0) {
        await createNewPDF(selectedPdfFile, selectedPages, (downloadUrl) => {
          setDownloadLink(downloadUrl);
        });
      } else {
        alert(
          "Please select a PDF file and at least one page to generate a new PDF."
        );
      }
    } catch (err) {
      throw new Error(err);
    }
  };

  // Handle Server File
  const handleServerFile = (file) => {
    setSelecServertedFile(file);
  };

  // Handle Extract File
  const handleExtractFile = (file) => {
    setExtractedFile(file);
  };

  // Get Extracted File
  const getExtractedFile = (filename, selectedPages) => {
    // Check if filename or selected pages missing
    if (!filename || selectedPages?.length <= 0) {
      alert("Please provide valid filename and select alt 1 page");
      return;
    }
    axios
      .post(
        "http://localhost:4500/file/extract",
        {
          filename, // Use the uploaded file name
          selectedPages,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          responseType: "arraybuffer",
        }
      )
      .then((response) => {
        const blob = new Blob([response.data], { type: "application/pdf" });
        const pdfUrl = URL.createObjectURL(blob);
        handleExtractFile(pdfUrl);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  console.log("Selected Pages:", selectedPages);
  const fileName =
    "83463ea0-7290-11ee-9ab6-df446a9e71fc-Aniket-Pandey-Resume.pdf";

  return (
    <div className="App">
      <FileUploadForm
        onPdfFileChange={handlePdfFileChange}
        handleExtractFile={handleExtractFile}
        handleServerFile={handleServerFile}
      />

      {selectedServerFile && (
        <button onClick={() => getExtractedFile(fileName, selectedPages)}>
          Get Extracted PDF
        </button>
      )}
      {downloadLink && (
        <div>
          <p>Click on link below to download you extracted PDF File</p>
          <p>
            <a href={downloadLink} download="newPdf.pdf">
              Download New PDF
            </a>
          </p>
        </div>
      )}

      {extractedFile && <ExtractedPDFViewer extractedPdfFile={extractedFile} />}

      {selectedPdfFile && (
        <>
          <div className="generate_pdf_btn_container">
            <button onClick={handleGeneratePdf}>Generate New PDF</button>
          </div>
          <PDFViewer
            pdfFile={selectedPdfFile}
            onPageSelect={handlePageSelection}
            selectedPages={selectedPages}
          />
        </>
      )}
    </div>
  );
}

export default App;
