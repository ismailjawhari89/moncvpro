import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import logger from '../utils/logger.js';
import { InternalServerError, ValidationError } from '../utils/errors.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// PDF Export directory
const exportsDir = path.join(__dirname, '../../exports');
if (!fs.existsSync(exportsDir)) {
    fs.mkdirSync(exportsDir, { recursive: true });
    logger.info('Exports directory created', { path: exportsDir });
}

/**
 * Generate HTML content for PDF
 */
const generateHTMLContent = (cvData, template = 'modern') => {
    const { personalInfo, summary, experience, education, skills, languages, certifications } = cvData;
    
    const styles = `
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 800px;
                margin: 0 auto;
                padding: 40px 60px;
                background: #fff;
            }
            
            .header {
                text-align: center;
                margin-bottom: 30px;
                padding-bottom: 20px;
                border-bottom: 3px solid #2563eb;
            }
            
            .header h1 {
                font-size: 32px;
                color: #1e293b;
                margin-bottom: 10px;
                font-weight: 700;
            }
            
            .contact-info {
                display: flex;
                justify-content: center;
                flex-wrap: wrap;
                gap: 15px;
                margin-top: 15px;
                font-size: 14px;
                color: #64748b;
            }
            
            .contact-info span {
                display: inline-block;
            }
            
            .section {
                margin-bottom: 30px;
            }
            
            .section-title {
                font-size: 20px;
                color: #2563eb;
                margin-bottom: 15px;
                padding-bottom: 8px;
                border-bottom: 2px solid #e2e8f0;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            
            .summary {
                font-size: 15px;
                line-height: 1.8;
                color: #475569;
                text-align: justify;
            }
            
            .experience-item, .education-item {
                margin-bottom: 20px;
                padding-left: 20px;
                border-left: 3px solid #e2e8f0;
            }
            
            .item-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 8px;
            }
            
            .item-title {
                font-size: 17px;
                font-weight: 600;
                color: #1e293b;
            }
            
            .item-company {
                font-size: 15px;
                color: #2563eb;
                font-weight: 500;
            }
            
            .item-location {
                font-size: 14px;
                color: #64748b;
            }
            
            .item-date {
                font-size: 14px;
                color: #64748b;
                white-space: nowrap;
            }
            
            .item-description {
                font-size: 14px;
                line-height: 1.7;
                color: #475569;
                margin-top: 8px;
            }
            
            .highlights {
                list-style: none;
                margin-top: 10px;
            }
            
            .highlights li {
                padding-left: 20px;
                position: relative;
                margin-bottom: 6px;
                font-size: 14px;
                color: #475569;
            }
            
            .highlights li:before {
                content: '•';
                position: absolute;
                left: 0;
                color: #2563eb;
                font-weight: bold;
                font-size: 18px;
            }
            
            .skills-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 10px;
                margin-top: 10px;
            }
            
            .skill-category {
                margin-bottom: 15px;
            }
            
            .skill-category-title {
                font-size: 15px;
                font-weight: 600;
                color: #1e293b;
                margin-bottom: 8px;
            }
            
            .skill-items {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
            }
            
            .skill-tag {
                display: inline-block;
                padding: 4px 12px;
                background: #e0e7ff;
                color: #3730a3;
                border-radius: 4px;
                font-size: 13px;
                font-weight: 500;
            }
            
            .languages-list, .certifications-list {
                list-style: none;
            }
            
            .languages-list li, .certifications-list li {
                padding: 8px 0;
                font-size: 14px;
                color: #475569;
                border-bottom: 1px solid #f1f5f9;
            }
            
            .languages-list li:last-child,
            .certifications-list li:last-child {
                border-bottom: none;
            }
            
            .footer {
                margin-top: 40px;
                padding-top: 20px;
                border-top: 2px solid #e2e8f0;
                text-align: center;
                font-size: 12px;
                color: #94a3b8;
            }
            
            @media print {
                body {
                    padding: 20px;
                }
                
                .section {
                    page-break-inside: avoid;
                }
            }
        </style>
    `;
    
    let html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${personalInfo?.fullName || 'Resume'} - CV</title>
            ${styles}
        </head>
        <body>
            <!-- Header -->
            <div class="header">
                <h1>${personalInfo?.fullName || 'Your Name'}</h1>
                <div class="contact-info">
                    ${personalInfo?.email ? `<span>📧 ${personalInfo.email}</span>` : ''}
                    ${personalInfo?.phone ? `<span>📱 ${personalInfo.phone}</span>` : ''}
                    ${personalInfo?.location ? `<span>📍 ${personalInfo.location}</span>` : ''}
                    ${personalInfo?.linkedin ? `<span>🔗 LinkedIn</span>` : ''}
                    ${personalInfo?.github ? `<span>💻 GitHub</span>` : ''}
                    ${personalInfo?.website ? `<span>🌐 Website</span>` : ''}
                </div>
            </div>
    `;
    
    // Professional Summary
    if (summary) {
        html += `
            <div class="section">
                <h2 class="section-title">Professional Summary</h2>
                <p class="summary">${summary}</p>
            </div>
        `;
    }
    
    // Experience
    if (experience && experience.length > 0) {
        html += `
            <div class="section">
                <h2 class="section-title">Work Experience</h2>
        `;
        
        experience.forEach(exp => {
            const startDate = exp.startDate || '';
            const endDate = exp.current ? 'Present' : (exp.endDate || '');
            const dateRange = `${startDate} - ${endDate}`;
            
            html += `
                <div class="experience-item">
                    <div class="item-header">
                        <div>
                            <div class="item-title">${exp.position || ''}</div>
                            <div class="item-company">${exp.company || ''}</div>
                            ${exp.location ? `<div class="item-location">${exp.location}</div>` : ''}
                        </div>
                        <div class="item-date">${dateRange}</div>
                    </div>
                    ${exp.description ? `<p class="item-description">${exp.description}</p>` : ''}
                    ${exp.highlights && exp.highlights.length > 0 ? `
                        <ul class="highlights">
                            ${exp.highlights.map(h => `<li>${h}</li>`).join('')}
                        </ul>
                    ` : ''}
                </div>
            `;
        });
        
        html += `</div>`;
    }
    
    // Education
    if (education && education.length > 0) {
        html += `
            <div class="section">
                <h2 class="section-title">Education</h2>
        `;
        
        education.forEach(edu => {
            const startDate = edu.startDate || '';
            const endDate = edu.endDate || '';
            const dateRange = startDate && endDate ? `${startDate} - ${endDate}` : '';
            
            html += `
                <div class="education-item">
                    <div class="item-header">
                        <div>
                            <div class="item-title">${edu.degree || ''} ${edu.field ? `in ${edu.field}` : ''}</div>
                            <div class="item-company">${edu.institution || ''}</div>
                            ${edu.location ? `<div class="item-location">${edu.location}</div>` : ''}
                        </div>
                        ${dateRange ? `<div class="item-date">${dateRange}</div>` : ''}
                    </div>
                    ${edu.gpa ? `<p class="item-description">GPA: ${edu.gpa}</p>` : ''}
                </div>
            `;
        });
        
        html += `</div>`;
    }
    
    // Skills
    if (skills && (skills.technical?.length > 0 || skills.soft?.length > 0)) {
        html += `
            <div class="section">
                <h2 class="section-title">Skills</h2>
                <div class="skills-grid">
        `;
        
        if (skills.technical && skills.technical.length > 0) {
            html += `
                <div class="skill-category">
                    <div class="skill-category-title">Technical Skills</div>
                    <div class="skill-items">
                        ${skills.technical.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                    </div>
                </div>
            `;
        }
        
        if (skills.soft && skills.soft.length > 0) {
            html += `
                <div class="skill-category">
                    <div class="skill-category-title">Soft Skills</div>
                    <div class="skill-items">
                        ${skills.soft.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                    </div>
                </div>
            `;
        }
        
        html += `
                </div>
            </div>
        `;
    }
    
    // Languages
    if (languages && languages.length > 0) {
        html += `
            <div class="section">
                <h2 class="section-title">Languages</h2>
                <ul class="languages-list">
                    ${languages.map(lang => `
                        <li>
                            <strong>${lang.language}</strong>
                            ${lang.proficiency ? ` - ${lang.proficiency}` : ''}
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
    }
    
    // Certifications
    if (certifications && certifications.length > 0) {
        html += `
            <div class="section">
                <h2 class="section-title">Certifications</h2>
                <ul class="certifications-list">
                    ${certifications.map(cert => `
                        <li>
                            <strong>${cert.name}</strong>
                            ${cert.issuer ? ` - ${cert.issuer}` : ''}
                            ${cert.date ? ` (${cert.date})` : ''}
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
    }
    
    // Footer
    html += `
            <div class="footer">
                Generated with CV Master AI - ${new Date().toLocaleDateString()}
            </div>
        </body>
        </html>
    `;
    
    return html;
};

/**
 * Generate PDF using Puppeteer (if available) or save as HTML
 */
export const generatePDF = async (cvData, options = {}) => {
    const {
        template = 'modern',
        filename = null,
        format = 'A4',
    } = options;
    
    try {
        // Validate CV data
        if (!cvData || typeof cvData !== 'object') {
            throw new ValidationError('Invalid CV data');
        }
        
        // Generate HTML content
        const htmlContent = generateHTMLContent(cvData, template);
        
        // Generate secure filename
        const timestamp = Date.now();
        const randomString = crypto.randomBytes(8).toString('hex');
        const pdfFilename = filename || `cv-${randomString}-${timestamp}.pdf`;
        const htmlFilename = `cv-${randomString}-${timestamp}.html`;
        
        // Save HTML file (fallback and preview)
        const htmlPath = path.join(exportsDir, htmlFilename);
        fs.writeFileSync(htmlPath, htmlContent, 'utf8');
        
        logger.info('HTML file generated', {
            filename: htmlFilename,
            path: htmlPath,
            size: fs.statSync(htmlPath).size,
        });
        
        // Try to generate PDF using Puppeteer (if available)
        let pdfPath = null;
        let pdfGenerated = false;
        
        try {
            // Dynamic import to check if puppeteer is available
            const puppeteer = await import('puppeteer').catch(() => null);
            
            if (puppeteer) {
                pdfPath = path.join(exportsDir, pdfFilename);
                
                const browser = await puppeteer.launch({
                    headless: 'new',
                    args: ['--no-sandbox', '--disable-setuid-sandbox'],
                });
                
                const page = await browser.newPage();
                await page.setContent(htmlContent, {
                    waitUntil: 'networkidle0',
                });
                
                await page.pdf({
                    path: pdfPath,
                    format: format,
                    printBackground: true,
                    margin: {
                        top: '20mm',
                        right: '15mm',
                        bottom: '20mm',
                        left: '15mm',
                    },
                });
                
                await browser.close();
                pdfGenerated = true;
                
                logger.info('PDF generated successfully', {
                    filename: pdfFilename,
                    path: pdfPath,
                    size: fs.statSync(pdfPath).size,
                });
            }
        } catch (puppeteerError) {
            logger.warn('Puppeteer not available or PDF generation failed', {
                error: puppeteerError.message,
                fallback: 'HTML only',
            });
        }
        
        return {
            success: true,
            format: pdfGenerated ? 'pdf' : 'html',
            filename: pdfGenerated ? pdfFilename : htmlFilename,
            path: pdfGenerated ? pdfPath : htmlPath,
            url: `/api/export/download/${pdfGenerated ? pdfFilename : htmlFilename}`,
            htmlPreview: `/api/export/preview/${htmlFilename}`,
            size: fs.statSync(pdfGenerated ? pdfPath : htmlPath).size,
        };
        
    } catch (error) {
        logger.error('PDF generation failed', error, {
            cvData: cvData?.personalInfo?.fullName,
        });
        throw new InternalServerError('Failed to generate PDF');
    }
};

/**
 * Clean up old export files
 */
export const cleanupOldExports = (maxAgeInDays = 7) => {
    try {
        const now = Date.now();
        const maxAge = maxAgeInDays * 24 * 60 * 60 * 1000;
        
        if (!fs.existsSync(exportsDir)) return;
        
        const files = fs.readdirSync(exportsDir);
        let deletedCount = 0;
        
        files.forEach(file => {
            const filePath = path.join(exportsDir, file);
            const stats = fs.statSync(filePath);
            
            if (stats.isFile()) {
                const age = now - stats.mtimeMs;
                if (age > maxAge) {
                    fs.unlinkSync(filePath);
                    deletedCount++;
                }
            }
        });
        
        if (deletedCount > 0) {
            logger.info('Old export files cleaned up', {
                directory: exportsDir,
                count: deletedCount,
                maxAge: `${maxAgeInDays} days`,
            });
        }
        
        return deletedCount;
    } catch (error) {
        logger.error('Failed to clean up old exports', error);
        return 0;
    }
};

/**
 * Get export file
 */
export const getExportFile = (filename) => {
    try {
        // Sanitize filename
        const sanitized = path.basename(filename);
        const filePath = path.join(exportsDir, sanitized);
        
        // Check if file exists
        if (!fs.existsSync(filePath)) {
            return null;
        }
        
        // Check file age (security - max 24 hours)
        const stats = fs.statSync(filePath);
        const age = Date.now() - stats.mtimeMs;
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours
        
        if (age > maxAge) {
            // File too old, delete it
            fs.unlinkSync(filePath);
            return null;
        }
        
        return filePath;
    } catch (error) {
        logger.error('Failed to get export file', error, { filename });
        return null;
    }
};

export default {
    generatePDF,
    cleanupOldExports,
    getExportFile,
};
