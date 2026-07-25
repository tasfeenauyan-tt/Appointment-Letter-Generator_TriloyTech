import { toCanvas } from "html-to-image";
import jsPDF from "jspdf";
import { AppointmentLetterData } from "../types";

/**
 * Checks if a horizontal row of pixels on the canvas is completely blank white background.
 */
function isRowBlank(
  ctx: CanvasRenderingContext2D,
  y: number,
  width: number
): boolean {
  // Sample across the main content region (5% to 95% of container width)
  const startX = Math.floor(width * 0.05);
  const sampleWidth = Math.floor(width * 0.9);

  const imgData = ctx.getImageData(startX, y, sampleWidth, 1).data;

  // Step through pixels
  for (let i = 0; i < imgData.length; i += 16) {
    const r = imgData[i];
    const g = imgData[i + 1];
    const b = imgData[i + 2];
    const a = imgData[i + 3];

    // If pixel is non-white (text, dividers, graphics, dark pixels)
    if (a > 20 && (r < 242 || g < 242 || b < 242)) {
      return false;
    }
  }
  return true;
}

/**
 * Checks if an entire vertical region [yStart, yEnd) is blank whitespace.
 */
function isRegionBlank(
  ctx: CanvasRenderingContext2D,
  yStart: number,
  yEnd: number,
  width: number
): boolean {
  for (let y = yStart; y < yEnd; y += 3) {
    if (!isRowBlank(ctx, y, width)) {
      return false;
    }
  }
  return true;
}

/**
 * Finds the optimal page break Y position (in canvas pixels) near targetPageHeightPx
 * by searching backwards for a blank whitespace gap between lines/paragraphs.
 */
function findNextPageBreak(
  ctx: CanvasRenderingContext2D,
  yStart: number,
  targetPageHeightPx: number,
  canvasWidth: number,
  totalCanvasHeight: number
): number {
  const targetY = yStart + targetPageHeightPx;

  // If remaining content fits on the current page, return total height
  if (targetY >= totalCanvasHeight) {
    return totalCanvasHeight;
  }

  // Search backwards up to 35% of page height to find whitespace between paragraphs/lines
  const minY = Math.max(yStart + Math.floor(targetPageHeightPx * 0.65), yStart + 50);

  let gapStart: number | null = null;
  let gapEnd: number | null = null;
  let bestGapMiddle: number | null = null;

  for (let y = targetY; y >= minY; y--) {
    if (isRowBlank(ctx, y, canvasWidth)) {
      if (gapEnd === null) {
        gapEnd = y;
      }
      gapStart = y;
    } else {
      if (gapStart !== null && gapEnd !== null) {
        const gapHeight = gapEnd - gapStart;
        if (gapHeight >= 2) {
          bestGapMiddle = Math.floor((gapStart + gapEnd) / 2);
          break; // Found clean gap closest to targetY!
        }
        gapStart = null;
        gapEnd = null;
      }
    }
  }

  if (bestGapMiddle === null && gapStart !== null && gapEnd !== null) {
    bestGapMiddle = Math.floor((gapStart + gapEnd) / 2);
  }

  return bestGapMiddle !== null ? bestGapMiddle : targetY;
}

export async function exportLetterToPDF(
  elementIds: string | string[],
  data: AppointmentLetterData,
  filenameSuffix: string = ""
): Promise<void> {
  const ids = Array.isArray(elementIds) ? elementIds : [elementIds];

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true
  });

  let pagesAdded = 0;

  for (const elementId of ids) {
    const element = document.getElementById(elementId);
    if (!element) {
      console.warn(`Element #${elementId} not found for PDF export`);
      continue;
    }

    const originalShadow = element.style.boxShadow;
    const originalBorder = element.style.border;
    element.style.boxShadow = "none";
    element.style.border = "none";

    try {
      const mainCanvas = await toCanvas(element, {
        quality: 0.95,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
        cacheBust: true,
      });

      element.style.boxShadow = originalShadow;
      element.style.border = originalBorder;

      const ctx = mainCanvas.getContext("2d");
      if (!ctx) {
        throw new Error("Could not get 2d context from canvas");
      }

      const canvasWidth = mainCanvas.width;
      const totalCanvasHeight = mainCanvas.height;
      const targetPageHeightPx = Math.floor(canvasWidth * (297 / 210));

      let yStart = 0;

      while (yStart < totalCanvasHeight) {
        // Skip trailing whitespace or small residual margins at the end of an element
        if (
          totalCanvasHeight - yStart <= 30 ||
          isRegionBlank(ctx, yStart, totalCanvasHeight, canvasWidth)
        ) {
          break;
        }

        const yEnd = findNextPageBreak(
          ctx,
          yStart,
          targetPageHeightPx,
          canvasWidth,
          totalCanvasHeight
        );

        const sliceHeight = yEnd - yStart;
        if (sliceHeight <= 10) {
          yStart = yEnd;
          continue;
        }

        // Check if slice itself is completely blank
        if (isRegionBlank(ctx, yStart, yEnd, canvasWidth)) {
          yStart = yEnd;
          continue;
        }

        // Create page canvas with exact A4 aspect ratio
        const pageCanvas = document.createElement("canvas");
        pageCanvas.width = canvasWidth;
        pageCanvas.height = targetPageHeightPx;
        const pageCtx = pageCanvas.getContext("2d");

        if (pageCtx) {
          pageCtx.fillStyle = "#ffffff";
          pageCtx.fillRect(0, 0, canvasWidth, targetPageHeightPx);
          pageCtx.drawImage(
            mainCanvas,
            0,
            yStart,
            canvasWidth,
            sliceHeight,
            0,
            0,
            canvasWidth,
            sliceHeight
          );

          const pageImgData = pageCanvas.toDataURL("image/jpeg", 0.90);

          if (pagesAdded > 0) {
            pdf.addPage();
          }

          pdf.addImage(pageImgData, "JPEG", 0, 0, 210, 297, undefined, "FAST");
          pagesAdded++;
        }

        yStart = yEnd;
      }
    } catch (error) {
      element.style.boxShadow = originalShadow;
      element.style.border = originalBorder;
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


