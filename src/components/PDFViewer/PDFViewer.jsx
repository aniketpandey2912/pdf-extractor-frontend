import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";

import styles from "./PDFViewer.module.css";

const PDFViewer = ({ pdfFile, handlePageSelection, selectedPages }) => {
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

  const handleCheckbox = (pageNumber, checked) => {
    handlePageSelection(pageNumber);
  };

  // Render rect-pdf pages
  const renderPages = () => {
    const pages = [];
    for (let i = 1; i <= numPages; i++) {
      pages.push(
        <div key={i} className={styles.page}>
          <div className={styles.checkbox_pageNo}>
            <p>Select:</p>
            <input
              type="checkbox"
              checked={selectedPages.includes(i)}
              onChange={(e) => handleCheckbox(i, e.target.checked)}
            />
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
      <h2>
        Select Pages To be Extacted And Then Click On
        <span style={{ color: "red" }}> Get Extracted PDF </span>Button Above
      </h2>
      <div className={styles.pdf_container}>
        <Document file={pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
          {renderPages()}
        </Document>
      </div>
    </>
  );
};

export default PDFViewer;
