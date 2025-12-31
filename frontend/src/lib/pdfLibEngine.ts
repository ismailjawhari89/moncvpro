import { PDFDocument, rgb, StandardFonts, PDFFont, PDFPage } from 'pdf-lib';
import { saveAs } from 'file-saver';
import type { CVData } from '@/types/cv';

interface PDFGeneratorOptions {
  filename?: string;
}

// ==========================================
// 📐 A4 Engine - Professional Layout System
// ==========================================
const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN = 40;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

// Column system for Modern template
const SIDEBAR_WIDTH = 170;
// const SIDEBAR_X = MARGIN; // Reserved for future use
const MAIN_X = MARGIN + SIDEBAR_WIDTH + 20;
const MAIN_WIDTH = CONTENT_WIDTH - SIDEBAR_WIDTH - 20;

// ==========================================
// 🔧 Helper Functions
// ==========================================

/**
 * Detect if text contains Arabic characters
 */
function isArabic(text: string): boolean {
  if (!text) return false;
  const arabicPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  return arabicPattern.test(text);
}

/**
 * Draw RTL text - properly aligned from right
 * This is the ONLY way to handle Arabic correctly in pdf-lib
 */
function drawRTLText(
  page: PDFPage,
  text: string,
  xRight: number,
  y: number,
  options: {
    font: PDFFont;
    size: number;
    color?: ReturnType<typeof rgb>;
  }
): void {
  const textWidth = options.font.widthOfTextAtSize(text, options.size);
  page.drawText(text, {
    x: xRight - textWidth,
    y,
    font: options.font,
    size: options.size,
    color: options.color || rgb(0.1, 0.1, 0.1),
  });
}

/**
 * Draw text (auto-detect RTL)
 */
function drawText(
  page: PDFPage,
  text: string,
  x: number,
  y: number,
  options: {
    font: PDFFont;
    size: number;
    color?: ReturnType<typeof rgb>;
    align?: 'left' | 'right';
  }
): void {
  const isRTL = isArabic(text) || options.align === 'right';
  
  if (isRTL) {
    drawRTLText(page, text, x, y, options);
  } else {
    page.drawText(text, {
      x,
      y,
      font: options.font,
      size: options.size,
      color: options.color || rgb(0.1, 0.1, 0.1),
    });
  }
}

/**
 * Draw paragraph with word wrapping
 */
