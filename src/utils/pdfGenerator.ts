import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import { AppointmentLetterData } from "../types";

export async function exportLetterToPDF(
  elementIds: string | string[],
  data: AppointmentLetterData,
  filenameSuffix: string = ""
): Promise<void> {
  const ids = Array.isArray(elementIds) ? elementIds : [elementIds];

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  const pageHeight = 297; // A4 height in mm
  const imgWidth = 210; // A4 width in mm
  let pagesAdded = 0;

  for (const elementId of ids) {
    const element = document.getElementById(elementId);
    if (!element) {
      console.warn(`Element #${elementId} not found for PDF export`);
      continue;
    }

    const originalShadow = element.style.boxShadow;
    element.style.boxShadow = "none";

    try {
      const imgData = await toPng(element, {
        quality: 0.98,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
        cacheBust: true,
      });

      element.style.boxShadow = originalShadow;

      const img = new Image();
      img.src = imgData;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = (err) => reject(err);
      });

      const imgHeight = (img.height * imgWidth) / img.width;

      if (pagesAdded > 0) {
        pdf.addPage();
      }

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      pagesAdded++;

      while (heightLeft > 5) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
    } catch (error) {
      element.style.boxShadow = originalShadow;
      console.error(`PDF Export error on #${elementId}:`, error);
      throw error;
    }
  }

  const nameForFile = (data.employeeFullName || "Employee").replace(/\s+/g, "_");
  const suffixPart = filenameSuffix ? `_${filenameSuffix}` : "";
  const cleanFilename = `Appointment_Letter_${nameForFile}${suffixPart}_TriloyTech.pdf`;
  pdf.save(cleanFilename);
}

export function triggerPrintLetter(): void {
  window.print();
}

