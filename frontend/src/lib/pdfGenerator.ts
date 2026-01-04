
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { CVData } from '../templates/types';

export interface PDFGeneratorOptions {
    format: 'standard' | 'hq' | 'ats';
    atsMode?: boolean;
}

/**
 * Generates a PDF from a given HTML element using optimal settings for the Modern Pro template.
 */
export async function generateModernProPDF(
    element: HTMLElement,
    cvData: CVData,
    options: PDFGeneratorOptions
): Promise<Blob> {
    // Configuration based on format
    const isHQ = options.format === 'hq';
    const scale = isHQ ? 2 : 1.5; // HQ = 2x scale for better clarity on retina/high-res, Standard = 1.5x

    // NOTE: For 'ats' format, typically we would want a text-based PDF generation logic
    // but for now we follow the visual capture approach unless a raw text generation engine is available.
    // Ideally, PDF-ATS should use raw text placement APIs of jsPDF for true machine readability.
    // Here we assume the visual representation is clean enough for now or the 'atsMode' toggle in renderer handles the visual styling changes 
    // (like removing photos) before we capture it.

    const config = {
        scale: scale,
        useCORS: true, // Crucial for external images like profile photos
        allowTaint: false,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 794, // A4 width in px at 96 DPI
        // height is auto
        imageQuality: isHQ ? 1.0 : 0.95
    };

    try {
        const canvas = await html2canvas(element, config);
        const imgData = canvas.toDataURL('image/png', options.format === 'hq' ? 1.0 : 0.95);

        // A4 Dimensions: 210mm x 297mm
        // Margins: 32px (approx 8.5mm)
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'px',
            format: 'a4',
            compress: true,
            hotlinks: true
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        // Calculate aspect ratio to fit image
        const imgProps = pdf.getImageProperties(imgData);
        const renderWidth = pdfWidth; // Full width
        const renderHeight = (imgProps.height * pdfWidth) / imgProps.width;

        // Handle Pagination if content is longer than one page
        let heightLeft = renderHeight;
        let position = 0;

        // First Page
        pdf.addImage(imgData, 'PNG', 0, position, renderWidth, renderHeight);
        heightLeft -= pdfHeight;

        // Subsequent Pages
        while (heightLeft > 0) {
            position -= pdfHeight; // Move the image up
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, renderWidth, renderHeight);
            heightLeft -= pdfHeight;
        }

        // Set metadata
        pdf.setProperties({
            title: `${cvData.personalInfo.fullName} - CV`,
            author: cvData.personalInfo.fullName,
            creator: 'MonCVPro',
            subject: `CV - ${cvData.personalInfo.jobTitle}`
        });

        return pdf.output('blob');

    } catch (error) {
        console.error('PDF Generation Error:', error);
        throw new Error('Failed to generate PDF');
    }
}
