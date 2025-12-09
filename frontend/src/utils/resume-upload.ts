export interface UploadResult {
    success: boolean;
    file?: File;
    text?: string;
    error?: string;
}

export const validateFile = (file: File): string | null => {
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
        return 'Invalid file type. Please upload PDF, DOCX, or TXT.';
    }

    if (file.size > maxSize) {
        return 'File size exceeds 5MB limit.';
    }

    return null;
};

export const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = (e) => reject(e);
        reader.readAsText(file); // Note: This is simple text reading, real PDF parsing would need a library
    });
};

export const simulateAnalysis = async (): Promise<any> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                score: Math.floor(Math.random() * (95 - 70) + 70),
                keywords: ['React', 'TypeScript', 'Node.js', 'Team Leadership'],
                issues: [
                    'Missing quantifiable results in experience section',
                    'Summary could be more impactful',
                    'Consider adding a "Skills" section if missing'
                ]
            });
        }, 2000);
    });
};
