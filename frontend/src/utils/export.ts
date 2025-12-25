import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from 'docx';
import { saveAs } from 'file-saver';
import type { TemplateData } from '@/types/cv';

interface ExportOptions {
  filename?: string;
}

/**
 * Export CV data to DOCX format
 */
/**
 * Check if text contains Arabic characters
 */
function isArabic(text: string): boolean {
  if (!text) return false;
  const arabicPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  return arabicPattern.test(text);
}

/**
 * Export CV data to DOCX format
 */
export async function exportDOCX(data: TemplateData, options: ExportOptions = {}): Promise<void> {
  const { filename = 'cv.docx' } = options;

  // Detect primary language direction based on full name or summary
  const hasArabic = isArabic(data.personal.fullName) || isArabic(data.personal.summary) || isArabic(data.experiences?.[0]?.position);

  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        // Header - Name
        new Paragraph({
          heading: HeadingLevel.TITLE,
          alignment: AlignmentType.CENTER,
          bidirectional: hasArabic,
          children: [
            new TextRun({
              text: data.personal.fullName || 'Your Name',
              bold: true,
              size: 48,
              rightToLeft: hasArabic
            })
          ]
        }),

        // Contact Info
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
          bidirectional: hasArabic,
          children: [
            new TextRun({
              text: [
                data.personal.email,
                data.personal.phone,
                data.personal.location
              ].filter(Boolean).join(' • '),
              size: 20,
              color: '666666',
              rightToLeft: hasArabic
            })
          ]
        }),

        // Summary
        ...(data.personal.summary ? [
          createSectionHeading(hasArabic ? 'نبذة مهنية' : 'PROFIL', hasArabic),
          new Paragraph({
            spacing: { after: 300 },
            alignment: hasArabic ? AlignmentType.RIGHT : AlignmentType.LEFT,
            bidirectional: hasArabic,
            children: [
              new TextRun({
                text: data.personal.summary,
                size: 22,
                rightToLeft: hasArabic
              })
            ]
          })
        ] : []),

        // Experience
        ...(data.experiences.length > 0 ? [
          createSectionHeading(hasArabic ? 'الخبرات المهنية' : 'EXPÉRIENCE PROFESSIONNELLE', hasArabic),
          ...data.experiences.flatMap(exp => {
            const isExpArabic = isArabic(exp.position) || isArabic(exp.company);
            return [
              new Paragraph({
                alignment: hasArabic ? AlignmentType.RIGHT : AlignmentType.LEFT,
                bidirectional: hasArabic,
                children: [
                  new TextRun({
                    text: exp.position,
                    bold: true,
                    size: 24,
                    rightToLeft: isExpArabic
                  }),
                  new TextRun({
                    text: hasArabic ? ` - ${exp.company}` : ` - ${exp.company}`,
                    size: 24,
                    rightToLeft: isExpArabic
                  })
                ]
              }),
              new Paragraph({
                alignment: hasArabic ? AlignmentType.RIGHT : AlignmentType.LEFT,
                bidirectional: hasArabic,
                children: [
                  new TextRun({
                    text: `${exp.startDate} - ${exp.current ? (hasArabic ? 'حالياً' : 'Présent') : exp.endDate}`,
                    italics: true,
                    size: 20,
                    color: '888888',
                    rightToLeft: isExpArabic
                  })
                ]
              }),
              ...(exp.achievements || []).filter(Boolean).map(achievement =>
                new Paragraph({
                  bullet: { level: 0 },
                  alignment: hasArabic ? AlignmentType.RIGHT : AlignmentType.LEFT,
                  bidirectional: hasArabic,
                  children: [
                    new TextRun({
                      text: achievement,
                      size: 22,
                      rightToLeft: isArabic(achievement)
                    })
                  ]
                })
              ),
              new Paragraph({ spacing: { after: 200 }, children: [] })
            ]
          })
        ] : []),

        // Education
        ...(data.education.length > 0 ? [
          createSectionHeading(hasArabic ? 'التعليم والمؤهلات' : 'FORMATION', hasArabic),
          ...data.education.flatMap(edu => {
            const isEduArabic = isArabic(edu.degree) || isArabic(edu.institution);
            return [
              new Paragraph({
                alignment: hasArabic ? AlignmentType.RIGHT : AlignmentType.LEFT,
                bidirectional: hasArabic,
                children: [
                  new TextRun({
                    text: edu.degree,
                    bold: true,
                    size: 24,
                    rightToLeft: isEduArabic
                  })
                ]
              }),
              new Paragraph({
                alignment: hasArabic ? AlignmentType.RIGHT : AlignmentType.LEFT,
                bidirectional: hasArabic,
                children: [
                  new TextRun({
                    text: `${edu.institution}${edu.field ? ` - ${edu.field}` : ''}`,
                    size: 22,
                    rightToLeft: isEduArabic
                  })
                ]
              }),
              new Paragraph({
                spacing: { after: 200 },
                alignment: hasArabic ? AlignmentType.RIGHT : AlignmentType.LEFT,
                bidirectional: hasArabic,
                children: [
                  new TextRun({
                    text: `${edu.startDate} - ${edu.current ? (hasArabic ? 'حالياً' : 'En cours') : edu.endDate}`,
                    italics: true,
                    size: 20,
                    color: '888888',
                    rightToLeft: isEduArabic
                  })
                ]
              })
            ]
          })
        ] : []),

        // Skills
        ...(data.skills.length > 0 ? [
          createSectionHeading(hasArabic ? 'المهارات' : 'COMPÉTENCES', hasArabic),
          new Paragraph({
            spacing: { after: 300 },
            alignment: hasArabic ? AlignmentType.RIGHT : AlignmentType.LEFT,
            bidirectional: hasArabic,
            children: [
              new TextRun({
                text: data.skills.map(s => s.name).join(' • '),
                size: 22,
                rightToLeft: hasArabic
              })
            ]
          })
        ] : []),

        // Languages
        ...(data.languages.length > 0 ? [
          createSectionHeading(hasArabic ? 'اللغات' : 'LANGUES', hasArabic),
          ...data.languages.map(lang =>
            new Paragraph({
              alignment: hasArabic ? AlignmentType.RIGHT : AlignmentType.LEFT,
              bidirectional: hasArabic,
              children: [
                new TextRun({
                  text: `${lang.name}: `,
                  bold: true,
                  size: 22,
                  rightToLeft: hasArabic
                }),
                new TextRun({
                  text: getProficiencyLabel(lang.proficiency, hasArabic),
                  size: 22,
                  rightToLeft: hasArabic
                })
              ]
            })
          )
        ] : [])
      ]
    }]
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, filename);
}

