import React, { useState } from "react";
import FileUploadForm from "./components/FileUploadForm/FileUploadForm";
import PDFViewer from "./components/PDFViewer/PDFViewer";
import createNewPDF from "./components/utils/createNewPDF";

import "./App.css";

function App() {
  const [selectedPdfFile, setSelectedPdfFile] = useState(null);
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

  return (
    <div className="App">
      <FileUploadForm onPdfFileChange={handlePdfFileChange} />
      <div className="generate_pdf_btn_container">
        <button onClick={handleGeneratePdf}>Generate New PDF</button>
      </div>
      {downloadLink && (
        <p>
          <a href={downloadLink} download="newPdf.pdf">
            Download New PDF
          </a>
        </p>
      )}
      {selectedPdfFile && (
        <PDFViewer
          pdfFile={selectedPdfFile}
          onPageSelect={handlePageSelection}
          selectedPages={selectedPages}
        />
      )}
    </div>
  );
}

export default App;
