import axios from "axios";

/**
 *
 * @param {string} filename - original file name
 * @param {Array} selectedPages - array of selected pages
 * @param {Function} handleExtractFile - function to handle the extracted file
 * @returns
 */
const getExtractedFile = (filename, selectedPages, handleExtractFile) => {
  // Check if filename or selected pages missing
  if (!filename || selectedPages?.length <= 0) {
    alert("Please provide valid filename and select aleast 1 page");
    return;
  }
  axios
    .post(
      "http://localhost:4500/file/extract",
      {
        filename, // Use the uploaded file name
        selectedPages: selectedPages.map((el) => el - 1), // 0 based indexing
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

export default getExtractedFile;
