// import html2pdf from 'html2pdf.js';
// import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
// import { saveAs } from 'file-saver';
import type { CVData } from '@/types/cv';

/**
 * Export CV as PDF
 * TEMPORARILY DISABLED FOR CLOUDFLARE BUILD
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const exportPDF = async (elementId: string, _filename: string = 'CV') => {
  console.log('Export PDF temporarily disabled for build stability');
  alert('PDF Export is coming soon! (Disabled for deployment testing)');
  return true;
  /*
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Element not found');
  }
 
  const options = {
    margin: 10,
    filename: `${filename}.pdf`,
    image: { type: 'jpeg' as const, quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
  };
 
  try {
    await html2pdf().set(options).from(element).save();
    return true;
  } catch (error) {
    console.error('PDF export error:', error);
    throw error;
  }
  */
};

/**
 * Export CV as DOCX
 * TEMPORARILY DISABLED FOR CLOUDFLARE BUILD
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const exportDOCX = async (data: CVData, _filename: string = 'CV') => {
  console.log('Export DOCX temporarily disabled for build stability');
  alert('DOCX Export is coming soon! (Disabled for deployment testing)');
  return true;
  /*
  const sections: Paragraph[] = [];
 
  // Header - Personal Info
  sections.push(
    new Paragraph({
      text: data.personal.fullName || 'Your Name',
      heading: HeadingLevel.HEADING_1,
      spacing: { after: 200 }
    })
  );
 
  if (data.personal.email || data.personal.phone || data.personal.location) {
    const contactInfo = [
      data.personal.email,
      data.personal.phone,
      data.personal.location
    ].filter(Boolean).join(' | ');
    
    sections.push(
      new Paragraph({
        children: [new TextRun({ text: contactInfo, size: 20 })],
        spacing: { after: 300 }
      })
    );
  }
 
  // Summary
  if (data.personal.summary) {
    sections.push(
      new Paragraph({
        text: 'Summary',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 }
      }),
      new Paragraph({
        children: [new TextRun(data.personal.summary)],
        spacing: { after: 300 }
      })
    );
  }
 
  // Experience
  if (data.experiences.length > 0) {
    sections.push(
      new Paragraph({
        text: 'Professional Experience',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 }
      })
    );
 
    data.experiences.forEach(exp => {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: exp.position, bold: true }),
            new TextRun(` - ${exp.company}`)
          ],
          spacing: { before: 100 }
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`,
              italics: true,
              size: 20
            })
          ]
        })
      );
 
      exp.achievements.forEach(achievement => {
        if (achievement) {
          sections.push(
            new Paragraph({
              text: `• ${achievement}`,
              spacing: { before: 50 }
            })
          );
        }
      });
    });
  }
 
  // Education
  if (data.education.length > 0) {
    sections.push(
      new Paragraph({
        text: 'Education',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 300, after: 100 }
      })
    );
 
    data.education.forEach(edu => {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: edu.degree, bold: true }),
            new TextRun(` - ${edu.institution}`)
          ],
          spacing: { before: 100 }
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `${edu.startDate} - ${edu.current ? 'Present' : edu.endDate}`,
              italics: true,
              size: 20
            })
          ]
        })
      );
 
      if (edu.field) {
        sections.push(
          new Paragraph({
            text: edu.field,
            spacing: { before: 50 }
          })
        );
      }
    });
  }
 
  // Skills
  if (data.skills.length > 0) {
    sections.push(
      new Paragraph({
        text: 'Skills',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 300, after: 100 }
      }),
      new Paragraph({
        text: data.skills.map(s => s.name).join(', ')
      })
    );
  }
 
  // Languages
  if (data.languages.length > 0) {
    sections.push(
      new Paragraph({
        text: 'Languages',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 300, after: 100 }
      }),
      new Paragraph({
        text: data.languages.map(l => `${l.name} (${l.proficiency})`).join(', ')
      })
    );
  }
 
  const doc = new Document({
    sections: [{
      properties: {},
      children: sections
    }]
  });
 
  try {
    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${filename}.docx`);
    return true;
  } catch (error) {
    console.error('DOCX export error:', error);
    throw error;
  }
  */
};

/**
 * Export CV as plain text
 * TEMPORARILY DISABLED FOR CLOUDFLARE BUILD
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const exportTXT = (data: CVData, _filename: string = 'CV') => {
  console.log('Export TXT temporarily disabled for build stability');
  alert('TXT Export is coming soon! (Disabled for deployment testing)');
  return true;
  /*
  let text = '';
 
  // Header
  text += `${data.personal.fullName || 'YOUR NAME'}\n`;
  text += '='.repeat((data.personal.fullName || 'YOUR NAME').length) + '\n\n';
 
  if (data.personal.email || data.personal.phone || data.personal.location) {
    text += [data.personal.email, data.personal.phone, data.personal.location]
      .filter(Boolean)
      .join(' | ') + '\n\n';
  }
 
  // Summary
  if (data.personal.summary) {
    text += 'SUMMARY\n-------\n';
    text += data.personal.summary + '\n\n';
  }
 
  // Experience
  if (data.experiences.length > 0) {
    text += 'PROFESSIONAL EXPERIENCE\n-----------------------\n\n';
    data.experiences.forEach(exp => {
      text += `${exp.position} - ${exp.company}\n`;
      text += `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}\n`;
      exp.achievements.forEach(achievement => {
        if (achievement) {
          text += `• ${achievement}\n`;
        }
      });
      text += '\n';
    });
  }
 
  // Education
  if (data.education.length > 0) {
    text += 'EDUCATION\n---------\n\n';
    data.education.forEach(edu => {
      text += `${edu.degree} - ${edu.institution}\n`;
      text += `${edu.startDate} - ${edu.current ? 'Present' : edu.endDate}\n`;
      if (edu.field) {
        text += `Field: ${edu.field}\n`;
      }
      text += '\n';
    });
  }
 
  // Skills
  if (data.skills.length > 0) {
    text += 'SKILLS\n------\n';
    text += data.skills.map(s => s.name).join(', ') + '\n\n';
  }
 
  // Languages
  if (data.languages.length > 0) {
    text += 'LANGUAGES\n---------\n';
    text += data.languages.map(l => `${l.name} (${l.proficiency})`).join(', ') + '\n';
  }
 
  // Download
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  saveAs(blob, `${filename}.txt`);
  return true;
  */
};
