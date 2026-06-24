import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

/**
 * Downloads the styled live CV preview element as a high-fidelity, print-ready A4 PDF.
 * @param elementId The DOM element id to capture (typically 'cv-preview-paper')
 * @param fileName The desired output file name (e.g. 'CV_JuanPerez.pdf')
 */
export async function downloadCVAsPDF(elementId: string, fileName: string): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error("CV Preview element not found. Please make sure the preview tab is loaded.");
  }

  // Temporary slight scale adjustments or overrides if needed can be done,
  // but html2canvas with a scale of 2 generally produces gorgeous results.
  const canvas = await html2canvas(element, {
    scale: 2, // Increase resolution for print quality
    useCORS: true, // Allow external image sources like base64
    allowTaint: true,
    backgroundColor: "#ffffff",
    logging: false,
  });

  const imgData = canvas.toDataURL("image/jpeg", 0.98);

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
  pdf.save(fileName);
}
