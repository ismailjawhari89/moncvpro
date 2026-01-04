
import { pdfQueue } from '../queues/pdfQueue';
import { generatePDF, uploadToS3 } from '../services/pdf.service';
import { notifyUser, emitProgress } from '../websocket/websocket.service';

// Mock Database
const db = {
    cv: {
        findUnique: async ({ where }: any) => {
            // Mock return
            return { id: where.id, name: 'Test User', content: {} };
        },
        update: async ({ where, data }: any) => {
            console.log(`Database updated for CV ${where.id}`, data);
            return { id: where.id, ...data };
        }
    }
};

console.log('PDF Worker started...');

// Process queue
pdfQueue.process(5, async (job) => {
    try {
        console.log(`Processing job ${job.id}`);
        const { cvId, format } = job.data;

        // Progress updates
        await job.progress(10);
        emitProgress(cvId, 'pdf-generation', 10);

        // Get CV data from database
        const cv = await db.cv.findUnique({ where: { id: cvId } });
        if (!cv) throw new Error('CV not found');

        await job.progress(20);
        emitProgress(cvId, 'pdf-generation', 20);

        // Generate PDF
        const pdfBuffer = await generatePDF(cv, format);
        await job.progress(80);
        emitProgress(cvId, 'pdf-generation', 80);

        // Upload to S3
        const fileUrl = await uploadToS3(pdfBuffer, `${cvId}-${format}.pdf`);
        await job.progress(95);
        emitProgress(cvId, 'pdf-generation', 95);

        // Update database
        await db.cv.update({
            where: { id: cvId },
            data: {
                exports: {
                    create: {
                        format,
                        fileUrl,
                        generatedAt: new Date()
                    }
                }
            }
        });

        await job.progress(100);
        emitProgress(cvId, 'pdf-generation', 100);
        notifyUser(cvId, 'pdf-ready', { fileUrl, format });

        console.log(`Job ${job.id} completed successfully. URL: ${fileUrl}`);
        return { success: true, fileUrl };

    } catch (error: any) {
        console.error(`Job ${job.id} failed:`, error);
        throw new Error(`PDF generation failed: ${error.message}`);
    }
});
