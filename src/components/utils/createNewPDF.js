import { PDFDocument } from "pdf-lib";

/**
 *
 * @param {File} selectedPdfFile - original pdf file
 * @param {Array} selectedPages - array of selected pages
 * @param {Function} handleDownload - to set the download url
 */
const createNewPDF = async (selectedPdfFile, selectedPages, handleDownload) => {
  try {
    // Load the selected PDF file
    const existingPdfBytes = await selectedPdfFile.arrayBuffer();
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    // Create a new PDF document
    const newPdfDoc = await PDFDocument.create();

    // Copy selected pages from the original PDF to the new PDF
    for (const pageNumber of selectedPages) {
      const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [pageNumber - 1]);
      newPdfDoc.addPage(copiedPage);
    }

    // Save the new PDF as a Blob
    const pdfBytes = await newPdfDoc.save();

    // Generate a download link
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    // Provide the download link
    handleDownload(url);
  } catch (error) {
    console.error("Error creating new PDF:", error);
  }
};

export default createNewPDF;
