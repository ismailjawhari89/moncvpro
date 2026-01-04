
/**
 * Template Validation Utilities
 * Helper functions to validate CV template layout and export quality
 */

export interface TemplateValidationResult {
    hasPhoto: boolean;
    columnRatio: [number, number];
    textOverflow: string[];
    spacing: { sections: number; columns: number };
    alignment: 'ltr' | 'rtl';
    typography: { name: number; title: number; body: number };
    isValid: boolean;
    errors: string[];
}

/**
 * Validates the layout of a rendered template element
 */
export function validateTemplateLayout(
    element: HTMLElement,
    expectations?: Partial<TemplateValidationResult>
): TemplateValidationResult {
    const result: TemplateValidationResult = {
        hasPhoto: false,
        columnRatio: [0, 0],
        textOverflow: [],
        spacing: { sections: 0, columns: 0 },
        alignment: 'ltr',
        typography: { name: 0, title: 0, body: 0 },
        isValid: true,
        errors: []
    };

    // Check Photo
    const photo = element.querySelector('img');
    result.hasPhoto = !!photo && photo.clientWidth > 0;

    // Check Columns
    const leftCol = element.querySelector('.cv-column-left');
    const rightCol = element.querySelector('.cv-column-right');

    if (leftCol && rightCol) {
        const totalWidth = element.clientWidth;
        const leftWidth = leftCol.clientWidth;
        const rightWidth = rightCol.clientWidth;

        // Calculate ratio percentages
        const leftRatio = Math.round((leftWidth / totalWidth) * 100);
        const rightRatio = Math.round((rightWidth / totalWidth) * 100);
        result.columnRatio = [leftRatio, rightRatio];
    }

    // Check Alignment
    const computedStyle = window.getComputedStyle(element);
    result.alignment = computedStyle.direction as 'ltr' | 'rtl';

    // Check Text Overflow (basic check for scrollWidth > clientWidth)
    const textElements = element.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div');
    textElements.forEach((el) => {
        if (el.scrollWidth > el.clientWidth && el.clientWidth > 0) {
            result.textOverflow.push(el.textContent?.substring(0, 20) || 'Unknown element');
        }
    });

    // Typography Validation (Sampling)
    const h1 = element.querySelector('h1');
    const h2 = element.querySelector('h2');
    const p = element.querySelector('p');

    if (h1) result.typography.name = parseFloat(window.getComputedStyle(h1).fontSize);
    if (h2) result.typography.title = parseFloat(window.getComputedStyle(h2).fontSize);
    if (p) result.typography.body = parseFloat(window.getComputedStyle(p).fontSize);

    // Validation Logic against Expectations
    if (expectations?.hasPhoto !== undefined && result.hasPhoto !== expectations.hasPhoto) {
        result.isValid = false;
        result.errors.push(`Expected photo to be ${expectations.hasPhoto}, found ${result.hasPhoto}`);
    }

    if (result.textOverflow.length > 0) {
        result.isValid = false;
        result.errors.push(`Found ${result.textOverflow.length} text overflow issues`);
    }

    return result;
}

/**
 * Validates PDF File Quality (Basic Check)
 */
export function validatePDFQuality(
    pdfBlob: Blob
): { fileSize: number; isValid: boolean; message: string } {
    const fileSize = pdfBlob.size;
    const isValid = fileSize > 0;

    let message = 'PDF is valid';
    if (fileSize === 0) message = 'PDF file is empty';
    if (fileSize > 5 * 1024 * 1024) message = 'PDF file size is too large (> 5MB)';

    return {
        fileSize,
        isValid,
        message
    };
}
