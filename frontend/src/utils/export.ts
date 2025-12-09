import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from 'docx';
import { saveAs } from 'file-saver';
import type { TemplateData } from '@/types/cv';

interface ExportOptions {
  filename?: string;
}

/**
 * Export CV data to DOCX format
 */
export async function exportDOCX(data: TemplateData, options: ExportOptions = {}): Promise<void> {
  const { filename = 'cv.docx' } = options;

  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        // Header - Name
        new Paragraph({
          heading: HeadingLevel.TITLE,
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: data.personal.fullName || 'Your Name',
              bold: true,
              size: 48
            })
          ]
        }),

        // Contact Info
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
          children: [
            new TextRun({
              text: [
                data.personal.email,
                data.personal.phone,
                data.personal.location
              ].filter(Boolean).join(' • '),
              size: 20,
              color: '666666'
            })
          ]
        }),

        // Summary
        ...(data.personal.summary ? [
          createSectionHeading('PROFIL'),
          new Paragraph({
            spacing: { after: 300 },
            children: [
              new TextRun({
                text: data.personal.summary,
                size: 22
              })
            ]
          })
        ] : []),

        // Experience
        ...(data.experiences.length > 0 ? [
          createSectionHeading('EXPÉRIENCE PROFESSIONNELLE'),
          ...data.experiences.flatMap(exp => [
            new Paragraph({
              children: [
                new TextRun({
                  text: exp.position,
                  bold: true,
                  size: 24
                }),
                new TextRun({
                  text: ` - ${exp.company}`,
                  size: 24
                })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `${exp.startDate} - ${exp.current ? 'Présent' : exp.endDate}`,
                  italics: true,
                  size: 20,
                  color: '888888'
                })
              ]
            }),
            ...(exp.achievements || []).filter(Boolean).map(achievement =>
              new Paragraph({
                bullet: { level: 0 },
                children: [
                  new TextRun({
                    text: achievement,
                    size: 22
                  })
                ]
              })
            ),
            new Paragraph({ spacing: { after: 200 }, children: [] })
          ])
        ] : []),

        // Education
        ...(data.education.length > 0 ? [
          createSectionHeading('FORMATION'),
          ...data.education.flatMap(edu => [
            new Paragraph({
              children: [
                new TextRun({
                  text: edu.degree,
                  bold: true,
                  size: 24
                })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `${edu.institution}${edu.field ? ` - ${edu.field}` : ''}`,
                  size: 22
                })
              ]
            }),
            new Paragraph({
              spacing: { after: 200 },
              children: [
                new TextRun({
                  text: `${edu.startDate} - ${edu.current ? 'En cours' : edu.endDate}`,
                  italics: true,
                  size: 20,
                  color: '888888'
                })
              ]
            })
          ])
        ] : []),

        // Skills
        ...(data.skills.length > 0 ? [
          createSectionHeading('COMPÉTENCES'),
          new Paragraph({
            spacing: { after: 300 },
            children: [
              new TextRun({
                text: data.skills.map(s => s.name).join(' • '),
                size: 22
              })
            ]
          })
        ] : []),

        // Languages
        ...(data.languages.length > 0 ? [
          createSectionHeading('LANGUES'),
          ...data.languages.map(lang =>
            new Paragraph({
              children: [
                new TextRun({
                  text: `${lang.name}: `,
                  bold: true,
                  size: 22
                }),
                new TextRun({
                  text: getProficiencyLabel(lang.proficiency),
                  size: 22
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
    text += 'PROFIL\n';
    text += '-'.repeat(20) + '\n';
    text += data.personal.summary + '\n\n';
  }

  // Experience
  if (data.experiences.length > 0) {
    text += 'EXPÉRIENCE PROFESSIONNELLE\n';
    text += '-'.repeat(20) + '\n';
    data.experiences.forEach(exp => {
      text += `${exp.position} - ${exp.company}\n`;
      text += `${exp.startDate} - ${exp.current ? 'Présent' : exp.endDate}\n`;
      (exp.achievements || []).filter(Boolean).forEach(a => {
        text += `  • ${a}\n`;
      });
      text += '\n';
    });
  }

  // Education
  if (data.education.length > 0) {
    text += 'FORMATION\n';
    text += '-'.repeat(20) + '\n';
    data.education.forEach(edu => {
      text += `${edu.degree}\n`;
      text += `${edu.institution}${edu.field ? ` - ${edu.field}` : ''}\n`;
      text += `${edu.startDate} - ${edu.current ? 'En cours' : edu.endDate}\n\n`;
    });
  }

  // Skills
  if (data.skills.length > 0) {
    text += 'COMPÉTENCES\n';
    text += '-'.repeat(20) + '\n';
    text += data.skills.map(s => s.name).join(', ') + '\n\n';
  }

  // Languages
  if (data.languages.length > 0) {
    text += 'LANGUES\n';
    text += '-'.repeat(20) + '\n';
    data.languages.forEach(lang => {
      text += `${lang.name}: ${getProficiencyLabel(lang.proficiency)}\n`;
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
function createSectionHeading(text: string): Paragraph {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 400, after: 200 },
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
        color: '1f2937'
      })
    ]
  });
}

// Helper function for proficiency labels
function getProficiencyLabel(proficiency: string): string {
  const labels: Record<string, string> = {
    native: 'Langue maternelle',
    fluent: 'Courant',
    intermediate: 'Intermédiaire',
    basic: 'Débutant'
  };
  return labels[proficiency] || proficiency;
}

export default {
  exportDOCX,
  exportTXT,
  exportJSON
};