function drawParagraph(
  page: PDFPage,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  options: {
    font: PDFFont;
    size: number;
    color?: ReturnType<typeof rgb>;
    lineHeight?: number;
  }
): number {
  const { font, size, color = rgb(0.2, 0.2, 0.2), lineHeight = size + 5 } = options;
  const isRTL = isArabic(text);
  
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  
  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const testWidth = font.widthOfTextAtSize(testLine, size);
    
    if (testWidth > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  
  if (currentLine) {
    lines.push(currentLine);
  }
  
  let currentY = y;
  for (const line of lines) {
    if (isRTL) {
      drawRTLText(page, line, x, currentY, { font, size, color });
    } else {
      page.drawText(line, { x, y: currentY, font, size, color });
    }
    currentY -= lineHeight;
  }
  
  return currentY; // Return final Y position
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
    const blob = new Blob([pdfBytes.buffer], { type: 'application/pdf' });
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
 * ✅ Advanced PDF Generator - Professional Layout with RTL Support
 * Features:
 * - Real A4 measurements
 * - Proper RTL alignment
 * - Professional header
 * - Two-column layout (Sidebar + Main)
 * - Arabic font support
 */
export async function generateAdvancedPDF(
  cvData: CVData,
  options: PDFGeneratorOptions = {}
): Promise<void> {
  const { filename = 'cv.pdf' } = options;

  try {
    // Create PDF document
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    
    // Load custom Arabic fonts
    const regularFontBytes = await fetch('/fonts/NotoSansArabic-Regular.ttf').then(r => r.arrayBuffer());
    const boldFontBytes = await fetch('/fonts/NotoSansArabic-Bold.ttf').then(r => r.arrayBuffer());
    
    const regularFont = await pdfDoc.embedFont(regularFontBytes);
    const boldFont = await pdfDoc.embedFont(boldFontBytes);
    
    // Start from top
    let y = PAGE_HEIGHT - MARGIN;
    
    // ==========================================
    // 📌 HEADER - Professional Identity
    // ==========================================
    const fullName = cvData.personalInfo?.fullName || 'Your Name';
    const title = cvData.personalInfo?.profession || cvData.experiences?.[0]?.position || 'Professional';
    
    // Name (Large, Bold, RTL-aware)
    drawText(page, fullName, PAGE_WIDTH - MARGIN, y, {
      font: boldFont,
      size: 22,
      align: 'right',
    });
    y -= 28;
    
    // Title/Position
    drawText(page, title, PAGE_WIDTH - MARGIN, y, {
      font: regularFont,
      size: 12,
      color: rgb(0.3, 0.3, 0.3),
      align: 'right',
    });
    y -= 20;
    
    // Separator line
    page.drawLine({
      start: { x: MARGIN, y },
      end: { x: PAGE_WIDTH - MARGIN, y },
      thickness: 1.5,
      color: rgb(0.2, 0.2, 0.2),
    });
    y -= 30;
    
    // ==========================================
    // 📌 CONTACT INFO (Horizontal)
    // ==========================================
    const contactY = y;
    const contactParts: string[] = [];
    
    if (cvData.personalInfo?.email) contactParts.push(cvData.personalInfo.email);
    if (cvData.personalInfo?.phone) contactParts.push(cvData.personalInfo.phone);
    if (cvData.personalInfo?.address) contactParts.push(cvData.personalInfo.address);
    
    const contactText = contactParts.join(' • ');
    drawText(page, contactText, PAGE_WIDTH - MARGIN, contactY, {
      font: regularFont,
      size: 9,
      color: rgb(0.4, 0.4, 0.4),
      align: 'right',
    });
    y -= 35;
    
    // ==========================================
    // 📌 TWO-COLUMN LAYOUT START
    // ==========================================
    const contentStartY = y;
    let sidebarY = contentStartY;
    let mainY = contentStartY;
    
    // ==========================================
    // 📍 SIDEBAR (Right side in RTL context)
    // ==========================================
    
    // --- Skills Section ---
    if (cvData.skills && cvData.skills.length > 0) {
      drawText(page, 'المهارات', PAGE_WIDTH - MARGIN, sidebarY, {
        font: boldFont,
        size: 12,
        align: 'right',
      });
      sidebarY -= 20;
      
      cvData.skills.slice(0, 8).forEach(skill => {
        drawText(page, skill.name, PAGE_WIDTH - MARGIN, sidebarY, {
          font: regularFont,
          size: 9,
          color: rgb(0.2, 0.2, 0.2),
          align: 'right',
        });
        sidebarY -= 16;
      });
      
      sidebarY -= 10;
    }
    
    // --- Languages Section ---
    if (cvData.languages && cvData.languages.length > 0) {
      drawText(page, 'اللغات', PAGE_WIDTH - MARGIN, sidebarY, {
        font: boldFont,
        size: 12,
        align: 'right',
      });
      sidebarY -= 20;
      
      cvData.languages.forEach(lang => {
        const langText = `${lang.name} - ${lang.proficiency}`;
        drawText(page, langText, PAGE_WIDTH - MARGIN, sidebarY, {
          font: regularFont,
          size: 9,
          color: rgb(0.2, 0.2, 0.2),
          align: 'right',
        });
        sidebarY -= 16;
      });
      
      sidebarY -= 10;
    }
    
    // ==========================================
    // 📍 MAIN CONTENT (Left side in RTL context)
    // ==========================================
    
    // --- Professional Summary ---
    if (cvData.summary) {
      drawText(page, 'نبذة مهنية', MAIN_X + MAIN_WIDTH, mainY, {
        font: boldFont,
        size: 14,
        align: 'right',
      });
      mainY -= 22;
      
      mainY = drawParagraph(page, cvData.summary, MAIN_X + MAIN_WIDTH, mainY, MAIN_WIDTH, {
        font: regularFont,
        size: 10,
        lineHeight: 16,
      });
      mainY -= 20;
    }
    
    // --- Experience Section ---
    if (cvData.experiences && cvData.experiences.length > 0) {
      drawText(page, 'الخبرات المهنية', MAIN_X + MAIN_WIDTH, mainY, {
        font: boldFont,
        size: 14,
        align: 'right',
      });
      mainY -= 22;
      
      cvData.experiences.slice(0, 3).forEach((exp) => {
        // Position & Company
        const positionText = `${exp.position} - ${exp.company}`;
        drawText(page, positionText, MAIN_X + MAIN_WIDTH, mainY, {
          font: boldFont,
          size: 11,
          align: 'right',
        });
        mainY -= 18;
        
        // Date
        const dateText = `${exp.startDate} - ${exp.current ? 'حاليًا' : exp.endDate || ''}`;
        drawText(page, dateText, MAIN_X + MAIN_WIDTH, mainY, {
          font: regularFont,
          size: 9,
          color: rgb(0.4, 0.4, 0.4),
          align: 'right',
        });
        mainY -= 16;
        
        // Achievements (first 2)
        if (exp.achievements && exp.achievements.length > 0) {
          exp.achievements.slice(0, 2).forEach(achievement => {
            if (achievement) {
              mainY = drawParagraph(page, `• ${achievement}`, MAIN_X + MAIN_WIDTH, mainY, MAIN_WIDTH - 20, {
                font: regularFont,
                size: 9,
                lineHeight: 14,
              });
              mainY -= 4;
            }
          });
        }
        
        mainY -= 12;
      });
    }
    
    // --- Education Section ---
    if (cvData.education && cvData.education.length > 0) {
      drawText(page, 'التعليم', MAIN_X + MAIN_WIDTH, mainY, {
        font: boldFont,
        size: 14,
        align: 'right',
      });
      mainY -= 22;
      
      cvData.education.slice(0, 2).forEach(edu => {
        // Degree
        drawText(page, edu.degree, MAIN_X + MAIN_WIDTH, mainY, {
          font: boldFont,
          size: 11,
          align: 'right',
        });
        mainY -= 18;
        
        // Institution
        const institutionText = edu.field ? `${edu.institution} - ${edu.field}` : edu.institution;
        drawText(page, institutionText, MAIN_X + MAIN_WIDTH, mainY, {
          font: regularFont,
          size: 10,
          align: 'right',
        });
        mainY -= 16;
        
        // Date
        const eduDate = `${edu.startDate} - ${edu.current ? 'حاليًا' : edu.endDate || ''}`;
        drawText(page, eduDate, MAIN_X + MAIN_WIDTH, mainY, {
          font: regularFont,
          size: 9,
          color: rgb(0.4, 0.4, 0.4),
          align: 'right',
        });
        mainY -= 20;
      });
    }
    
    // Serialize and download
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes.buffer], { type: 'application/pdf' });
    saveAs(blob, filename);
    
    console.log('✅ Professional PDF generated successfully');
  } catch (error) {
    console.error('❌ PDF generation failed:', error);
    throw error;
  }
}

const pdfLibEngine = {
  generateSimplePDF,
  generateAdvancedPDF,
};

export default pdfLibEngine;
