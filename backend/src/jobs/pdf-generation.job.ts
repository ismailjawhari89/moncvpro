
export interface PDFGenerationJobData {
    cvId: string;
    format: 'standard' | 'hq' | 'ats';
}

export const PDF_GENERATION_JOB_NAME = 'pdf-generation';
