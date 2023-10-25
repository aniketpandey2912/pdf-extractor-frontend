import "./App.css";
import React, { useState } from "react";
import FileUploadForm from "./components/FileUploadForm/FileUploadForm";
import PDFViewer from "./components/PDFViewer/PDFViewer";
import ExtractedPDFViewer from "./components/ExtractedPDFViewer/ExtractedPDFViewer";
import getExtractedFile from "./components/utils/getExtractedFile";

function App() {
  const [selectedPdfFile, setSelectedPdfFile] = useState(null);
  const [selectedServerFile, setSelecServertedFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [extractedFile, setExtractedFile] = useState(null);
  const [selectedPages, setSelectedPages] = useState([]);
  const [downloadLink, setDownloadLink] = useState(null);

  // Handle setting up pdf file when uploaded
  const handlePdfFileChange = (file) => {
    setSelectedPdfFile(file);
  };

  //Handle page selection
  const handlePageSelection = (page) => {
    const updatedPages = selectedPages.includes(page)
      ? selectedPages.filter((selectedPage) => selectedPage !== page)
      : [...selectedPages, page];
    setSelectedPages(updatedPages);
  };

  // Emptying pages selection
  const emptyPageSelection = () => {
    setSelectedPages([]);
  };

  // Handle uploaded file from server
  const handleServerFile = (file) => {
    setSelecServertedFile(file);
  };

  // Handle extract file
  const handleExtractFile = (file) => {
    setExtractedFile(file);
    setDownloadLink(file);
  };

  // Handle fileName
  const handleFileName = (name) => {
    setFileName(name);
  };

  return (
    <div className="App">
      <FileUploadForm
        handlePdfFileChange={handlePdfFileChange}
        handleServerFile={handleServerFile}
        handleFileName={handleFileName}
        handleExtractFile={handleExtractFile}
        emptyPageSelection={emptyPageSelection}
      />

      {selectedServerFile && (
        <button
          onClick={() =>
            getExtractedFile(fileName, selectedPages, handleExtractFile)
          }
        >
          Get Extracted PDF
        </button>
      )}
      {downloadLink && (
        <div className="download_link_div">
          <h3>Click on link below to download you extracted PDF File</h3>
          <p>
            <a href={downloadLink} download="new-extracted.pdf">
              Download Extracted PDF
            </a>
          </p>
        </div>
      )}

      {extractedFile && <ExtractedPDFViewer extractedPdfFile={extractedFile} />}

      {!extractedFile && selectedPdfFile && (
        <PDFViewer
          pdfFile={selectedPdfFile}
          handlePageSelection={handlePageSelection}
          selectedPages={selectedPages}
        />
      )}
    </div>
  );
}

export default App;