/**
 * Export CV data to plain text format
 */
export function exportTXT(data: TemplateData, options: ExportOptions = {}): void {
  const { filename = 'cv.txt' } = options;

  const hasArabic = isArabic(data.personal.fullName) || isArabic(data.personal.summary);
  let text = '';

  // Header
  text += `${data.personal.fullName || 'Your Name'}\n`;
  text += '='.repeat(50) + '\n\n';

  // Contact
  const contact = [data.personal.email, data.personal.phone, data.personal.location].filter(Boolean);
  if (contact.length) {
    text += contact.join(' | ') + '\n\n';
  }

  // Summary
  if (data.personal.summary) {
    text += (hasArabic ? 'نبذة مهنية' : 'PROFIL') + '\n';
    text += '-'.repeat(20) + '\n';
    text += data.personal.summary + '\n\n';
  }

  // Experience
  if (data.experiences.length > 0) {
    text += (hasArabic ? 'الخبرات المهنية' : 'EXPÉRIENCE PROFESSIONNELLE') + '\n';
    text += '-'.repeat(20) + '\n';
    data.experiences.forEach(exp => {
      text += `${exp.position} - ${exp.company}\n`;
      text += `${exp.startDate} - ${exp.current ? (hasArabic ? 'حالياً' : 'Présent') : exp.endDate}\n`;
      (exp.achievements || []).filter(Boolean).forEach(a => {
        text += `  • ${a}\n`;
      });
      text += '\n';
    });
  }

  // Education
  if (data.education.length > 0) {
    text += (hasArabic ? 'التعليم والمؤهلات' : 'FORMATION') + '\n';
    text += '-'.repeat(20) + '\n';
    data.education.forEach(edu => {
      text += `${edu.degree}\n`;
      text += `${edu.institution}${edu.field ? ` - ${edu.field}` : ''}\n`;
      text += `${edu.startDate} - ${edu.current ? (hasArabic ? 'حالياً' : 'En cours') : edu.endDate}\n\n`;
    });
  }

  // Skills
  if (data.skills.length > 0) {
    text += (hasArabic ? 'المهارات' : 'COMPÉTENCES') + '\n';
    text += '-'.repeat(20) + '\n';
    text += data.skills.map(s => s.name).join(', ') + '\n\n';
  }

  // Languages
  if (data.languages.length > 0) {
    text += (hasArabic ? 'اللغات' : 'LANGUES') + '\n';
    text += '-'.repeat(20) + '\n';
    data.languages.forEach(lang => {
      text += `${lang.name}: ${getProficiencyLabel(lang.proficiency, hasArabic)}\n`;
    });
  }

  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  saveAs(blob, filename);
}

/**
 * Export CV data to JSON format
 */
export function exportJSON(data: TemplateData, options: ExportOptions = {}): void {
  const { filename = 'cv.json' } = options;

  const jsonData = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonData], { type: 'application/json' });
  saveAs(blob, filename);
}

// Helper function to create section headings
function createSectionHeading(text: string, isRTL: boolean = false): Paragraph {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 400, after: 200 },
    alignment: isRTL ? AlignmentType.RIGHT : AlignmentType.LEFT,
    bidirectional: isRTL,
    border: {
      bottom: {
        color: '3b82f6',
        space: 1,
        style: BorderStyle.SINGLE,
        size: 6
      }
    },
    children: [
      new TextRun({
        text,
        bold: true,
        size: 26,
        color: '1f2937',
        rightToLeft: isRTL
      })
    ]
  });
}

// Helper function for proficiency labels
function getProficiencyLabel(proficiency: string, isRTL: boolean = false): string {
  const labels: Record<string, string> = {
    native: 'Langue maternelle',
    fluent: 'Courant',
    intermediate: 'Intermédiaire',
    basic: 'Débutant'
  };

  const labelsAR: Record<string, string> = {
    native: 'لغة أم',
    fluent: 'متقن',
    intermediate: 'متوسط',
    basic: 'مبتدئ'
  };

  if (isRTL) return labelsAR[proficiency] || proficiency;
  return labels[proficiency] || proficiency;
}

export default {
  exportDOCX,
  exportTXT,
  exportJSON,
  generateTextPDF
};

/**
 * Generate PDF using the Cloudflare Worker (Puppeteer)
 */
export async function generateTextPDF(html: string, css: string, filename = 'cv.pdf'): Promise<void> {
  // Use env var or default to local worker port
  const WORKER_URL = process.env.NEXT_PUBLIC_WORKER_URL || 'http://localhost:8787';

  const response = await fetch(`${WORKER_URL}/api/pdf/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ html, css }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`PDF Generation failed: ${error}`);
  }

  const blob = await response.blob();
  saveAs(blob, filename);
}
