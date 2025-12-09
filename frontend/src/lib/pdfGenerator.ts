import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface PDFOptions {
    filename?: string;
    format?: 'a4' | 'letter';
    orientation?: 'portrait' | 'landscape';
    scale?: number;
    margin?: number;
    quality?: number;
}

/**
 * High-performance PDF generator using HTML2Canvas + jsPDF
 * Captures the CV preview element and converts to PDF
 */
export async function generatePDF(
    elementId: string,
    options: PDFOptions = {}
): Promise<void> {
    const {
        filename = 'cv.pdf',
        format = 'a4',
        orientation = 'portrait',
        scale = 2,
        margin = 10,
        quality = 1
    } = options;

    const element = document.getElementById(elementId);
    if (!element) {
        throw new Error(`Element with id "${elementId}" not found`);
    }

    // Store original styles
    const originalOverflow = element.style.overflow;
    const originalHeight = element.style.maxHeight;

    // Temporarily remove scroll constraints for full capture
    element.style.overflow = 'visible';
    element.style.maxHeight = 'none';

    try {
        // Capture with high quality
        const canvas = await html2canvas(element, {
            scale,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff',
            windowWidth: element.scrollWidth,
            windowHeight: element.scrollHeight
        });

        // Calculate dimensions
        const imgData = canvas.toDataURL('image/jpeg', quality);

        const pdf = new jsPDF({
            orientation,
            unit: 'mm',
            format
        });

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        const contentWidth = pageWidth - (margin * 2);
        const contentHeight = (canvas.height * contentWidth) / canvas.width;

        // Handle multi-page if content is longer than one page
        if (contentHeight <= pageHeight - (margin * 2)) {
            // Single page
            pdf.addImage(imgData, 'JPEG', margin, margin, contentWidth, contentHeight);
        } else {
            // Multi-page
            let remainingHeight = contentHeight;
            let position = 0;
            let pageNum = 0;

            while (remainingHeight > 0) {
                if (pageNum > 0) {
                    pdf.addPage();
                }

                const sliceHeight = Math.min(remainingHeight, pageHeight - (margin * 2));

                pdf.addImage(
                    imgData,
                    'JPEG',
                    margin,
                    margin - (position * (pageHeight - margin * 2) / contentHeight * contentHeight),
                    contentWidth,
                    contentHeight
                );

                remainingHeight -= (pageHeight - margin * 2);
                position++;
                pageNum++;
            }
        }

        // Save the PDF
        pdf.save(filename);
    } finally {
        // Restore original styles
        element.style.overflow = originalOverflow;
        element.style.maxHeight = originalHeight;
    }
}

/**
 * Generate PDF with progress callback
 */
export async function generatePDFWithProgress(
    elementId: string,
    onProgress: (progress: number) => void,
    options: PDFOptions = {}
): Promise<void> {
    onProgress(0);

    const element = document.getElementById(elementId);
    if (!element) {
        throw new Error(`Element with id "${elementId}" not found`);
    }

    onProgress(20);

    const canvas = await html2canvas(element, {
        scale: options.scale || 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
    });

    onProgress(60);

    const imgData = canvas.toDataURL('image/jpeg', options.quality || 1);

    const pdf = new jsPDF({
        orientation: options.orientation || 'portrait',
        unit: 'mm',
        format: options.format || 'a4'
    });

    onProgress(80);

    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = options.margin || 10;
    const contentWidth = pageWidth - (margin * 2);
    const contentHeight = (canvas.height * contentWidth) / canvas.width;

    pdf.addImage(imgData, 'JPEG', margin, margin, contentWidth, contentHeight);

    onProgress(95);

    pdf.save(options.filename || 'cv.pdf');

    onProgress(100);
}

/**
 * Generate PDF blob (for upload or preview)
 */
export async function generatePDFBlob(
    elementId: string,
    options: PDFOptions = {}
): Promise<Blob> {
    const element = document.getElementById(elementId);
    if (!element) {
        throw new Error(`Element with id "${elementId}" not found`);
    }

    const canvas = await html2canvas(element, {
        scale: options.scale || 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/jpeg', options.quality || 1);

    const pdf = new jsPDF({
        orientation: options.orientation || 'portrait',
        unit: 'mm',
        format: options.format || 'a4'
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = options.margin || 10;
    const contentWidth = pageWidth - (margin * 2);
    const contentHeight = (canvas.height * contentWidth) / canvas.width;

    pdf.addImage(imgData, 'JPEG', margin, margin, contentWidth, contentHeight);

    return pdf.output('blob');
}

export default generatePDF;
