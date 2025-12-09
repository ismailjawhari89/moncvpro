/**
 * Cover Letter Export Utilities
 * Functions to export cover letters in various formats
 */

import { CoverLetterData, ExportOptions } from '@/types/cover-letter';
import { coverLetterTemplates } from '@/data/cover-letter-templates';

/**
 * Format date in a professional manner
 */
export function formatDate(date: Date = new Date()): string {
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * Generate plain text version of cover letter
 */
export function generatePlainText(data: CoverLetterData): string {
    const { personalInfo, companyInfo, content } = data;

    let text = '';

    // Header
    text += `${personalInfo.fullName}\n`;
    text += `${personalInfo.email} | ${personalInfo.phone}\n`;
    if (personalInfo.linkedIn) {
        text += `${personalInfo.linkedIn}\n`;
    }
    text += `\n`;

    // Date
    text += `${formatDate()}\n\n`;

    // Recipient
    if (companyInfo.hiringManagerName) {
        text += `${companyInfo.hiringManagerName}\n`;
    }
    text += `${companyInfo.companyName}\n`;
    if (companyInfo.jobReference) {
        text += `Re: ${companyInfo.jobTitle} (Ref: ${companyInfo.jobReference})\n`;
    } else {
        text += `Re: ${companyInfo.jobTitle}\n`;
    }
    text += `\n`;

    // Salutation
    const salutation = companyInfo.hiringManagerName
        ? `Dear ${companyInfo.hiringManagerName},`
        : 'Dear Hiring Manager,';
    text += `${salutation}\n\n`;

    // Content
    if (content.introduction) text += `${content.introduction}\n\n`;
    if (content.bodyParagraph1) text += `${content.bodyParagraph1}\n\n`;
    if (content.bodyParagraph2) text += `${content.bodyParagraph2}\n\n`;
    if (content.bodyParagraph3) text += `${content.bodyParagraph3}\n\n`;
    if (content.closing) text += `${content.closing}\n\n`;
    if (content.callToAction) text += `${content.callToAction}\n\n`;

    // Signature
    text += `Sincerely,\n`;
    text += `${personalInfo.fullName}\n`;

    return text;
}

/**
 * Generate HTML version of cover letter with styling
 */
export function generateHTML(data: CoverLetterData): string {
    const { personalInfo, companyInfo, content, templateId } = data;
    const template = coverLetterTemplates.find(t => t.id === templateId) || coverLetterTemplates[0];
    const styles = template.styles;

    const salutation = companyInfo.hiringManagerName
        ? `Dear ${companyInfo.hiringManagerName},`
        : 'Dear Hiring Manager,';

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cover Letter - ${personalInfo.fullName}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: ${styles.fontFamily};
            font-size: ${styles.fontSize};
            line-height: ${styles.lineHeight};
            color: ${styles.textColor};
            max-width: 8.5in;
            margin: 0 auto;
            padding: 1in;
            background: white;
        }
        
        .header {
            margin-bottom: ${styles.spacing};
            border-bottom: 2px solid ${styles.accentColor};
            padding-bottom: 1rem;
        }
        
        .header h1 {
            color: ${styles.headerColor};
            font-size: 1.5em;
            margin-bottom: 0.5rem;
        }
        
        .header .contact-info {
            color: ${styles.textColor};
            font-size: 0.9em;
        }
        
        .date {
            margin-bottom: ${styles.spacing};
            color: ${styles.textColor};
        }
        
        .recipient {
            margin-bottom: ${styles.spacing};
        }
        
        .recipient p {
            margin-bottom: 0.25rem;
        }
        
        .salutation {
            margin-bottom: 1rem;
            font-weight: 500;
        }
        
        .content p {
            margin-bottom: ${styles.spacing};
            text-align: justify;
        }
        
        .signature {
            margin-top: 2rem;
        }
        
        .signature p {
            margin-bottom: 0.5rem;
        }
        
        @media print {
            body {
                padding: 0;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>${personalInfo.fullName}</h1>
        <div class="contact-info">
            ${personalInfo.email} | ${personalInfo.phone}
            ${personalInfo.linkedIn ? ` | ${personalInfo.linkedIn}` : ''}
        </div>
    </div>
    
    <div class="date">
        ${formatDate()}
    </div>
    
    <div class="recipient">
        ${companyInfo.hiringManagerName ? `<p>${companyInfo.hiringManagerName}</p>` : ''}
        <p>${companyInfo.companyName}</p>
        <p>Re: ${companyInfo.jobTitle}${companyInfo.jobReference ? ` (Ref: ${companyInfo.jobReference})` : ''}</p>
    </div>
    
    <div class="salutation">
        ${salutation}
    </div>
    
    <div class="content">
        ${content.introduction ? `<p>${content.introduction}</p>` : ''}
        ${content.bodyParagraph1 ? `<p>${content.bodyParagraph1}</p>` : ''}
        ${content.bodyParagraph2 ? `<p>${content.bodyParagraph2}</p>` : ''}
        ${content.bodyParagraph3 ? `<p>${content.bodyParagraph3}</p>` : ''}
        ${content.closing ? `<p>${content.closing}</p>` : ''}
        ${content.callToAction ? `<p>${content.callToAction}</p>` : ''}
    </div>
    
    <div class="signature">
        <p>Sincerely,</p>
        <p><strong>${personalInfo.fullName}</strong></p>
    </div>
</body>
</html>
    `.trim();
}

/**
 * Export cover letter as PDF (browser print)
 */
export async function exportAsPDF(data: CoverLetterData, options: ExportOptions): Promise<void> {
    const html = generateHTML(data);
    const printWindow = window.open('', '_blank');

    if (!printWindow) {
        throw new Error('Please allow popups to export PDF');
    }

    printWindow.document.write(html);
    printWindow.document.close();

    // Wait for content to load
    printWindow.onload = () => {
        printWindow.print();
    };
}

/**
 * Export cover letter as DOCX (placeholder - requires library)
 */
export async function exportAsDOCX(data: CoverLetterData, options: ExportOptions): Promise<void> {
    // TODO: Implement DOCX export using docx library
    // For now, download as HTML
    const html = generateHTML(data);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cover-letter-${data.personalInfo.fullName.replace(/\s+/g, '-').toLowerCase()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * Export cover letter as plain text
 */
export function exportAsText(data: CoverLetterData): void {
    const text = generatePlainText(data);
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cover-letter-${data.personalInfo.fullName.replace(/\s+/g, '-').toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * Copy cover letter to clipboard
 */
export async function copyToClipboard(data: CoverLetterData): Promise<void> {
    const text = generatePlainText(data);

    if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
    } else {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }
}

/**
 * Calculate readability score (Flesch Reading Ease)
 */
export function calculateReadabilityScore(text: string): number {
    if (!text || text.trim().length === 0) return 0;

    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = text.split(/\s+/).filter(w => w.trim().length > 0);
    const syllables = words.reduce((count, word) => {
        return count + countSyllables(word);
    }, 0);

    if (sentences.length === 0 || words.length === 0) return 0;

    const avgWordsPerSentence = words.length / sentences.length;
    const avgSyllablesPerWord = syllables / words.length;

    // Flesch Reading Ease formula
    const score = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);

    // Normalize to 0-100
    return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Count syllables in a word (simple approximation)
 */
function countSyllables(word: string): number {
    word = word.toLowerCase().replace(/[^a-z]/g, '');
    if (word.length <= 3) return 1;

    const vowels = 'aeiouy';
    let count = 0;
    let previousWasVowel = false;

    for (let i = 0; i < word.length; i++) {
        const isVowel = vowels.includes(word[i]);
        if (isVowel && !previousWasVowel) {
            count++;
        }
        previousWasVowel = isVowel;
    }

    // Adjust for silent e
    if (word.endsWith('e')) {
        count--;
    }

    return Math.max(1, count);
}

/**
 * Get character count for a section
 */
export function getCharacterCount(text: string): number {
    return text.trim().length;
}

/**
 * Get word count for a section
 */
export function getWordCount(text: string): number {
    return text.trim().split(/\s+/).filter(w => w.length > 0).length;
}
