import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { saveAs } from 'file-saver';
import type { CVData } from '@/types/cv';

interface PDFGeneratorOptions {
  filename?: string;
}

/**
 * Simple PDF test generator using pdf-lib
 * Creates a basic A4 PDF with user information
 */
export async function generateSimplePDF(
  cvData: CVData,
  options: PDFGeneratorOptions = {}
): Promise<void> {
  const { filename = 'cv.pdf' } = options;

  try {
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    
    // Add a page (A4 size: 595 x 842 points)
    const page = pdfDoc.addPage([595, 842]);
    
    // Load fonts
    const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    // Get page dimensions
    const { width, height } = page.getSize();
    
    // Set initial Y position (from top)
    let yPosition = height - 50;
    
    // Draw name (bold, large)
    const name = cvData.personalInfo?.fullName || 'Your Name';
    page.drawText(name, {
      x: 50,
      y: yPosition,
      size: 24,
      font: boldFont,
      color: rgb(0.1, 0.1, 0.1),
    });
    
    yPosition -= 40;
    
    // Draw email
    const email = cvData.personalInfo?.email || 'email@example.com';
    page.drawText(`Email: ${email}`, {
      x: 50,
      y: yPosition,
      size: 12,
      font: regularFont,
      color: rgb(0.3, 0.3, 0.3),
    });
    
    yPosition -= 25;
    
    // Draw phone
    const phone = cvData.personalInfo?.phone || '';
    if (phone) {
      page.drawText(`Phone: ${phone}`, {
        x: 50,
        y: yPosition,
        size: 12,
        font: regularFont,
        color: rgb(0.3, 0.3, 0.3),
      });
      yPosition -= 25;
    }
    
    // Draw location
    const location = cvData.personalInfo?.address || '';
    if (location) {
      page.drawText(`Location: ${location}`, {
        x: 50,
        y: yPosition,
        size: 12,
        font: regularFont,
        color: rgb(0.3, 0.3, 0.3),
      });
      yPosition -= 40;
    }
    
    // Draw a line
    page.drawLine({
      start: { x: 50, y: yPosition },
      end: { x: width - 50, y: yPosition },
      thickness: 1,
      color: rgb(0.8, 0.8, 0.8),
    });
    
    yPosition -= 30;
    
    // Draw summary if exists
    if (cvData.summary) {
      page.drawText('Professional Summary', {
        x: 50,
        y: yPosition,
        size: 16,
        font: boldFont,
        color: rgb(0.1, 0.1, 0.1),
      });
      
      yPosition -= 25;
      
      // Split summary into lines (basic word wrap)
      const summaryLines = wrapText(cvData.summary, 85);
      for (const line of summaryLines) {
        page.drawText(line, {
          x: 50,
          y: yPosition,
          size: 11,
          font: regularFont,
          color: rgb(0.2, 0.2, 0.2),
        });
        yPosition -= 18;
      }
    }
    
    // Serialize the PDFDocument to bytes
    const pdfBytes = await pdfDoc.save();
    
    // Create blob and download
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    saveAs(blob, filename);
    
    console.log('✅ PDF generated successfully with pdf-lib');
  } catch (error) {
    console.error('❌ PDF generation failed:', error);
    throw error;
  }
}

/**
 * Simple word wrap utility
 */
function wrapText(text: string, maxCharsPerLine: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  
  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    
    if (testLine.length <= maxCharsPerLine) {
      currentLine = testLine;
    } else {
      if (currentLine) {
        lines.push(currentLine);
      }
      currentLine = word;
    }
  }
  
  if (currentLine) {
    lines.push(currentLine);
  }
  
  return lines;
}

/**
 * Advanced PDF generator with Arabic support (to be implemented)
 */
export async function generateAdvancedPDF(
  cvData: CVData,
  options: PDFGeneratorOptions = {}
): Promise<void> {
  const { filename = 'cv.pdf' } = options;

  try {
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    
    // Add a page (A4 size)
    const page = pdfDoc.addPage([595, 842]);
    
    // Load custom Arabic fonts
    const regularFontBytes = await fetch('/fonts/NotoSansArabic-Regular.ttf').then(r => r.arrayBuffer());
    const boldFontBytes = await fetch('/fonts/NotoSansArabic-Bold.ttf').then(r => r.arrayBuffer());
    
    await pdfDoc.embedFont(regularFontBytes); // regularFont - reserved for future use
    const boldFont = await pdfDoc.embedFont(boldFontBytes);
    
    // TODO: Implement full CV layout with Arabic support
    // This will be expanded in the next phase
    
    const { height } = page.getSize();
    const yPosition = height - 50;
    
    // Draw name
    const name = cvData.personalInfo?.fullName || 'Your Name';
    page.drawText(name, {
      x: 50,
      y: yPosition,
      size: 24,
      font: boldFont,
      color: rgb(0.1, 0.1, 0.1),
    });
    
    // Serialize and download
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    saveAs(blob, filename);
    
    console.log('✅ Advanced PDF generated successfully');
  } catch (error) {
    console.error('❌ Advanced PDF generation failed:', error);
    throw error;
  }
}

const pdfLibEngine = {
  generateSimplePDF,
  generateAdvancedPDF,
};

export default pdfLibEngine;
