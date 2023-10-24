import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";

import styles from "./ExtractedPDFViewer.module.css";

const ExtractedPDFViewer = ({ extractedPdfFile }) => {
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
  const [numPages, setNumPages] = useState(null);
  const [width, setWidth] = useState(
    window.innerWidth > 768 ? 500 : window.innerWidth - 50
  );

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth > 768 ? 500 : window.innerWidth - 50);
    }

    window.addEventListener("resize", handleResize);
    handleResize(); // Set the initial width

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const renderPages = () => {
    const pages = [];
    for (let i = 1; i <= numPages; i++) {
      pages.push(
        <div key={i} className={styles.page}>
          <div className={styles.checkbox_pageNo}>
            <h4>
              Page {i} of {numPages}
            </h4>
          </div>
          <div className="pdf_page">
            <Page key={i} pageNumber={i} width={width} />
          </div>
        </div>
      );
    }
    return pages;
  };

  return (
    <>
      <h2>Extracted PDF From Backend</h2>
      <div className={styles.pdf_container}>
        <Document file={extractedPdfFile} onLoadSuccess={onDocumentLoadSuccess}>
          {renderPages()}
        </Document>
      </div>
    </>
  );
};

export default ExtractedPDFViewer;
